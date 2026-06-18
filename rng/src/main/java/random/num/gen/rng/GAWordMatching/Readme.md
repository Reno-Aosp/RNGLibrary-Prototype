# Genetic Algorithm — Word Matching (Java + Spring Boot + Lombok)

A Java port of the Colab notebook
[GA word matching](https://colab.research.google.com/drive/1k4r9NY55iUqsm219ScNvxR_G07a2gKVe?usp=sharing),
rewritten as a **Spring Boot CLI app** with **Lombok**.

Target string: **`Reno Rizky`** (10 characters).

---

## How to run

```bash
mvn -q -DskipTests package
java -jar target/ga-word-matching-1.0.0.jar
```

The `ExperimentRunner` (a `@Component implements CommandLineRunner`) executes
every experiment requested by the assignment and prints the results to stdout.

---

## Project layout

| File | Purpose |
| --- | --- |
| `pom.xml` | Spring Boot parent + Lombok dependency |
| `GaWordMatchingApplication.java` | Spring Boot entry point |
| `Individual.java` | One candidate solution (chromosome + fitness). Lombok `@Getter/@Setter/@AllArgsConstructor` |
| `GaConfig.java` | Run config — populationSize, crossoverThreshold, mutationThreshold, elitismCount, seed. Lombok `@Builder` |
| `GaResult.java` | Outcome of a run. Lombok `@Builder` |
| `GeneticAlgorithm.java` | Core GA: random gene/chromosome, `mate()`, `run()` loop |
| `ExperimentRunner.java` | Spring `@Component` that runs Tasks 3–6 |

---

## Mapping to the Colab notebook

| Notebook concept | Java equivalent |
| --- | --- |
| `GENES` constant | `GeneticAlgorithm.GENES` |
| `mutated_genes()` | `GeneticAlgorithm.randomGene()` |
| `create_gnome()` | `GeneticAlgorithm.randomChromosome()` |
| class `Individual` | `Individual` |
| `cal_fitness()` | `Individual.computeFitness()` |
| `mate()` | `GeneticAlgorithm.mate()` |
| main loop in `__main__` | `GeneticAlgorithm.run()` |

The crossover/mutation logic is a one-to-one port of the notebook:

```text
prob = random()
prob <  crossoverThreshold  → gene comes from parent 1
prob <  mutationThreshold   → gene comes from parent 2
prob >= mutationThreshold   → gene is mutated (random new gene)
```

So `crossoverThreshold = 0.45` and `mutationThreshold = 0.90` reproduces the
Colab defaults, where mutation probability = `1 - 0.90 = 0.10`.

---

## Experiment results (seed = 42)

### Task 3 — default settings

| Population | Crossover thr. | Mutation prob. | Elitism | **Generations** |
| --- | --- | --- | --- | --- |
| 100 | 0.45 | 0.10 | 10 | **59** |

`"Reno Rizky"` is found in **59 generations**.

### Task 4 — population size sweep

| Population | **Generations** | Wall time |
| --- | --- | --- |
| 10 | **1088** | 26 ms |
| 100 | **59** | 11 ms |
| 10 000 | **10** | 176 ms |
| 100 000 | **9** | 626 ms |

### Task 5 — original probabilities (0.45 / 0.90)

Same setup as Task 3 → **59 generations**. (Listed explicitly so it can be
compared side-by-side with Task 6.)

### Task 6 — increased mutation probability

| Crossover thr. | Mutation prob. | **Generations** |
| --- | --- | --- |
| 0.45 | 0.10 (Task 5 baseline) | **59** |
| 0.35 | 0.30 (bonus) | **52** |
| 0.20 | 0.60 (high) | **10 330** |

A small bump in mutation probability can actually *help* (52 < 59) because it
introduces fresh genetic material when the population stagnates.
A very high mutation probability (0.60) destroys the GA — the algorithm
behaves almost like random search and needs ~175× more generations.

---

## Task 7 — Analysis

### Definitions in the context of this program

| Term | Meaning here |
| --- | --- |
| **Gene** | A single character chosen from the `GENES` pool (`a-z`, `A-Z`, digits, space, punctuation). |
| **Chromosome** | The full 10-character `String` an individual carries (e.g. `"Reno Rzkyy"`). It has the same length as the target. |
| **Individual** | One candidate solution = chromosome + cached fitness. Implemented as the `Individual` class. |
| **Population** | The collection of `Individual`s alive at the same time — `List<Individual>` of size `populationSize`. |
| **Generation** | One iteration of the main loop in `GeneticAlgorithm.run()`: sort by fitness → carry over elites → fill the rest by `mate()` → repeat. The integer printed in the output (e.g. *FOUND in generation 59*) is the count of these iterations. |

### Effect of crossover and mutation probability

Inside `mate()` each gene of the child is decided by `random()`:

* **Crossover probability** is `mutationThreshold` (= `1 - mutation probability`).
  A high crossover probability means children mostly **inherit** genes from
  the two parents → fast convergence to whatever the parents already encode,
  but little exploration.
* **Mutation probability** is `1 - mutationThreshold`. It is the chance that a
  child gene is replaced by a random fresh gene. It controls **exploration**.

Observed trade-off:

| Mutation prob. | Behaviour | Generations |
| --- | --- | --- |
| 0.10 | Healthy mix of exploitation + a little exploration | 59 |
| 0.30 | Slightly more exploration, sometimes faster | 52 |
| 0.60 | Mostly random gene replacement → close to random search | 10 330 |

So:

* **Too little mutation** → the population converges prematurely and risks
  getting stuck if a key character is missing.
* **Too much mutation** → good genes are constantly destroyed; the GA loses
  its ability to *exploit* what it has already learned.
* The "sweet spot" for this 10-character target sits in the **0.05 – 0.30**
  range with a moderate population (≈ 100).

### Effect of population size (Task 4)

* **Pop = 10** is too small — the gene pool is impoverished and the GA must
  rely heavily on mutation, which is slow (1088 generations).
* **Pop = 100** is comfortable for a 10-character target (59 generations).
* **Pop = 10 000 / 100 000** finds the answer in 9–10 generations because the
  initial random population is so big that almost every required character
  already exists somewhere — selection alone is enough. But each generation
  is much more expensive, so wall-clock time *grows* even though generation
  count drops.

Bigger population ≠ "better" in absolute terms — there's a trade-off between
**number of generations** and **work per generation**.

### Elitism

**Elitism** is the strategy of copying the top-N best individuals from
generation *G* into generation *G+1* **unchanged**, before generating any
children.

In `GeneticAlgorithm.run()` this is the loop:

```java
int elite = Math.min(config.getElitismCount(), popSize);
for (int i = 0; i < elite; i++) {
    nextGen.add(population.get(i)); // top-N carried over as-is
}
```

Why it matters:

1. It **guarantees the best fitness never decreases** between generations.
   Without elitism a great parent could be lost if all its children are unlucky.
2. It speeds up convergence because good chromosomes are immediately
   available as parents in the next round.
3. It dampens the destructive effect of high mutation rates a bit — the best
   solution is preserved even if mutation ruins many children.

The flip side: if elitism is too aggressive (e.g. half of the population)
diversity collapses and the GA can get stuck in a local optimum.

---

## Tying it back to the questions

* **Berapa generasi untuk menemukan "Reno Rizky"?** → **59 generasi** dengan
  populasi 100 dan probabilitas default (`crossover 0.45`, `mutation 0.10`).
* **Pengaruh ukuran populasi:** populasi sangat kecil (10) butuh ribuan
  generasi; populasi sangat besar (100k) hanya butuh 9 generasi tetapi tiap
  generasi jauh lebih mahal.
* **Pengaruh probabilitas crossover/mutasi:** mutasi terlalu tinggi merusak
  konvergensi (10 330 generasi pada mutasi 0.60), mutasi rendah dengan
  crossover yang sehat memberikan hasil tercepat.
* **Elitism** menjaga individu terbaik agar tidak hilang antar generasi dan
  menstabilkan konvergensi.

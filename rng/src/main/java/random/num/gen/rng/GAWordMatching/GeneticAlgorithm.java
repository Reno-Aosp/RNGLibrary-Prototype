package random.num.gen.rng.GAWordMatching;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Random;

/**
 * Faithful Java port of the colab Python GA for word matching.
 *
 * Genes pool: lowercase + uppercase + digits + space + common punctuation
 * (matches the colab notebook's GENES string).
 */
@Slf4j
@RequiredArgsConstructor
public class GeneticAlgorithm {

    public static final String GENES =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890, .-;:_!\"#%&/()=?@${[]}";

    private final GaConfig config;
    private final Random random;

    public GeneticAlgorithm(GaConfig config) {
        this(config, new Random(config.getSeed()));
    }

    /** Random gene from the gene pool. */
    public char randomGene() {
        return GENES.charAt(random.nextInt(GENES.length()));
    }

    /** Random chromosome of the same length as the target. */
    public String randomChromosome() {
        int n = config.getTarget().length();
        StringBuilder sb = new StringBuilder(n);
        for (int i = 0; i < n; i++) {
            sb.append(randomGene());
        }
        return sb.toString();
    }

    /**
     * Crossover + mutation, controlled by the two thresholds in {@link GaConfig}.
     */
    public Individual mate(Individual parent1, Individual parent2) {
        String p1 = parent1.getChromosome();
        String p2 = parent2.getChromosome();
        int n = p1.length();
        StringBuilder child = new StringBuilder(n);

        for (int i = 0; i < n; i++) {
            double prob = random.nextDouble();
            if (prob < config.getCrossoverThreshold()) {
                child.append(p1.charAt(i));
            } else if (prob < config.getMutationThreshold()) {
                child.append(p2.charAt(i));
            } else {
                child.append(randomGene());
            }
        }
        return new Individual(child.toString(), config.getTarget());
    }

    /** Run the GA and return a result describing the outcome. */
    public GaResult run() {
        long start = System.currentTimeMillis();
        String target = config.getTarget();
        int popSize = config.getPopulationSize();

        // 1. Initial population
        List<Individual> population = new ArrayList<>(popSize);
        for (int i = 0; i < popSize; i++) {
            population.add(new Individual(randomChromosome(), target));
        }

        int generation = 0;
        while (generation < config.getMaxGenerations()) {
            // Sort ascending by fitness (lower = better)
            population.sort(Comparator.comparingInt(Individual::getFitness));

            Individual best = population.get(0);
            if (best.getFitness() == 0) {
                long elapsed = System.currentTimeMillis() - start;
                return GaResult.builder()
                        .solutionFound(true)
                        .generations(generation)
                        .bestChromosome(best.getChromosome())
                        .bestFitness(0)
                        .elapsedMillis(elapsed)
                        .config(config)
                        .build();
            }

            List<Individual> nextGen = new ArrayList<>(popSize);

            // 2a. Elitism: carry over top N unchanged
            int elite = Math.min(config.getElitismCount(), popSize);
            for (int i = 0; i < elite; i++) {
                nextGen.add(population.get(i));
            }

            // 2b. Fill the rest by mating from the top 50%
            int matingPoolSize = Math.max(2, popSize / 2);
            int toFill = popSize - elite;
            for (int i = 0; i < toFill; i++) {
                Individual parent1 = population.get(random.nextInt(matingPoolSize));
                Individual parent2 = population.get(random.nextInt(matingPoolSize));
                nextGen.add(mate(parent1, parent2));
            }

            population = nextGen;
            generation++;
        }

        // Did not converge within maxGenerations
        population.sort(Comparator.comparingInt(Individual::getFitness));
        Individual best = population.get(0);
        long elapsed = System.currentTimeMillis() - start;
        return GaResult.builder()
                .solutionFound(false)
                .generations(generation)
                .bestChromosome(best.getChromosome())
                .bestFitness(best.getFitness())
                .elapsedMillis(elapsed)
                .config(config)
                .build();
    }
}

package random.num.gen.rng.GAWordMatching;

import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Runs every experiment requested by the assignment and prints results to stdout.
 *
 * Target  : "Reno Rizky"
 * Tasks   : 3 (default), 4 (population sizes), 5 (original probs), 6 (high mutation)
 */
@Slf4j
@Component
public class ExperimentRunner implements CommandLineRunner {

    private static final String TARGET = "Reno Rizky";
    /** Same seed across experiments so the comparisons are apples-to-apples. */
    private static final long SEED = 42L;

    @Override
    public void run(String... args) {
        System.out.println("=========================================================");
        System.out.println("  Genetic Algorithm — Word Matching");
        System.out.println("  Target  : \"" + TARGET + "\"");
        System.out.println("  Length  : " + TARGET.length() + " genes");
        System.out.println("=========================================================");

        // Task 3 — default population (100), original 0.45 / 0.90 thresholds
        System.out.println("\n--- Task 3: default population (100), prob thresholds 0.45 / 0.90 ---");
        runOne(GaConfig.builder()
                .target(TARGET)
                .populationSize(100)
                .crossoverThreshold(0.45)
                .mutationThreshold(0.90)
                .maxGenerations(20_000)
                .elitismCount(10)
                .seed(SEED)
                .build());

        // Task 4 — population sweep
        System.out.println("\n--- Task 4: population size sweep (10, 100, 10000, 100000) ---");
        int[] popSizes = {10, 100, 10_000, 100_000};
        List<GaResult> popResults = new ArrayList<>();
        for (int pop : popSizes) {
            popResults.add(runOne(GaConfig.builder()
                    .target(TARGET)
                    .populationSize(pop)
                    .crossoverThreshold(0.45)
                    .mutationThreshold(0.90)
                    .maxGenerations(pop == 10 ? 20_000 : 5_000)
                    .elitismCount(Math.max(1, pop / 10))
                    .seed(SEED)
                    .build()));
        }
        printSummaryTable("Task 4 summary", popResults);

        // Task 5 — explicitly the "original" probabilities (same as Task 3 but printed for clarity)
        System.out.println("\n--- Task 5: original probabilities (0.45 crossover / 0.10 mutation) ---");
        runOne(GaConfig.builder()
                .target(TARGET)
                .populationSize(100)
                .crossoverThreshold(0.45)
                .mutationThreshold(0.90) // mutation prob = 1 - 0.90 = 0.10
                .maxGenerations(20_000)
                .elitismCount(10)
                .seed(SEED)
                .build());

        // Task 6 — much higher mutation probability
        System.out.println("\n--- Task 6: HIGH mutation probability (mutation prob ≈ 0.60) ---");
        runOne(GaConfig.builder()
                .target(TARGET)
                .populationSize(100)
                .crossoverThreshold(0.20)
                .mutationThreshold(0.40) // mutation prob = 1 - 0.40 = 0.60
                .maxGenerations(20_000)
                .elitismCount(10)
                .seed(SEED)
                .build());

        // Bonus: medium mutation (0.30) for a smoother trend
        System.out.println("\n--- Task 6 (bonus): medium mutation probability (≈ 0.30) ---");
        runOne(GaConfig.builder()
                .target(TARGET)
                .populationSize(100)
                .crossoverThreshold(0.35)
                .mutationThreshold(0.70)
                .maxGenerations(20_000)
                .elitismCount(10)
                .seed(SEED)
                .build());

        System.out.println("\nAll experiments finished.");
    }

    private GaResult runOne(GaConfig config) {
        System.out.printf("> population=%d, crossoverThreshold=%.2f, mutationProb=%.2f, elitism=%d%n",
                config.getPopulationSize(),
                config.getCrossoverThreshold(),
                1.0 - config.getMutationThreshold(),
                config.getElitismCount());

        GeneticAlgorithm ga = new GeneticAlgorithm(config);
        GaResult result = ga.run();

        if (result.isSolutionFound()) {
            System.out.printf("  FOUND in generation %d (best=\"%s\", elapsed=%d ms)%n",
                    result.getGenerations(),
                    result.getBestChromosome(),
                    result.getElapsedMillis());
        } else {
            System.out.printf("  NOT FOUND after %d generations (best=\"%s\", fitness=%d, elapsed=%d ms)%n",
                    result.getGenerations(),
                    result.getBestChromosome(),
                    result.getBestFitness(),
                    result.getElapsedMillis());
        }
        return result;
    }

    private void printSummaryTable(String title, List<GaResult> results) {
        System.out.println("\n" + title);
        System.out.printf("  %-10s %-12s %-15s %-10s%n", "popSize", "generations", "elapsed (ms)", "found?");
        for (GaResult r : results) {
            System.out.printf("  %-10d %-12d %-15d %-10s%n",
                    r.getConfig().getPopulationSize(),
                    r.getGenerations(),
                    r.getElapsedMillis(),
                    r.isSolutionFound() ? "yes" : "no");
        }
    }
}

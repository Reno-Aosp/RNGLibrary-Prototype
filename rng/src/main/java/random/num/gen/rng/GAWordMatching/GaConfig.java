package random.num.gen.rng.GAWordMatching;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

/**
 * Configuration for a single Genetic Algorithm run.
 * <p>
 * crossoverThreshold and mutationThreshold are cumulative probabilities used in
 * {@link GeneticAlgorithm#mate(Individual, Individual)}:
 * <ul>
 *   <li>prob &lt; crossoverThreshold       → take gene from parent 1</li>
 *   <li>crossoverThreshold &le; prob &lt; mutationThreshold → take gene from parent 2</li>
 *   <li>prob &ge; mutationThreshold        → mutate (random new gene)</li>
 * </ul>
 * Mutation probability = (1 - mutationThreshold).
 */
@Getter
@Builder
@AllArgsConstructor
@ToString
public class GaConfig {
    private final String target;
    private final int populationSize;
    private final double crossoverThreshold; // e.g. 0.45
    private final double mutationThreshold;  // e.g. 0.90  → mutation prob = 0.10
    private final int maxGenerations;
    private final long seed;
    /** Number of best individuals carried over unchanged each generation (elitism). */
    private final int elitismCount;
}

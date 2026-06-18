package random.num.gen.rng.GAWordMatching;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@AllArgsConstructor
@ToString
public class GaResult {
    private final boolean solutionFound;
    private final int generations;
    private final String bestChromosome;
    private final int bestFitness;
    private final long elapsedMillis;
    private final GaConfig config;
}

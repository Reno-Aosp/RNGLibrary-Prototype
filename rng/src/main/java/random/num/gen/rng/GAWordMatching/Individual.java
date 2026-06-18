package random.num.gen.rng.GAWordMatching;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Represents a single Individual in the Population.
 * Its chromosome is the String of genes (characters).
 * The fitness is the number of genes that DO NOT match the target
 * (lower is better; 0 means a perfect match).
 */
@Getter
@Setter
@AllArgsConstructor
public class Individual {
    private String chromosome;
    private int fitness;

    public Individual(String chromosome, String target) {
        this.chromosome = chromosome;
        this.fitness = computeFitness(chromosome, target);
    }

    public static int computeFitness(String chromosome, String target) {
        int diff = 0;
        for (int i = 0; i < target.length(); i++) {
            if (chromosome.charAt(i) != target.charAt(i)) {
                diff++;
            }
        }
        return diff;
    }
}

package random.num.gen.rng.AIAssignment;

import java.util.Map;

import random.num.gen.rng.AIAssignment.CompoundSymptom.CompoundSymptomType;
import random.num.gen.rng.AIAssignment.Symptom.SymptomType;

public class Rule {
    private final CompoundSymptomType compound;
    private final Map<SymptomType, Integer> weights;

    public Rule(CompoundSymptomType compound, Map<SymptomType, Integer> weights) {
        this.compound = compound;
        this.weights = weights;
    }

    public CompoundSymptomType getCompound() {
        return compound;
    }

    public Map<SymptomType, Integer> getWeights() {
        return weights;
    }
}
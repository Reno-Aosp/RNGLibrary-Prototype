package random.num.gen.rng.AIAssignment;

import java.util.Map;
import java.util.Set;

import random.num.gen.rng.AIAssignment.CompoundSymptom.CompoundSymptomType;
import random.num.gen.rng.AIAssignment.Symptom.SymptomType;
import random.num.gen.rng.AIAssignment.Target.TargetType;

public class InferenceEngine {

    private final KnowledgeBase kb;
    private final int threshold; // e.g. 50

    public InferenceEngine(KnowledgeBase kb, int threshold) {
        this.kb = kb;
        this.threshold = threshold;
    }

    /**
     * @param positiveSymptoms set of basic symptoms answered YES by user
     * @return DiagnosisResult (best target + all scores)
     */
    public DiagnosisResult diagnose(Set<SymptomType> positiveSymptoms) {
        DiagnosisResult result = new DiagnosisResult();

        for (TargetType t : kb.getAllTargets()) {
            int score = 0;

            for (CompoundSymptomType c : kb.getCompounds(t)) {
                Rule rule = kb.getRule(c);
                if (rule == null) continue;

                for (Map.Entry<SymptomType, Integer> e : rule.getWeights().entrySet()) {
                    SymptomType s = e.getKey();
                    int w = e.getValue();
                    if (positiveSymptoms.contains(s)) {
                        score += w;
                    }
                }
            }

            result.putScore(t, score);
        }

        result.determineBest(threshold);
        return result;
    }
}
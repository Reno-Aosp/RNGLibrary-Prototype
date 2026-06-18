package random.num.gen.rng.AIAssignment;

import java.util.LinkedHashMap;
import java.util.Map;

import random.num.gen.rng.AIAssignment.Target.TargetType;

public class DiagnosisResult {
    private final Map<TargetType, Integer> scores = new LinkedHashMap<>();
    private TargetType bestTarget;
    private int bestScore;
    private int threshold;

    public void putScore(TargetType t, int score) {
        scores.put(t, score);
    }

    public void determineBest(int threshold) {
        this.threshold = threshold;
        for (Map.Entry<TargetType, Integer> e : scores.entrySet()) {
            if (e.getValue() > bestScore) {
                bestScore = e.getValue();
                bestTarget = e.getKey();
            }
        }
    }

    public TargetType getBestTarget() {
        if (bestScore >= threshold) {
            return bestTarget;
        }
        return null; // no diagnosis above threshold
    }

    public int getBestScore() {
        return bestScore;
    }

    public Map<TargetType, Integer> getScores() {
        return scores;
    }
}
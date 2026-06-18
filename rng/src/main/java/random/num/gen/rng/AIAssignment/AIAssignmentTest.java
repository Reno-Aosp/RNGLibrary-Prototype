package random.num.gen.rng.AIAssignment;

import random.num.gen.rng.AIAssignment.CompoundSymptom.CompoundSymptomType;
import random.num.gen.rng.AIAssignment.Symptom.SymptomType;
import random.num.gen.rng.AIAssignment.Target.TargetType;

import java.util.*;

public class AIAssignmentTest {
    public static void main(String[] args) {
        System.out.println("Testing AIAssignment KnowledgeBase...");
        
        // Create KnowledgeBase instance
        KnowledgeBase kb = new KnowledgeBase();
        
        // Test 1: Get all targets
        System.out.println("\n=== All Targets ===");
        for (TargetType target : kb.getAllTargets()) {
            System.out.println("- " + target);
        }
        
        // Test 2: Get compounds for T33_STAPHYLOCOCCUS_AUREUS
        System.out.println("\n=== Compounds for T33_STAPHYLOCOCCUS_AUREUS ===");
        List<CompoundSymptomType> compounds = kb.getCompounds(TargetType.T33_STAPHYLOCOCCUS_AUREUS);
        for (CompoundSymptomType compound : compounds) {
            System.out.println("- " + compound);
            
            // Get rule for this compound
            Rule rule = kb.getRule(compound);
            if (rule != null) {
                System.out.println("  Weights:");
                for (Map.Entry<SymptomType, Integer> entry : rule.getWeights().entrySet()) {
                    System.out.println("    " + entry.getKey() + ": " + entry.getValue() + "%");
                }
            }
        }
        
        System.out.println("\nTest completed!");
    }
}
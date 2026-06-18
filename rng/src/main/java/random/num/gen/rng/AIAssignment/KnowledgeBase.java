package random.num.gen.rng.AIAssignment;

import random.num.gen.rng.AIAssignment.Target.TargetType;
import random.num.gen.rng.AIAssignment.CompoundSymptom.CompoundSymptomType;
import random.num.gen.rng.AIAssignment.Symptom.SymptomType;

import java.util.*;

public class KnowledgeBase {

    // Target -> list of compound symptoms under it
    private final Map<TargetType, List<CompoundSymptomType>> targetToCompounds = new HashMap<>();

    // CompoundSymptom -> rule (basic symptoms + weights)
    private final Map<CompoundSymptomType, Rule> compoundRules = new HashMap<>();

    public KnowledgeBase() {
        initTargetCompounds();
        initCompoundRules();
    }

    private void initTargetCompounds() {
        // 33: uses 20, 21, 22, 23, 29 (see picture)
        targetToCompounds.put(TargetType.T33_STAPHYLOCOCCUS_AUREUS,
                Arrays.asList(
                        CompoundSymptomType.C20_MENCRET,
                        CompoundSymptomType.C21_MUNTAH,
                        CompoundSymptomType.C22_SAKIT_PERUT,
                        CompoundSymptomType.C23_DARAH_RENDAH,
                        CompoundSymptomType.C29_MAKAN_DAGING
                ));

        // 34: 20, 21, 22, 24, 30
        targetToCompounds.put(TargetType.T34_JAMUR_BERACUN,
                Arrays.asList(
                        CompoundSymptomType.C20_MENCRET,
                        CompoundSymptomType.C21_MUNTAH,
                        CompoundSymptomType.C22_SAKIT_PERUT,
                        CompoundSymptomType.C24_KOMA,
                        CompoundSymptomType.C30_MAKAN_JAMUR
                ));

        // 35: 20, 21, 22, 25, 26, 29
        targetToCompounds.put(TargetType.T35_SALMONELLAE,
                Arrays.asList(
                        CompoundSymptomType.C20_MENCRET,
                        CompoundSymptomType.C21_MUNTAH,
                        CompoundSymptomType.C22_SAKIT_PERUT,
                        CompoundSymptomType.C25_DEMAM,
                        CompoundSymptomType.C26_SEPTICAEMIA,
                        CompoundSymptomType.C29_MAKAN_DAGING
                ));

        // 36: 21, 27, 31
        targetToCompounds.put(TargetType.T36_CLOSTRIDIUM_BOTULINUM,
                Arrays.asList(
                        CompoundSymptomType.C21_MUNTAH,
                        CompoundSymptomType.C27_LUMPUH,
                        CompoundSymptomType.C31_MAKAN_MAKANAN_KALENG
                ));

        // 37: 28, 22, 25, 32
        targetToCompounds.put(TargetType.T37_CAMPYLOBACTER,
                Arrays.asList(
                        CompoundSymptomType.C28_MENCRET_BERDARAH,
                        CompoundSymptomType.C22_SAKIT_PERUT,
                        CompoundSymptomType.C25_DEMAM,
                        CompoundSymptomType.C32_MINUM_SUSU
                ));
        }

    private void initCompoundRules() {
        // C20_MENCRET
        Map<SymptomType, Integer> w20 = new LinkedHashMap<>();
        w20.put(SymptomType.B1_BUANG_AIR_BESAR_2X, 25);
        w20.put(SymptomType.B2_BERAK_ENCER, 25);
        w20.put(SymptomType.B4_LESU_TIDAK_BERGAIRAH, 25);
        w20.put(SymptomType.B5_TIDAK_SELERA_MAKAN, 25);
        compoundRules.put(CompoundSymptomType.C20_MENCRET,
                new Rule(CompoundSymptomType.C20_MENCRET, w20));

        // Placeholder for C21_MUNTAH. Fill with real weights from the diagram.
        Map<SymptomType, Integer> w21 = new LinkedHashMap<>();
        // w21.put(SymptomType.B6_MUAL_MUNTAH, 40);
        // w21.put(SymptomType.B2_BERAK_ENCER, 30);
        compoundRules.put(CompoundSymptomType.C21_MUNTAH,
                new Rule(CompoundSymptomType.C21_MUNTAH, w21));

        // Repeat for C22_SAKIT_PERUT through C32_MINUM_SUSU
    }

        // TODO: You fill the others based on the diagram:
        // For each compound (21, 22, 23, ..., 32), check which numbers are under it
        // and assign them to Symptom.byId(<number>) with correct weights.

        // Example template for one more:
        // Map<SymptomType, Integer> w21 = new LinkedHashMap<>();
        // w21.put(SymptomType.B6_MUAL_MUNTAH, 40);
        // w21.put(SymptomType.B2_BERAK_ENCER, 30);
        // ...
        // compoundRules.put(CompoundSymptomType.C21_MUNTAH, new Rule(CompoundSymptomType.C21_MUNTAH, w21));
    

    public List<CompoundSymptomType> getCompounds(TargetType t) {
        return targetToCompounds.getOrDefault(t, Collections.emptyList());
    }

    public Rule getRule(CompoundSymptomType c) {
        return compoundRules.get(c);
    }

    public Collection<TargetType> getAllTargets() {
        return targetToCompounds.keySet();
    }
}
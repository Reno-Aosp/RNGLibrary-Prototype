package random.num.gen.rng.AIAssignment;

public class Target {

    public enum TargetType {
        T33_STAPHYLOCOCCUS_AUREUS(33, "Keracunan Staphylococcus aureus"),
        T34_JAMUR_BERACUN(34, "Keracunan jamur beracun"),
        T35_SALMONELLAE(35, "Keracunan Salmonellae"),
        T36_CLOSTRIDIUM_BOTULINUM(36, "Keracunan Clostridium botulinum"),
        T37_CAMPYLOBACTER(37, "Keracunan Campylobacter");

        private final int id;
        private final String name;

        TargetType(int id, String name) {
            this.id = id;
            this.name = name;
        }

        public int getId() {
            return id;
        }

        public String getDisplayName() {
            return name;
        }
    }
}

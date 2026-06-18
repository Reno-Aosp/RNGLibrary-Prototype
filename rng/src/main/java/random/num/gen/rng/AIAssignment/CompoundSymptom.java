package random.num.gen.rng.AIAssignment;

public class CompoundSymptom {

    public enum CompoundSymptomType {
        C20_MENCRET(20, "Mencret"),
        C21_MUNTAH(21, "Muntah"),
        C22_SAKIT_PERUT(22, "Sakit perut"),
        C23_DARAH_RENDAH(23, "Tekanan darah rendah"),
        C24_KOMA(24, "Koma"),
        C25_DEMAM(25, "Demam"),
        C26_SEPTICAEMIA(26, "Septicaemia"),
        C27_LUMPUH(27, "Lumpuh"),
        C28_MENCRET_BERDARAH(28, "Mencret berdarah"),
        C29_MAKAN_DAGING(29, "Makan daging"),
        C30_MAKAN_JAMUR(30, "Makan jamur"),
        C31_MAKAN_MAKANAN_KALENG(31, "Makan makanan kaleng"),
        C32_MINUM_SUSU(32, "Minum susu");

        private final int id;
        private final String label;

        CompoundSymptomType(int id, String label) {
            this.id = id;
            this.label = label;
        }

        public int getId() {
            return id;
        }

        public String getLabel() {
            return label;
        }
    }
}

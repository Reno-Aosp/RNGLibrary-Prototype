package random.num.gen.rng.AIAssignment;

public class Symptom {

    public enum SymptomType {
        // 1-19: atomic symptoms
        B1_BUANG_AIR_BESAR_2X(1, "Buang air besar lebih dari 2 kali"),
        B2_BERAK_ENCER(2, "Berak encer"),
        B3_BERAK_BERDARAH(3, "Berak berdarah"),
        B4_LESU_TIDAK_BERGAIRAH(4, "Lesu dan tidak bergairah"),
        B5_TIDAK_SELERA_MAKAN(5, "Tidak selera makan"),
        B6_MUAL_MUNTAH(6, "Mual dan muntah lebih dari 1 kali"),
        B7_SAKIT_PERUT(7, "Sakit di bagian perut"),
        B8_TEKANAN_DARAH_RENDAH(8, "Tekanan darah rendah"),
        B9_PUSING(9, "Pusing"),
        B10_PINGSAN(10, "Pingsan"),
        B11_SUHU_BADAN_TINGGI(11, "Suhu badan tinggi"),
        B12_LUKA_TERTENTU(12, "Luka di bagian tertentu"),
        B13_TIDAK_DAPAT_MENGGERAKKAN(13, "Tidak dapat menggerakkan anggota badan tertentu"),
        B14_MEMAKAN_SESUATU(14, "Memakan sesuatu"),
        B15_MEMAKAN_DAGING(15, "Memakan daging"),
        B16_MEMAKAN_JAMUR(16, "Memakan jamur"),
        B17_MEMAKAN_MAKANAN_KALENG(17, "Memakan makanan kaleng"),
        B18_MEMBELI_SUSU(18, "Membeli susu"),
        B19_MINUM_SUSU(19, "Meminum susu");

        private final int id;
        private final String question;

        SymptomType(int id, String question) {
            this.id = id;
            this.question = question;
        }

        public int getId() {
            return id;
        }

        public String getQuestion() {
            return question;
        }

        public static SymptomType byId(int id) {
            for (SymptomType s : values()) {
                if (s.id == id) return s;
            }
            return null;
        }
    }
}

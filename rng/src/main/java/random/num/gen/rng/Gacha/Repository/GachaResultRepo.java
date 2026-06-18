package random.num.gen.rng.Gacha.Repository;

public class GachaResultRepo {
    public void savePullResult(String userId, String bannerId, String itemName, byte rarity) {
        // Placeholder for saving pull results to a database
        System.out.println("Saved pull result: " + userId + " pulled " + itemName + " (Rarity: " + rarity + ") from banner " + bannerId);
    }
}

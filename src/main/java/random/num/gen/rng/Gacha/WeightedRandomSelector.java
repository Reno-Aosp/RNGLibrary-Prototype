package random.num.gen.rng.Gacha;

import random.num.gen.rng.Gacha.Model.WeightedItem;

import java.util.List;
import java.util.Random;

public class WeightedRandomSelector {
    private Random random = new Random();

    public <T> T selectByWeight(List<WeightedItem<T>> items) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Items list cannot be null or empty");
        }

        float totalWeight = 0;
        for (WeightedItem<T> item : items) {
            totalWeight += item.getWeight();
        }

        float randomValue = random.nextFloat() * totalWeight;
        float cumulative = 0;

        for (WeightedItem<T> item : items) {
            cumulative += item.getWeight();
            if (randomValue <= cumulative) {
                return item.getItem();
            }
        }

        return items.get(items.size() - 1).getItem();
    }

    public byte rollForRarity(float fiveStarRate, float fourStarRate) {
        float roll = random.nextFloat() * 100;
        
        if (roll < fiveStarRate * 100) {
            return 5;
        } else if (roll < (fiveStarRate + fourStarRate) * 100) {
            return 4;
        }
        return 3;
    }
}
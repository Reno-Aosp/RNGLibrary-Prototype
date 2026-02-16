package random.num.gen.rng.Gacha.Service;

import random.num.gen.rng.Gacha.Model.GachaBanner;
import random.num.gen.rng.Gacha.Model.PullResult;
import random.num.gen.rng.Gacha.Model.WeightedItem;
import random.num.gen.rng.Gacha.WeightedRandomSelector;
import random.num.gen.rng.Gacha.Config.GachaConfig;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class GachaService {
    private WeightedRandomSelector selector;
    private PitySystem pitySystem;

    public GachaService() {
        this.selector = new WeightedRandomSelector();
        this.pitySystem = new PitySystem();
    }

    public PullResult singlePull(GachaBanner banner) {
        pitySystem.incrementPull();  // +1 to both counters

    System.out.println("DEBUG: 5-Star Pity = " + pitySystem.getFiveStarPity());
    System.out.println("DEBUG: 4-Star Pity = " + pitySystem.getFourStarPity());

        
        byte rarity = determineRarity(banner);

        System.out.println("DEBUG: Pulled Rarity = " + rarity);

        String itemName = selectItem(banner, rarity, rarity == 5 ? pitySystem.isGuaranteedFeaturedFiveStar() : pitySystem.isGuaranteedFeaturedFourStar());
        
        PullResult result = new PullResult(
            itemName, 
            rarity + "-Star", 
            pitySystem.getFiveStarPity(), 
            pitySystem.isGuaranteedFiveStar(),
            pitySystem.isGuaranteedFeaturedFiveStar(),
            pitySystem.getFourStarPity(),
            pitySystem.isGuaranteedFourStar(),
            pitySystem.isGuaranteedFeaturedFourStar(),
            LocalDateTime.now()
        );
        
        if (rarity == 5) {
            pitySystem.resetFiveStarPity();  // Reset 5-star pity only
        } else if (rarity == 4) {
            pitySystem.resetFourStarPity();  // Reset 4-star pity only
        }
        
        return result;
    }

    public List<PullResult> multiPull(GachaBanner banner, byte count) {
        List<PullResult> results = new ArrayList<>();
        for (byte i = 0; i < count; i++) {
            results.add(singlePull(banner));
        }
        return results;
    }

    private byte determineRarity(GachaBanner banner) {
        // 5-Star Hard Pity (guaranteed at 90)
        if (pitySystem.getFiveStarPity() >= GachaConfig.HARD_PITY) {
            return 5;
        }
        
        // 4-Star Hard Pity (guaranteed at 10)
        if (pitySystem.getFourStarPity() >= GachaConfig.FOUR_STAR_HARD_PITY) {
            return 4;
        }
        
        // 5-Star Soft Pity (enhanced rate starting at 75)
        if (pitySystem.getFiveStarPity() >= GachaConfig.SOFT_PITY) {
            float enhancedRate = banner.getFiveStarRate() * 6f;
            return selector.rollForRarity(enhancedRate, banner.getFourStarRate());
        }
        
        // 4-Star Soft Pity (enhanced rate starting at 6)
        if (pitySystem.getFourStarPity() >= GachaConfig.FOUR_STAR_SOFT_PITY) {
            float enhancedFourRate = banner.getFourStarRate() * 2f;
            return selector.rollForRarity(banner.getFiveStarRate(), enhancedFourRate);
        }
        
        // Normal rates
        return selector.rollForRarity(banner.getFiveStarRate(), banner.getFourStarRate());
    }

    private String selectItem(GachaBanner banner, byte rarity, boolean guaranteedFeatured) {
        List<WeightedItem<String>> itemPool = new ArrayList<>();
        
        if (rarity == 5) {
            // 50% featured, 50% standard
            if (guaranteedFeatured || Math.random() < 0.5) {
                itemPool = banner.getFeaturedFiveStarItems();
                System.out.println("DEBUG: Selecting from featured 5-star items.");
            } else {
                // Get standard 5-star items (3-star rarity in your list)
                for (WeightedItem<String> item : banner.getItems()) {
                    if (item.getRarity() == 5) {
                        itemPool.add(item);
                    }
                }
            }

        } else if (rarity == 4) {
            // 50% featured, 50% standard
            if (guaranteedFeatured || Math.random() < 0.5) {
                itemPool = banner.getFeaturedFourStarItems();
                System.out.println("DEBUG: Selecting from featured 4-star items.");
            } else {
                for (WeightedItem<String> item : banner.getItems()) {
                    if (item.getRarity() == 4) {
                        itemPool.add(item);
                        System.out.println("DEBUG: Adding standard 4-star item: " + item.getItem());
                    }
                }
            }

        } else {
            for (WeightedItem<String> item : banner.getItems()) {
                if (item.getRarity() == 3) {
                    itemPool.add(item);
                }
            }
        }
        
        if (itemPool.isEmpty()) {
            return "Unknown Item";
        }
        
        return selector.selectByWeight(itemPool);
    }

    public PitySystem getPitySystem() {
        return pitySystem;
    }
}
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
        pitySystem.addFiveStarPull();
        pitySystem.addFourStarPull();
        
        byte rarity = (byte) determineRarity(banner);
        String itemName = selectItem(banner, rarity);
        
        PullResult result = new PullResult(
            itemName, 
            String.valueOf(rarity) + "-Star", 
            (byte) pitySystem.getFiveStarPity(), 
            pitySystem.isGuaranteedFiveStar(),
            LocalDateTime.now()
        );
        
        if (rarity == 5) {
            pitySystem.resetFiveStarPity();
            pitySystem.addFourStarPull();  // Continue counting 4-star pity
        } else if (rarity == 4) {
            pitySystem.resetFourStarPity();  // Reset 4-star pity after getting 4-star
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
        
        // 5-Star Soft Pity (enhanced rate starting at 75)
        if (pitySystem.getFiveStarPity() >= GachaConfig.SOFT_PITY) {
            float enhancedRate = banner.getFiveStarRate() * 4;
            byte roll = selector.rollForRarity(enhancedRate, banner.getFourStarRate());
            return (byte) roll;
        }
        
        // 4-Star Hard Pity (guaranteed at 10)
        if (pitySystem.getFourStarPity() >= GachaConfig.FOUR_STAR_HARD_PITY) {
            return 4;
        }
        
        // 4-Star Soft Pity (enhanced rate starting at 6) - NOT guaranteed!
        if (pitySystem.getFourStarPity() >= 6) {
            float enhancedFourRate = banner.getFourStarRate() *    1.5f;  // Only 1.5x boost
            byte roll = selector.rollForRarity(banner.getFiveStarRate(), enhancedFourRate);
            return (byte) roll;
        }
        
        // Normal rates
        byte roll = selector.rollForRarity(banner.getFiveStarRate(), banner.getFourStarRate());
        return (byte) roll;
    }

    private String selectItem(GachaBanner banner, byte rarity) {
        List<WeightedItem<String>> filtered = new ArrayList<>();
        
        for (WeightedItem<String> item : banner.getItems()) {
            if (item.getRarity() == rarity) {
                filtered.add(item);
            }
        }
        
        if (filtered.isEmpty()) {
            return "Unknown Item";
        }
        
        return selector.selectByWeight(filtered);
    }

    public PitySystem getPitySystem() {
        return pitySystem;
    }
}
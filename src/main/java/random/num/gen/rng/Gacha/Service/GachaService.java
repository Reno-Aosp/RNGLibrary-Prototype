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
        } else if (rarity == 4) {
            pitySystem.resetFourStarPity();
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

    private int determineRarity(GachaBanner banner) {
        if (pitySystem.getFiveStarPity() >= GachaConfig.HARD_PITY) {
            return 5;
        }
        
        if (pitySystem.getFiveStarPity() >= GachaConfig.SOFT_PITY) {
            float enhancedRate = banner.getFiveStarRate() * 3;
            return selector.rollForRarity(enhancedRate, banner.getFourStarRate());
        }
        
        return selector.rollForRarity(banner.getFiveStarRate(), banner.getFourStarRate());
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
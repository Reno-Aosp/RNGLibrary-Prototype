package random.num.gen.rng.Gacha.Controller;

import random.num.gen.rng.Gacha.GachaSystem;
import random.num.gen.rng.Gacha.Model.GachaBanner;
import random.num.gen.rng.Gacha.Model.PullResult;
import random.num.gen.rng.Gacha.Model.WeightedItem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/gacha")
public class GachaController {

    @Autowired
    private GachaSystem gachaSystem;

    @GetMapping("/pull")
    public PullResult singlePull() {
        List<WeightedItem<String>> items = Arrays.asList(
            new WeightedItem<>("5 star item", 0.6f),
            new WeightedItem<>("4 star item", 5.0f),
            new WeightedItem<>("3 star item", 94.4f)
        );
        GachaBanner banner = new GachaBanner(
            "banner1", 
            "Item Banner", 
            LocalDateTime.now(), 
            LocalDateTime.now().plusDays(14),
            items, 
            0.6f, 
            5.0f, 
            94.4f
        );
        return gachaSystem.pull(banner);
    }

    @PostMapping("/multi-pull")
    public List<PullResult> multiPull(@RequestParam(defaultValue = "10") byte count) {
        List<WeightedItem<String>> items = Arrays.asList(
            new WeightedItem<>("5 star item", 0.6f),
            new WeightedItem<>("4 star item", 5.0f),
            new WeightedItem<>("3 star item", 94.4f)
        );
        GachaBanner banner = new GachaBanner(
            "banner1", 
            "Item Banner", 
            LocalDateTime.now(), 
            LocalDateTime.now().plusDays(14),
            items, 
            0.6f, 
            5.0f, 
            94.4f
        );
        return gachaSystem.multiPull(banner, count);
    }

    @GetMapping("/pity")
    public String getPityStatus() {
        return "5-Star Pity: " + gachaSystem.getFiveStarPity() + 
               ", Guaranteed: " + gachaSystem.isFiveStarGuaranteed() +
               ", Current Time: " + LocalDateTime.now();
    }
}
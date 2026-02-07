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
            new WeightedItem<>("5 star item", 0.6f, (byte)5),
            new WeightedItem<>("4 star item", 5.0f, (byte)4),
            new WeightedItem<>("3 star item", 94.4f, (byte)3)
        );
        GachaBanner banner = new GachaBanner(
            "banner1", 
            "Item Banner", 
            LocalDateTime.now(), 
            LocalDateTime.now().plusDays(14),
            items, 
            0.006f,    // fiveStarRate
            0.051f,    // fourStarRate
            0.943f     // threeStarRate
        );
        return gachaSystem.pull(banner);
    }

    @GetMapping("/multi-pull")
    public List<PullResult> multiPull(@RequestParam(defaultValue = "10") byte count) {
        List<WeightedItem<String>> items = Arrays.asList(
            new WeightedItem<>("5 star item", 0.6f, (byte)5),
            new WeightedItem<>("4 star item", 5.0f, (byte)4),
            new WeightedItem<>("3 star item", 94.4f, (byte)3)
        );
        GachaBanner banner = new GachaBanner(
            "banner1", 
            "Item Banner", 
            LocalDateTime.now(), 
            LocalDateTime.now().plusDays(14),
            items, 
            0.006f,    // fiveStarRate
            0.051f,    // fourStarRate
            0.943f     // threeStarRate
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
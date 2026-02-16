package random.num.gen.rng.Gacha.Controller;

import random.num.gen.rng.Gacha.GachaSystem;
import random.num.gen.rng.Gacha.Model.GachaBanner;
import random.num.gen.rng.Gacha.Model.PullResult;
import random.num.gen.rng.Gacha.Model.WeightedItem;
import random.num.gen.rng.Gacha.DTO.PityStatusDTO;
import random.num.gen.rng.Gacha.ActiveBanner.CheckActiveBanner;

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

    @Autowired
    private CheckActiveBanner checkActiveBanner;

    private GachaBanner createBanner() {
        return new GachaBanner(
            "banner1",
            "Character Banner",
            LocalDateTime.now().minusDays(1),
            LocalDateTime.now().plusDays(14),
            0.006f,
            0.051f,
            Arrays.asList(new WeightedItem<>("Featured 5-Star Char", 1f, (byte)5)),
            Arrays.asList(new WeightedItem<>("Featured 4-Star Char", 1f, (byte)4)),
            Arrays.asList(
                new WeightedItem<>("Standard 5-Star", 1f, (byte)5),
                new WeightedItem<>("Standard 4-Star", 1f, (byte)4),
                new WeightedItem<>("3-Star Item", 1f, (byte)3)
            )
        );
    }

    @GetMapping("/banner-status")
    public String getBannerStatus() {
        GachaBanner banner = createBanner();
        if (checkActiveBanner.isBannerActive(banner)) {
            long daysLeft = checkActiveBanner.daysUntilExpire(banner);
            return "Banner active. Days left: " + daysLeft;
        }
        return "Banner expired.";
    }
    
    @GetMapping("/pull")
    public PullResult singlePull() {
        return gachaSystem.pull(createBanner());
    }

    @GetMapping("/multi-pull")
    public List<PullResult> multiPull(@RequestParam(defaultValue = "10") byte count) {
        return gachaSystem.multiPull(createBanner(), count);
    }

    @GetMapping("/pity")
    public PityStatusDTO getPityStatus() {
        return new PityStatusDTO(
            gachaSystem.getFiveStarPity(),
            gachaSystem.isFiveStarGuaranteed(),
            LocalDateTime.now()
        );
    }
}
package random.num.gen.rng.Gacha;

import random.num.gen.rng.Gacha.Model.GachaBanner;
import random.num.gen.rng.Gacha.Model.PullResult;
import random.num.gen.rng.Gacha.Service.GachaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GachaSystem {
    
    @Autowired
    private GachaService gachaService;

    public PullResult pull(GachaBanner banner) {
        return gachaService.singlePull(banner);
    }

    public List<PullResult> multiPull(GachaBanner banner, byte count) {
        return gachaService.multiPull(banner, count);
    }

    public byte getFiveStarPity() {
        return (byte) gachaService.getPitySystem().getFiveStarPity();
    }

    public boolean isFiveStarGuaranteed() {
        return gachaService.getPitySystem().isGuaranteedFiveStar();
    }
}
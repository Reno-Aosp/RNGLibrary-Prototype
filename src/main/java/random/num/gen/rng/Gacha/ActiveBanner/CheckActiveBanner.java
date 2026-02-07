package random.num.gen.rng.Gacha.ActiveBanner;

import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import random.num.gen.rng.Gacha.Model.GachaBanner;

@Service
public class CheckActiveBanner {
    
    public boolean isBannerActive(GachaBanner banner) {
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(banner.getStartDate()) && now.isBefore(banner.getEndDate());
    }
    
    public short daysUntilExpire(GachaBanner banner) {
        return (short) java.time.temporal.ChronoUnit.DAYS.between(LocalDateTime.now(), banner.getEndDate());
    }
}

package random.num.gen.rng.Gacha.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class GachaBanner {
    private String bannerId;
    private String bannerName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<WeightedItem<String>> items;
    private float fiveStarRate;
    private float fourStarRate;
    private float threeStarRate;
    
}
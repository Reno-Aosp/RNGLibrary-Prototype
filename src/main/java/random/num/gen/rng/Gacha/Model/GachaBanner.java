package random.num.gen.rng.Gacha.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class GachaBanner {
    private String bannerId;
    private String bannerName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private float fiveStarRate;
    private float fourStarRate;
    private List<WeightedItem<String>> featuredFiveStarItems;
    private List<WeightedItem<String>> featuredFourStarItems;
    private List<WeightedItem<String>> items;
}
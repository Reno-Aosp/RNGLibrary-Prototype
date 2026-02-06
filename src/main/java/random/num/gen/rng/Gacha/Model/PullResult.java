package random.num.gen.rng.Gacha.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class PullResult {
    private String itemName;
    private String rarity;
    private byte pityCount;
    private boolean isGuaranteed;
    private LocalDateTime pullTime;
}
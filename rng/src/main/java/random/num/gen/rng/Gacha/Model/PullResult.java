package random.num.gen.rng.Gacha.Model;

import com.fasterxml.jackson.annotation.JsonFormat;

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
    private byte fiveStarPity;
    private boolean isGuaranteedFiveStar;
    private boolean isGuaranteedFeaturedFiveStar;
    private byte fourStarPity;
    private boolean isGuaranteedFourStar;
    private boolean isGuaranteedFeaturedFourStar;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime pullTime;
}
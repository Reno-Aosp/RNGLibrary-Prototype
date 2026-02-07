package random.num.gen.rng.Gacha.Config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class GachaConfig {
    public static final float FIVE_STAR_RATE = 0.6f;
    public static final float FOUR_STAR_RATE = 5.4f;
    public static final float THREE_STAR_RATE = 94.0f;
    
    public static final byte HARD_PITY = 90;
    public static final byte SOFT_PITY = 75;
    public static final byte FOUR_STAR_PITY = 10;
    public static final byte FOUR_STAR_SOFT_PITY = 6;
    public static final byte FOUR_STAR_HARD_PITY = 10;
}
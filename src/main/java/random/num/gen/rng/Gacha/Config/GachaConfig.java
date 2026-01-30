package random.num.gen.rng.Gacha.Config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class GachaConfig {
    public static final double FIVE_STAR_RATE = 0.006;
    public static final double FOUR_STAR_RATE = 0.051;
    public static final double THREE_STAR_RATE = 0.943;
    public static final int HARD_PITY = 90;
    public static final int SOFT_PITY = 75;
    public static final int FOUR_STAR_PITY = 10;
}
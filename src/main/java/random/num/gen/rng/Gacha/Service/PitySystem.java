package random.num.gen.rng.Gacha.Service;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PitySystem {
    private byte fiveStarPity;
    private byte fourStarPity;
    private boolean guaranteedFiveStar;
    private boolean guaranteedFourStar;

    // Constructor to initialize pity counts
    public PitySystem() {
        this.fiveStarPity = 0;
        this.fourStarPity = 0;
        this.guaranteedFiveStar = false;
        this.guaranteedFourStar = false;
    }

    // Methods to update pity counts
    public void addFourStarPull() {
        this.fourStarPity++;
    }

    public void addFiveStarPull() {
        this.fiveStarPity++;
        this.fourStarPity++;
    }

    public void resetFiveStarPity() {
        this.fiveStarPity = 0;
        this.guaranteedFiveStar = false;
    }

    public void resetFourStarPity() {
        this.fourStarPity = 0;
        this.guaranteedFourStar = false;
    }
}
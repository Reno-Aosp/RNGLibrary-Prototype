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
    private boolean guaranteedFeaturedFiveStar;
    private boolean guaranteedFeaturedFourStar;

    // Constructor to initialize pity counts
    public PitySystem() {
        this.fiveStarPity = 0;
        this.fourStarPity = 0;
        this.guaranteedFiveStar = false;
        this.guaranteedFourStar = false;
        this.guaranteedFeaturedFiveStar = false;
        this.guaranteedFeaturedFourStar = false;
    }

    // Increment both counters each pull
    public void incrementPull() {
        this.fiveStarPity++;
        this.fourStarPity++;
    }

    public void resetFiveStarPity() {
        this.fiveStarPity = 0;
        // Toggle: if guaranteed, next is NOT guaranteed (50/50)
        this.guaranteedFeaturedFiveStar = !this.guaranteedFeaturedFiveStar;
    }

    public void resetFourStarPity() {
        this.fourStarPity = 0;
        // Toggle: if guaranteed, next is NOT guaranteed (50/50)
        this.guaranteedFeaturedFourStar = !this.guaranteedFeaturedFourStar;
    }
}
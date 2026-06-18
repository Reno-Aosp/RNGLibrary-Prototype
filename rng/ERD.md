erDiagram
    GachaBanner ||--o{ WeightedItem : contains
    GachaBanner {
        String bannerId PK
        String bannerName
        LocalDateTime startDate
        LocalDateTime endDate
        float fiveStarRate
        float fourStarRate
    }
    WeightedItem {
        String item
        float weight
        byte rarity
    }
    PullResult {
        String itemName
        String rarity
        byte pityCount
        boolean isGuaranteed
        LocalDateTime pullTime
    }
    PitySystem {
        byte fiveStarPity
        byte fourStarPity
        boolean guaranteedFiveStar
        boolean guaranteedFourStar
    }
    PityStatusDTO {
        byte fiveStarPity
        boolean guaranteed
        LocalDateTime currentTime
    }
    GachaService ||--|| PitySystem : manages
    GachaService ||--|| WeightedRandomSelector : uses
    GachaService }o--|| GachaBanner : pulls_from
    GachaService ||--o{ PullResult : generates

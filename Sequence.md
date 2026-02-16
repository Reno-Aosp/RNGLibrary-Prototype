sequenceDiagram
    actor User
    participant C as GachaController
    participant GS as GachaSystem
    participant Svc as GachaService
    participant PS as PitySystem
    participant WRS as WeightedRandomSelector
    participant Cfg as GachaConfig

    User->>C: GET /api/gacha/pull
    C->>C: createBanner()
    C->>GS: pull(banner)
    GS->>Svc: singlePull(banner)
    Svc->>PS: incrementPull()
    Note over PS: fiveStarPity++ fourStarPity++

    Svc->>Cfg: check HARD_PITY (90)
    Svc->>Cfg: check FOUR_STAR_HARD_PITY (10)
    Svc->>Cfg: check SOFT_PITY (75)
    Svc->>Cfg: check FOUR_STAR_SOFT_PITY (6)

    Svc->>WRS: rollForRarity(rate5, rate4)
    WRS-->>Svc: rarity (3/4/5)

    Svc->>WRS: selectByWeight(items)
    WRS-->>Svc: itemName

    alt rarity == 5
        Svc->>PS: resetFiveStarPity()
    else rarity == 4
        Svc->>PS: resetFourStarPity()
    end

    Svc-->>GS: PullResult
    GS-->>C: PullResult
    C-->>User: JSON Response

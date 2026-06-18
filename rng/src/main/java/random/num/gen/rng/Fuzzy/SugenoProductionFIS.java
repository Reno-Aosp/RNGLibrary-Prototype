package random.num.gen.rng.Fuzzy;

public class SugenoProductionFIS {

    private record SugenoInput(double demand, double stock) {
    }

    // Demand range
    private static final double D_MIN = 1000.0;
    private static final double D_MAX = 5000.0;

    // Stock range
    private static final double S_MIN = 100.0;
    private static final double S_MAX = 600.0;

    // Linear membership for "down" (TURUN): 1 at D_MIN, 0 at D_MAX
    private double muDemandDown(double d) {
        if (d <= D_MIN) return 1.0;
        if (d >= D_MAX) return 0.0;
        return (D_MAX - d) / (D_MAX - D_MIN);
    }

    // Linear membership for "up" (NAIK): 0 at D_MIN, 1 at D_MAX
    private double muDemandUp(double d) {
        if (d <= D_MIN) return 0.0;
        if (d >= D_MAX) return 1.0;
        return (d - D_MIN) / (D_MAX - D_MIN);
    }

    // Linear membership for "low" stock (SEDIKIT): 1 at S_MIN, 0 at S_MAX
    private double muStockLow(double s) {
        if (s <= S_MIN) return 1.0;
        if (s >= S_MAX) return 0.0;
        return (S_MAX - s) / (S_MAX - S_MIN);
    }

    // Linear membership for "high" stock (BANYAK): 0 at S_MIN, 1 at S_MAX
    private double muStockHigh(double s) {
        if (s <= S_MIN) return 0.0;
        if (s >= S_MAX) return 1.0;
        return (s - S_MIN) / (S_MAX - S_MIN);
    }

    /**
     * Evaluate Sugeno production for given demand and stock.
     */
    public double evaluate(double demand, double stock) {
        SugenoInput in = new SugenoInput(demand, stock);

        double muDown  = muDemandDown(in.demand());
        double muUp    = muDemandUp(in.demand());
        double muLow   = muStockLow(in.stock());
        double muHigh  = muStockHigh(in.stock());

        // Rule firing strengths (AND → MIN)
        double w1 = Math.min(muDown, muHigh); // R1: D down & S high
        double w2 = Math.min(muDown, muLow);  // R2: D down & S low
        double w3 = Math.min(muUp,   muHigh); // R3: D up   & S high
        double w4 = Math.min(muUp,   muLow);  // R4: D up   & S low

        // Consequents (Sugeno linear functions)
        double z1 = demand - stock;              // R1
        double z2 = demand;                      // R2
        double z3 = demand;                      // R3
        double z4 = 1.25 * demand - stock;       // R4

        // Sugeno weighted average
        double numerator   = w1 * z1 + w2 * z2 + w3 * z3 + w4 * z4;
        double denominator = w1 + w2 + w3 + w4;

        if (denominator == 0.0) {
            // No rule fires; fall back to something reasonable
            return 0.0;
        }
        return numerator / denominator;
    }

    public static void main(String[] args) {
        SugenoProductionFIS fis = new SugenoProductionFIS();

        double demand = 4000.0;
        double stock  = 300.0;

        double production = fis.evaluate(demand, stock);

        System.out.printf(
                "Demand = %.0f, Stock = %.0f -> Production (Sugeno) = %.2f%n",
                demand, stock, production
        );
    }
}
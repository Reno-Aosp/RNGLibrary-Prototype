package random.num.gen.rng.Gacha.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class WeightedItem<T> {
    private T item;
    private float weight;
}
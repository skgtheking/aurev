import { useState } from "react";
import { router } from "expo-router";
import { Button, Chips, Field, Label, Notice, Page } from "../components/ui";
import { genders, intentions } from "../data/profiles";
import { useStore } from "../store";
export default function Filters() {
  const { state, update } = useStore();
  const [filters, setFilters] = useState(state.filters);
  const [min, setMin] = useState(String(filters.minAge));
  const [max, setMax] = useState(String(filters.maxAge));
  const [error, setError] = useState("");
  return (
    <Page back title="Your kind of possibility" kicker="DISCOVERY PREFERENCES">
      <Field
        label="Minimum age"
        keyboardType="number-pad"
        value={min}
        onChangeText={setMin}
      />
      <Field
        label="Maximum age"
        keyboardType="number-pad"
        value={max}
        onChangeText={setMax}
      />
      <Field
        label="City · blank for all India"
        value={filters.city}
        onChangeText={(city) => setFilters({ ...filters, city })}
      />
      <Label>Gender</Label>
      <Chips
        values={["Everyone", ...genders]}
        selected={[filters.gender]}
        onSelect={(gender) =>
          setFilters({ ...filters, gender: gender as typeof filters.gender })
        }
      />
      <Label>Intention</Label>
      <Chips
        values={["Any", ...intentions]}
        selected={[filters.intention]}
        onSelect={(intention) =>
          setFilters({
            ...filters,
            intention: intention as typeof filters.intention,
          })
        }
      />
      <Notice>
        Reciprocal dating preferences are always respected. Privé adds a
        long-term intention shortcut; basic filters remain available to
        everyone.
      </Notice>
      {state.prive && (
        <Button
          title="Privé: focus on long-term connections"
          variant="outline"
          onPress={() => setFilters({ ...filters, intention: "Long-term" })}
        />
      )}{" "}
      {!!error && <Notice error>{error}</Notice>}
      <Button
        title="Save preferences"
        onPress={() => {
          const low = Number(min),
            high = Number(max);
          if (
            !Number.isInteger(low) ||
            !Number.isInteger(high) ||
            low < 18 ||
            high > 120 ||
            low > high
          ) {
            setError(
              "Choose whole ages from 18 to 120, with minimum no greater than maximum.",
            );
            return;
          }
          update((v) => ({
            ...v,
            filters: { ...filters, minAge: low, maxAge: high },
          }));
          router.back();
        }}
      />
      <Button
        title="Reset filters"
        variant="outline"
        onPress={() => {
          setMin("18");
          setMax("55");
          setFilters({
            minAge: 18,
            maxAge: 55,
            city: "",
            gender: "Everyone",
            intention: "Any",
          });
        }}
      />
    </Page>
  );
}

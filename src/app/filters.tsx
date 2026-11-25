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
  const [minHeight, setMinHeight] = useState(String(filters.minHeightCm));
  const [maxHeight, setMaxHeight] = useState(String(filters.maxHeightCm));
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
        label="Minimum height · cm"
        keyboardType="number-pad"
        value={minHeight}
        onChangeText={setMinHeight}
      />
      <Field
        label="Maximum height · cm"
        keyboardType="number-pad"
        value={maxHeight}
        onChangeText={setMaxHeight}
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
        long-term relationship shortcut; basic filters remain available to
        everyone.
      </Notice>
      {state.prive && (
        <Button
          title="Privé: focus on long-term connections"
          variant="outline"
          onPress={() => setFilters({ ...filters, intention: "Long-term relationship" })}
        />
      )}{" "}
      {!!error && <Notice error>{error}</Notice>}
      <Button
        title="Save preferences"
        onPress={() => {
          const low = Number(min),
            high = Number(max),
            lowHeight = Number(minHeight),
            highHeight = Number(maxHeight);
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
          if (!Number.isInteger(lowHeight) || !Number.isInteger(highHeight) || lowHeight < 120 || highHeight > 230 || lowHeight > highHeight) {
            setError("Choose whole heights from 120 to 230 cm, with minimum no greater than maximum.");
            return;
          }
          update((v) => ({
            ...v,
            filters: { ...filters, minAge: low, maxAge: high, minHeightCm: lowHeight, maxHeightCm: highHeight },
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
          setMinHeight("140");
          setMaxHeight("210");
          setFilters({
            minAge: 18,
            maxAge: 55,
            minHeightCm: 140,
            maxHeightCm: 210,
            city: "",
            gender: "Everyone",
            intention: "Any",
          });
        }}
      />
    </Page>
  );
}

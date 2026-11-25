import { useState } from "react";
import type { HeightUnit } from "../types";
import { centimetersToFeetInches, feetInchesToCentimeters } from "../utils/height";
import { router } from "expo-router";
import { View } from "react-native";
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
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(filters.heightUnit);
  const initialMinParts = centimetersToFeetInches(filters.minHeightCm);
  const initialMaxParts = centimetersToFeetInches(filters.maxHeightCm);
  const [minHeightFeet, setMinHeightFeet] = useState(initialMinParts.feet);
  const [minHeightInches, setMinHeightInches] = useState(initialMinParts.inches);
  const [maxHeightFeet, setMaxHeightFeet] = useState(initialMaxParts.feet);
  const [maxHeightInches, setMaxHeightInches] = useState(initialMaxParts.inches);
  const changeHeightUnit = (unit: HeightUnit) => {
    if (unit === heightUnit) return;
    if (unit === "cm") {
      setMinHeight(String(feetInchesToCentimeters(minHeightFeet, minHeightInches) ?? filters.minHeightCm));
      setMaxHeight(String(feetInchesToCentimeters(maxHeightFeet, maxHeightInches) ?? filters.maxHeightCm));
    } else {
      const minParts = centimetersToFeetInches(Number(minHeight) || filters.minHeightCm);
      const maxParts = centimetersToFeetInches(Number(maxHeight) || filters.maxHeightCm);
      setMinHeightFeet(minParts.feet);
      setMinHeightInches(minParts.inches);
      setMaxHeightFeet(maxParts.feet);
      setMaxHeightInches(maxParts.inches);
    }
    setHeightUnit(unit);
  };
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
      <Label>Height · display unit</Label>
      <Chips values={["ft/in", "cm"] as const} selected={[heightUnit]} onSelect={changeHeightUnit} />
      {heightUnit === "cm" ? (
        <>
          <Field label="Minimum height · cm" keyboardType="number-pad" value={minHeight} onChangeText={setMinHeight} />
          <Field label="Maximum height · cm" keyboardType="number-pad" value={maxHeight} onChangeText={setMaxHeight} />
        </>
      ) : (
        <>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}><Field label="Minimum · feet" keyboardType="number-pad" maxLength={1} value={minHeightFeet} onChangeText={setMinHeightFeet} /></View>
            <View style={{ flex: 1 }}><Field label="Minimum · inches" keyboardType="number-pad" maxLength={2} value={minHeightInches} onChangeText={setMinHeightInches} /></View>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}><Field label="Maximum · feet" keyboardType="number-pad" maxLength={1} value={maxHeightFeet} onChangeText={setMaxHeightFeet} /></View>
            <View style={{ flex: 1 }}><Field label="Maximum · inches" keyboardType="number-pad" maxLength={2} value={maxHeightInches} onChangeText={setMaxHeightInches} /></View>
          </View>
        </>
      )}
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
            highHeight = heightUnit === "cm" ? Number(maxHeight) : feetInchesToCentimeters(maxHeightFeet, maxHeightInches);
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
          if (lowHeight === null || highHeight === null || !Number.isInteger(lowHeight) || !Number.isInteger(highHeight) || lowHeight < 120 || highHeight > 230 || lowHeight > highHeight) {
            setError("Choose valid heights from 120 to 230 cm. Feet/inches must be valid, with minimum no greater than maximum.");
            return;
          }
          update((v) => ({
            ...v,
            filters: { ...filters, minAge: low, maxAge: high, minHeightCm: lowHeight, maxHeightCm: highHeight, heightUnit },
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
          const defaultMin = centimetersToFeetInches(140);
          const defaultMax = centimetersToFeetInches(210);
          setMinHeightFeet(defaultMin.feet);
          setMinHeightInches(defaultMin.inches);
          setMaxHeightFeet(defaultMax.feet);
          setMaxHeightInches(defaultMax.inches);
          setFilters({
            minAge: 18,
            maxAge: 55,
            minHeightCm: 140,
            maxHeightCm: 210,
            heightUnit,
            city: "",
            gender: "Everyone",
            intention: "Any",
          });
        }}
      />
    </Page>
  );
}

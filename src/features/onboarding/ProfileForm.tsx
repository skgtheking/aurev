import React, { useState } from "react";
import { Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { genders, interests, interestGroups, intentions } from "../../data/profiles";
import type { Person } from "../../types";
import {
  Button,
  Chips,
  Field,
  Label,
  Notice,
  Portrait,
} from "../../components/ui";
import { s } from "../../theme";
import { DateInput } from "../../components/DateInput";
import { TYPE_OPTIONS } from "../../utils/typePreferences";
import type { HeightUnit } from "../../types";
import { centimetersToFeetInches, feetInchesToCentimeters } from "../../utils/height";
export const sections = [
  "The essentials",
  "Your kind of connection",
  "A little more you",
  "Your first impression",
];
export function ProfileForm({
  value,
  onChange,
  step,
  error,
  onError,
}: {
  value: Person;
  onChange: (p: Person) => void;
  step: number;
  error: string;
  onError: (s: string) => void;
}) {
  const [interestSearch, setInterestSearch] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("ft/in");
  const startingHeight = centimetersToFeetInches(value.heightCm);
  const [heightCmInput, setHeightCmInput] = useState(value.heightCm ? String(value.heightCm) : "");
  const [heightFeet, setHeightFeet] = useState(startingHeight.feet);
  const [heightInches, setHeightInches] = useState(startingHeight.inches);
  const changeHeightUnit = (unit: HeightUnit) => {
    if (unit === heightUnit) return;
    if (unit === "cm") {
      const cm = feetInchesToCentimeters(heightFeet, heightInches);
      setHeightCmInput(cm === null ? "" : String(cm));
      set("heightCm", cm ?? (heightFeet || heightInches ? Number.NaN : undefined));
    } else {
      const parts = centimetersToFeetInches(heightCmInput.trim() && Number.isFinite(Number(heightCmInput)) ? Number(heightCmInput) : undefined);
      setHeightFeet(parts.feet);
      setHeightInches(parts.inches);
      set("heightCm", heightCmInput.trim() ? Number(heightCmInput) : undefined);
    }
    setHeightUnit(unit);
  };
  const updateImperialHeight = (feet: string, inches: string) => {
    setHeightFeet(feet);
    setHeightInches(inches);
    if (!feet.trim() && !inches.trim()) set("heightCm", undefined);
    else set("heightCm", feetInchesToCentimeters(feet, inches) ?? Number.NaN);
  };
  const set = <K extends keyof Person>(k: K, v: Person[K]) =>
    onChange({ ...value, [k]: v });
  const pick = async () => {
    if (value.photos.length >= 4) {
      onError("You can add up to four photos. Remove one to add another.");
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        set("photos", [
          ...value.photos,
          asset.base64
            ? `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`
            : asset.uri,
        ]);
      }
    } catch {
      onError(
        "Photo selection is unavailable. Choose an illustrated portrait below.",
      );
    }
  };
  return (
    <View style={{ gap: 22 }}>
      {step === 0 && (
        <>
          <Field
            label="Your first name"
            value={value.name}
            maxLength={40}
            onChangeText={(x) => set("name", x)}
            placeholder="What should we call you?"
          />
          <DateInput
            label="Date of birth · MM/DD/YYYY · private"
            value={value.dob}
            onChange={(dob) => set("dob", dob)}
          />
          <Label>Your height · optional</Label>
          <Chips values={["ft/in", "cm"] as const} selected={[heightUnit]} onSelect={changeHeightUnit} />
          {heightUnit === "cm" ? (
            <Field
              label="Height · cm"
              value={heightCmInput}
              onChangeText={(x) => {
                setHeightCmInput(x);
                set("heightCm", !x.trim() ? undefined : Number.isInteger(Number(x)) ? Number(x) : Number.NaN);
              }}
              placeholder="e.g. 168"
              keyboardType="number-pad"
              maxLength={3}
            />
          ) : (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Field label="Height · feet" value={heightFeet} onChangeText={(x) => updateImperialHeight(x, heightInches)} placeholder="5" keyboardType="number-pad" maxLength={1} />
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Height · inches" value={heightInches} onChangeText={(x) => updateImperialHeight(heightFeet, x)} placeholder="6" keyboardType="number-pad" maxLength={2} />
              </View>
            </View>
          )}
          <Field
            label="Home city in India"
            value={value.city}
            onChangeText={(x) => set("city", x)}
            placeholder="Mumbai"
          />
          <Label>I identify as</Label>
          <Chips
            values={genders}
            selected={[value.gender]}
            onSelect={(x) => set("gender", x)}
          />
          <Field
            label="Pronouns"
            value={value.pronouns}
            onChangeText={(x) => set("pronouns", x)}
            placeholder="Your pronouns"
          />
        </>
      )}
      {step === 1 && (
        <>
          <Label>My orientation</Label>
          <Chips
            values={[
              "Straight",
              "Gay",
              "Lesbian",
              "Bisexual",
              "Pansexual",
              "Queer",
              "Asexual",
              "Prefer not to say",
            ]}
            selected={[value.orientation]}
            onSelect={(x) => set("orientation", x)}
          />
          <Label>I’d like to meet</Label>
          <Chips
            values={genders}
            selected={value.seeking}
            onSelect={(x) =>
              set(
                "seeking",
                value.seeking.includes(x)
                  ? value.seeking.filter((g) => g !== x)
                  : [...value.seeking, x],
              )
            }
          />
          <Label>What are you looking for? · Pick all that apply</Label>
          <Chips
            values={intentions}
            selected={value.intentions?.length ? value.intentions : [value.intention]}
            onSelect={(x) => {
              const previous = value.intentions?.length ? value.intentions : [value.intention];
              const next = previous.includes(x)
                ? previous.length > 1 ? previous.filter((item) => item !== x) : previous
                : [...previous, x];
              onChange({ ...value, intentions: next, intention: next[0] });
            }}
          />
          <Notice>Choose what genuinely fits you. You can change these later, and platonic connections are welcome.</Notice>
          <Notice>
            We only show people whose gender preferences include yours.
            Orientation is self-described and never inferred.
          </Notice>
        </>
      )}
      {step === 2 && (
        <>
          <Label>Your interests · choose at least two · mix comfort-zone and adventure</Label>
          <Field
            label="Find a hobby or vibe"
            value={interestSearch}
            onChangeText={setInterestSearch}
            placeholder="Try café hopping, Pilates, matcha…"
          />
          {Object.entries(interestGroups).map(([category, options]) => {
            const matching = options.filter((item) =>
              item.toLocaleLowerCase().includes(interestSearch.trim().toLocaleLowerCase())
            );
            if (!matching.length) return null;
            return (
              <View key={category} style={{ gap: 10 }}>
                <Label>{category.toUpperCase()}</Label>
                <Chips
                  values={matching}
                  selected={value.interests}
                  onSelect={(x) =>
                    set("interests", value.interests.includes(x)
                      ? value.interests.filter((i) => i !== x)
                      : [...value.interests, x])
                  }
                />
              </View>
            );
          })}
          {value.interests.filter((item) => !interests.includes(item)).length > 0 && (
            <View style={{ gap: 8 }}>
              <Label>YOUR OTHER INTERESTS</Label>
              <Chips
                values={value.interests.filter((item) => !interests.includes(item))}
                selected={value.interests}
                onSelect={(x) => set("interests", value.interests.filter((i) => i !== x))}
              />
            </View>
          )}
          <Field
            label="Add your own interest"
            value={customInterest}
            maxLength={40}
            onChangeText={setCustomInterest}
            placeholder="Something uniquely you"
          />
          <Button title="Add custom interest" variant="outline" onPress={() => {
            const entry = customInterest.trim().replace(/\s+/g, " ");
            if (entry.length < 2 || entry.length > 40 || !/^[\p{L}\p{N} &+.'-]+$/u.test(entry)) {
              onError("Use 2–40 letters or numbers for your custom interest.");
              return;
            }
            if (value.interests.some((x) => x.toLocaleLowerCase() === entry.toLocaleLowerCase())) {
              onError("You have already selected that interest.");
              return;
            }
            set("interests", [...value.interests, entry]);
            setCustomInterest("");
            onError("");
          }} />
          <View style={{ gap: 12 }}>
            <Label>MY TYPE · WHAT CATCHES YOUR EYE?</Label>
            <Notice>Optional. These are qualities you appreciate, not judgments about people. Private by default; edit dealbreakers anytime from Profile → My Type.</Notice>
            <Chips
              values={TYPE_OPTIONS}
              selected={value.typePreferences ?? []}
              onSelect={(x) => {
                const old = value.typePreferences ?? [];
                const next = old.includes(x) ? old.filter((item) => item !== x) : [...old, x];
                onChange({ ...value, typePreferences: next, typeDealbreakers: (value.typeDealbreakers ?? []).filter((item) => next.includes(item)) });
              }}
            />
            <Label>DISPLAY YOUR NON-SENSITIVE CHOICES?</Label>
            <Chips
              values={["Keep private", "Show safe traits"]}
              selected={[value.showMyType ? "Show safe traits" : "Keep private"]}
              onSelect={(x) => set("showMyType", x === "Show safe traits")}
            />
          </View>
          <Field
            label="A little about you · 20+ characters"
            multiline
            maxLength={500}
            value={value.bio}
            onChangeText={(x) => set("bio", x)}
          />
          <Label>Choose a conversation prompt</Label>
          <Chips
            values={[
              "My idea of a perfect Sunday",
              "A little thing I love",
              "Let’s skip small talk and",
            ]}
            selected={[value.prompt]}
            onSelect={(x) => set("prompt", x)}
          />
          <Field
            label="Your answer"
            multiline
            maxLength={300}
            value={value.answer}
            onChangeText={(x) => set("answer", x)}
          />
        </>
      )}
      {step === 3 && (
        <>
          <Portrait uri={value.photos[0]} height={260} />
          <Label>Choose an original illustrated portrait</Label>
          <Chips
            values={["1", "2", "3", "4", "5", "6"]}
            selected={
              value.photos[0]?.startsWith("portrait:")
                ? [String(Number(value.photos[0].split(":")[1]) + 1)]
                : []
            }
            onSelect={(x) =>
              set("photos", [
                `portrait:${Number(x) - 1}`,
                ...value.photos.slice(1),
              ])
            }
          />
          <Button
            title="Choose a photo from your device"
            variant="outline"
            onPress={pick}
          />
          <Text style={s.body}>
            Use photos you have permission to share. Add up to four photos;
            choose which one appears first. Illustrations are available for
            private demos.
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            {value.photos.map((uri, index) => (
              <View key={index} style={{ width: "47%", gap: 6 }}>
                <Portrait uri={uri} height={130} />
                <Button
                  title={index === 0 ? "Main photo" : "Make main photo"}
                  variant="outline"
                  disabled={index === 0}
                  onPress={() =>
                    set("photos", [
                      uri,
                      ...value.photos.filter((_, i) => i !== index),
                    ])
                  }
                />
                <Button
                  title="Remove photo"
                  variant="quiet"
                  disabled={value.photos.length === 1}
                  onPress={() =>
                    set(
                      "photos",
                      value.photos.filter((_, i) => i !== index),
                    )
                  }
                />
              </View>
            ))}
          </View>
          <Label>Cosmic Chemistry · optional</Label>
          <Chips
            values={["Off", "On"]}
            selected={[value.astrology ? "On" : "Off"]}
            onSelect={(x) => set("astrology", x === "On")}
          />
          <Label>Discover people while travelling · optional</Label>
          <Chips
            values={["Off", "On"]}
            selected={[value.traveler ? "On" : "Off"]}
            onSelect={(x) => set("traveler", x === "On")}
          />
          <Notice>
            Your date of birth stays in local storage and is never shown on your
            public profile. Local storage is not encrypted; use fictional
            details for this demo.
          </Notice>
        </>
      )}
      {!!error && <Notice error>{error}</Notice>}
    </View>
  );
}

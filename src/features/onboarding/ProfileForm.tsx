import React from "react";
import { Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { genders, interests, intentions } from "../../data/profiles";
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
          <Field
            label="Date of birth · YYYY-MM-DD · private"
            value={value.dob}
            onChangeText={(x) => set("dob", x)}
            placeholder="1998-05-16"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
          />
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
          <Label>I’m here for</Label>
          <Chips
            values={intentions}
            selected={[value.intention]}
            onSelect={(x) => set("intention", x)}
          />
          <Notice>
            We only show people whose gender preferences include yours.
            Orientation is self-described and never inferred.
          </Notice>
        </>
      )}
      {step === 2 && (
        <>
          <Label>Your interests · choose at least two</Label>
          <Chips
            values={interests}
            selected={value.interests}
            onSelect={(x) =>
              set(
                "interests",
                value.interests.includes(x)
                  ? value.interests.filter((i) => i !== x)
                  : [...value.interests, x],
              )
            }
          />
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

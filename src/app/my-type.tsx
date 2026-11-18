import { useState } from "react";
import { Text, View } from "react-native";
import { useStore } from "../store";
import { Button, Chips, Label, Notice, Page } from "../components/ui";
import { s } from "../theme";

export const TYPE_OPTIONS = [
  "Emotionally available", "Green flag energy", "Red flag energy",
  "Baddie energy", "Safe space", "Good communicator",
  "Adventurous", "Loyal", "Ambitious", "Funny",
  "Playful & flirty", "Great listener", "Kinky",
  "Thoughtful", "Independent", "Spontaneous",
] as const;
const PRIVATE_TRAITS = new Set(["Kinky"]);
/** Sensitive preferences never appear in publicly visible My Type summaries. */
export function publicTypePreferences(items: readonly string[]) {
  return items.filter((x) => !PRIVATE_TRAITS.has(x));
}
export default function MyType() {
  const { state, update } = useStore();
  const user = state.user;
  const [choices, setChoices] = useState<string[]>(user?.typePreferences ?? []);
  const [dealbreakers, setDealbreakers] = useState<string[]>(user?.typeDealbreakers ?? []);
  const [visible, setVisible] = useState(user?.showMyType ?? false);
  const [saved, setSaved] = useState(false);
  if (!user) return <Page back title="My Type"><Notice>Finish onboarding to choose your preferences.</Notice></Page>;

  const toggle = (item: string) => {
    setSaved(false);
    setChoices((current) => current.includes(item) ? current.filter((x) => x !== item) : [...current, item]);
    setDealbreakers((current) => current.filter((x) => x !== item));
  };
  const toggleDealbreaker = (item: string) => {
    setSaved(false);
    setDealbreakers((current) => current.includes(item) ? current.filter((x) => x !== item) : [...current, item]);
  };
  return (
    <Page back kicker="YOUR VIBE, YOUR RULES" title="What catches your eye?">
      <Text style={s.body}>Choose the qualities you appreciate in a connection. This is about your preferences, not a rating or judgment of anyone else.</Text>
      <Label>MY TYPE · SELECT ANY</Label>
      <Chips values={TYPE_OPTIONS} selected={choices} onSelect={toggle} />
      <View style={s.card}>
        <Label>YOUR NON-NEGOTIABLES</Label>
        <Text style={s.body}>Optional. Select from the traits you already chose. These are reminders for you, never automatic rejection or ranking rules.</Text>
        {choices.length ? (
          <Chips values={choices} selected={dealbreakers} onSelect={toggleDealbreaker} />
        ) : <Text style={s.body}>Choose a few traits above first.</Text>}
      </View>
      <Label>PROFILE VISIBILITY</Label>
      <Chips values={["Keep private", "Show safe traits"]} selected={[visible ? "Show safe traits" : "Keep private"]} onSelect={(x) => { setVisible(x === "Show safe traits"); setSaved(false); }} />
      <Notice>Private by default. If you opt in, only non-sensitive selections may appear on your profile. “Kinky” and other explicitly sensitive preferences remain private. Your dealbreakers are never shown.</Notice>
      {visible && <View style={s.card}>
        <Label>PUBLIC PREVIEW</Label>
        <Text style={s.body}>{publicTypePreferences(choices).join(" · ") || "No public traits selected."}</Text>
      </View>}
      <Button title="Save My Type" onPress={() => {
        update((v) => ({ ...v, user: v.user ? { ...v.user, typePreferences: choices, typeDealbreakers: dealbreakers, showMyType: visible } : null }));
        setSaved(true);
      }} />
      {saved && <Notice>Your My Type preferences are saved locally.</Notice>}
    </Page>
  );
}

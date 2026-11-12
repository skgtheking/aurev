import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Heart, Moon, Sparkles } from "lucide-react-native";
import { useStore } from "../store";
import { profiles } from "../data/profiles";
import { Button, Empty, Label, Notice, Page } from "../components/ui";
import { zodiac } from "../utils/domain";
import { colors as c, s } from "../theme";

const vibes: Record<string, string> = {
  Aries: "Bold moves, zero boring conversations.",
  Taurus: "Soft life, good food, better company.",
  Gemini: "The plot twist is probably their next message.",
  Cancer: "Big feelings and even bigger playlists.",
  Leo: "Main-character energy is a lifestyle.",
  Virgo: "Notices every little detail (including your smile).",
  Libra: "Flirting is practically an art form.",
  Scorpio: "Mysterious? Maybe. Boring? Never.",
  Sagittarius: "Someone say spontaneous weekend trip?",
  Capricorn: "Ambitious plans, unexpectedly soft heart.",
  Aquarius: "A little unpredictable, a lot intriguing.",
  Pisces: "Dreamy dates and cinematic eye contact.",
};

export default function Cosmic() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state, update } = useStore();
  const person = id ? profiles.find((p) => p.id === id) : null;
  const user = state.user;
  if (!user) return <Page back><Empty title="Begin your story first" body="Cosmic Chemistry is an optional profile feature." /></Page>;
  const available = user.astrology && (!person || person.astrology) && !state.blocked.includes(id || "");
  const mine = zodiac(user.dob);
  const theirs = person ? zodiac(person.dob) : null;
  return (
    <Page back kicker="✦ THE UNIVERSE HAS THOUGHTS" title="Cosmic Chemistry">
      <View style={[s.card, { padding: 28, gap: 18, backgroundColor: c.amethyst, alignItems: "center" }]}>
        <Sparkles color={c.gold} size={29} />
        <Text style={[s.title, { textAlign: "center" }]}>Written in the stars?</Text>
        <Text style={[s.body, { textAlign: "center" }]}>
          Less star charts. More conversation starters.
        </Text>
        {available ? (
          <>
            <Text style={[s.h2, { color: c.gold, textAlign: "center" }]}>
              {mine}{theirs ? `  ✦  ${theirs}` : ""}
            </Text>
            <View style={[s.card, { width: "100%", backgroundColor: c.surface, gap: 8 }]}>
              <Text style={s.h2}>{theirs ? "Okay, this could be a plot twist." : "Your cosmic main-character moment."}</Text>
              <Text style={s.body}>{vibes[mine] || "A universe of possibility."}</Text>
              {theirs && <Text style={s.body}>{vibes[theirs] || "A spark worth exploring."}</Text>}
            </View>
          </>
        ) : <Text style={[s.body, { textAlign: "center" }]}>Your stars, your choice.</Text>}
      </View>
      {!user.astrology ? (
        <>
          <Notice>Cosmic Chemistry is optional. Your sun sign is derived locally from your birthday.</Notice>
          <Button title="Turn on Cosmic Chemistry" onPress={() => update((v) => ({
            ...v, user: v.user ? { ...v.user, astrology: true } : null,
          }))} />
        </>
      ) : person && !person.astrology ? (
        <Notice>This fictional profile hasn’t opted in. Their astrology stays private.</Notice>
      ) : available ? (
        <View style={[s.card, { gap: 12 }]}>
          <Heart color={c.gold} size={24} />
          <Label>BREAK THE ICE</Label>
          <Text style={s.h2}>What’s your most impulsive yes?</Text>
          <Text style={s.body}>
            Or try: “Are we a spontaneous road-trip duo or a plan-it-all duo?”
          </Text>
          {state.prive && (
            <>
              <Label>PRIVÉ · EXTRA SPARK</Label>
              <Text style={s.body}>What’s the green flag you notice before anyone else?</Text>
            </>
          )}
        </View>
      ) : <Notice>Astrology is unavailable for this profile.</Notice>}
      <View style={[s.card, { gap: 12 }]}>
        <Moon color={c.gold} size={22} />
        <Label>CURIOUS ABOUT VEDIC ASTROLOGY?</Label>
        <Text style={s.h2}>The deeper cosmic rabbit hole.</Text>
        <Text style={s.body}>
          Rashi, Nakshatra, Kundli and Guna Milan are part of a rich tradition.
          Accurate birth-chart calculations aren’t available in this demo,
          so we won’t invent your placements or compatibility scores.
        </Text>
        <Text style={s.body}>Advanced Vedic features are coming later.</Text>
      </View>
      <Notice>Astrology is just for fun and cultural curiosity, not a scientific relationship prediction. No birth time or birthplace is collected.</Notice>
      <Button title="Manage cosmic preferences" variant="outline" onPress={() => router.push("/edit-profile")} />
    </Page>
  );
}

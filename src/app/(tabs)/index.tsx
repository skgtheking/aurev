import { useState } from "react";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { Heart, SlidersHorizontal, Sparkles, X } from "lucide-react-native";
import { useStore } from "../../store";
import { profiles } from "../../data/profiles";
import { eligible } from "../../utils/domain";
import {
  Button,
  Empty,
  IconButton,
  Label,
  Notice,
  Page,
} from "../../components/ui";
import { PersonCard } from "../../features/discover/PersonCard";
import { colors as c, s } from "../../theme";
export default function Discover() {
  const { state, react, update } = useStore();
  const [match, setMatch] = useState("");
  const [limit, setLimit] = useState(false);
  if (!state.user) return null;
  const people = profiles.filter(
    (p) =>
      eligible(p, state.user!, state.filters, state.blocked) &&
      !state.likes.includes(p.id) &&
      !state.passes.includes(p.id) &&
      !state.matches.includes(p.id),
  );
  const person = people[0];
  const act = (liked: boolean) => {
    if (!person) return;
    if (liked && !state.prive && state.likes.length >= 10) {
      setLimit(true);
      return;
    }
    if (react(person.id, liked)) setMatch(person.id);
  };
  return (
    <Page>
      <View style={s.between}>
        <Text style={{ ...s.h2, letterSpacing: 3 }}>aurev</Text>
        <View style={s.row}>
          <IconButton label="Aurev Privé" onPress={() => router.push("/prive")}>
            <Sparkles size={18} color={c.gold} />
          </IconButton>
          <IconButton
            label="Discovery filters"
            onPress={() => router.push("/filters")}
          >
            <SlidersHorizontal size={18} color={c.ivory} />
          </IconButton>
        </View>
      </View>
      <View style={{ gap: 8 }}>
        <Label>A CHANCE TO FEEL SOMETHING</Label>
        <Text style={s.title}>Good people.{"\n"}Beautiful possibilities.</Text>
        <Text style={s.body}>
          Curated by your preferences. Connected by curiosity.
        </Text>
      </View>
      <View style={s.between}>
        <Label>YOUR NEXT INTRODUCTION</Label>
        <Text style={{ ...s.body, fontSize: 11 }}>
          {people.length} possibilities
        </Text>
      </View>
      {match ? (
        <View style={s.card}>
          <Heart color={c.gold} size={36} />
          <Text style={s.title}>The feeling is mutual.</Text>
          <Text style={s.body}>
            You and {profiles.find((p) => p.id === match)?.name} liked each
            other. This is a simulated match.
          </Text>
          <Button
            title="Say something lovely"
            onPress={() => {
              const id = match;
              setMatch("");
              router.push({ pathname: "/chat/[id]", params: { id } });
            }}
          />
          <Button
            title="Keep discovering"
            variant="outline"
            onPress={() => setMatch("")}
          />
        </View>
      ) : person ? (
        <>
          <PersonCard person={person} />
          <View style={[s.row, { justifyContent: "center", gap: 30 }]}>
            <IconButton
              label={`Pass on ${person.name}`}
              onPress={() => act(false)}
            >
              <X color={c.muted} size={25} />
            </IconButton>
            <Button
              title="View their story"
              variant="outline"
              onPress={() =>
                router.push({
                  pathname: "/person/[id]",
                  params: { id: person.id },
                })
              }
            />
            <IconButton label={`Like ${person.name}`} onPress={() => act(true)}>
              <Heart color={c.gold} size={24} />
            </IconButton>
          </View>
        </>
      ) : (
        <Empty
          title="A little pause, a fresh possibility."
          body="You’ve seen everyone matching these preferences. Broaden your filters or revisit passed profiles."
          action={
            <>
              <Button
                title="Adjust filters"
                onPress={() => router.push("/filters")}
              />
              <Button
                title="Revisit passed profiles"
                variant="outline"
                onPress={() => update((v) => ({ ...v, passes: [] }))}
              />
            </>
          }
        />
      )}{" "}
      {limit && (
        <Notice>
          Your 10 complimentary demo likes have been used.{" "}
          <Text onPress={() => router.push("/prive")} style={{ color: c.gold }}>
            Explore Privé for unlimited likes.
          </Text>
        </Notice>
      )}
      <Notice>
        LOCAL DEMO · Every profile is fictional. Likes, matches and replies are
        simulated. No one is contacted.
      </Notice>
    </Page>
  );
}

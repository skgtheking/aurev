import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useStore } from "../../store";
import { profiles } from "../../data/profiles";
import {
  Button,
  Chips,
  Empty,
  Label,
  Notice,
  Page,
  Portrait,
} from "../../components/ui";
import { age, reciprocal, zodiac } from "../../utils/domain";
import { s } from "../../theme";
export default function PersonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, react } = useStore();
  const [result, setResult] = useState("");
  const person = profiles.find((p) => p.id === id);
  if (!person || state.blocked.includes(id) || !state.user || state.signedOut)
    return (
      <Page back>
        <Empty
          title="Profile unavailable"
          body="This profile is unavailable or blocked."
        />
      </Page>
    );
  const liked = state.likes.includes(id);
  const matched = state.matches.includes(id);
  return (
    <Page
      back
      kicker="AN INTRODUCTION, NOT A RESUMÉ"
      title={`${person.name}, ${age(person.dob)}`}
    >
      <Label>
        {person.city} · {person.pronouns}
      </Label>
      <Portrait uri={person.photos[0]} height={400} />
      <Text style={s.h2}>A little about {person.name}</Text>
      <Text style={s.text}>{person.bio}</Text>
      <View style={s.card}>
        <Label>{person.prompt}</Label>
        <Text style={s.h2}>{person.answer}</Text>
      </View>
      <Label>
        {person.intention} · {person.orientation}
      </Label>
      <Chips
        values={person.interests}
        selected={person.interests}
        onSelect={(interest) =>
          setResult(
            `${person.name} loves ${interest.toLowerCase()}. Try opening a conversation about it.`,
          )
        }
      />
      {person.astrology && (
        <Button
          title={`${zodiac(person.dob)} · Explore Cosmic Chemistry`}
          variant="outline"
          onPress={() => router.push({ pathname: "/cosmic", params: { id } })}
        />
      )}
      <Notice>
        Fictional adult profile · Original illustrated portrait · Never share
        sensitive information with someone you haven’t met.
      </Notice>
      {!!result && <Notice>{result}</Notice>}
      {matched ? (
        <Button
          title="Open conversation"
          onPress={() =>
            router.push({ pathname: "/chat/[id]", params: { id } })
          }
        />
      ) : (
        <Button
          title={
            liked
              ? "Like sent"
              : reciprocal(state.user, person)
                ? "Send a little interest"
                : "Outside your reciprocal preferences"
          }
          disabled={liked || !reciprocal(state.user, person)}
          onPress={() => {
            if (!state.prive && state.likes.length >= 10) {
              router.push("/prive");
              return;
            }
            setResult(
              react(id, true)
                ? "It’s a simulated match! You can now chat."
                : "Your like is saved. No real person was contacted.",
            );
          }}
        />
      )}
      <Button
        title="Safety · block or report"
        variant="quiet"
        onPress={() => router.push({ pathname: "/safety", params: { id } })}
      />
    </Page>
  );
}

export function generateStaticParams() {
  return profiles.map((p) => ({ id: p.id }));
}

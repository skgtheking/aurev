import { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useStore } from "../../store";
import { profiles } from "../../data/profiles";
import { eligible } from "../../utils/domain";
import { Button, Chips, Empty, Notice, Page } from "../../components/ui";
import { PersonCard } from "../../features/discover/PersonCard";
import { s } from "../../theme";
export default function Likes() {
  const { state, react } = useStore();
  const [tab, setTab] = useState("For you");
  if (!state.user) return null;
  const ids =
    tab === "Sent"
      ? state.likes
      : tab === "Matches"
        ? state.matches
        : state.received.filter((id) => !state.matches.includes(id));
  const people = profiles.filter(
    (p) =>
      ids.includes(p.id) &&
      !state.blocked.includes(p.id) &&
      (tab !== "For you" ||
        eligible(
          p,
          state.user!,
          {
            ...state.filters,
            minAge: 18,
            maxAge: 120,
            city: "",
            gender: "Everyone",
            intention: "Any",
          },
          state.blocked,
        )),
  );
  return (
    <Page kicker="THE START OF SOMETHING" title="A little interest.">
      <Text style={s.body}>
        A thoughtful hello can change the shape of your day.
      </Text>
      <Chips
        values={["For you", "Sent", "Matches"]}
        selected={[tab]}
        onSelect={setTab}
      />
      <Notice>
        All received likes and mutual matches are fictional demo fixtures. Match
        history persists on this device.
      </Notice>
      {tab === "For you" && !state.prive ? (
        <View style={s.card}>
          <Text style={s.h2}>{people.length} possibilities, waiting.</Text>
          <Text style={s.body}>
            Privé reveals fictional received likes. You can still discover and
            match with people on the free demo.
          </Text>
          <Button
            title="Discover Privé"
            onPress={() => router.push("/prive")}
          />
        </View>
      ) : people.length ? (
        people.map((p) => (
          <View key={p.id} style={s.card}>
            <PersonCard person={p} compact />
            {tab === "For you" ? (
              <Button
                title="Like back · simulated match"
                onPress={() => {
                  react(p.id, true);
                  setTab("Matches");
                }}
              />
            ) : state.matches.includes(p.id) ? (
              <Button
                title="Start a conversation"
                onPress={() =>
                  router.push({ pathname: "/chat/[id]", params: { id: p.id } })
                }
              />
            ) : (
              <Text style={s.body}>
                Like sent · awaiting a fictional mutual connection
              </Text>
            )}
          </View>
        ))
      ) : (
        <Empty
          title="Possibility takes its time."
          body="Your connections will appear here as you explore."
          action={
            <Button
              title="Discover people"
              onPress={() => router.push("/(tabs)")}
            />
          }
        />
      )}
    </Page>
  );
}

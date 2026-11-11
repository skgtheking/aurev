import { router } from "expo-router";
import { Text, View } from "react-native";
import { useStore } from "../../store";
import { Button, Label, Page, Portrait, RowLink } from "../../components/ui";
import { age } from "../../utils/domain";
import { s } from "../../theme";
export default function Profile() {
  const { state } = useStore();
  const p = state.user;
  if (!p) return null;
  return (
    <Page kicker="YOUR VERY OWN CHAPTER" title="A little more you.">
      <View style={s.row}>
        <View style={{ width: 100 }}>
          <Portrait uri={p.photos[0]} height={120} />
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={s.h2}>
            {p.name}, {age(p.dob)}
          </Text>
          <Text style={s.body}>
            {p.city} · {p.pronouns}
          </Text>
          <Label>{state.prive ? "AUREV PRIVÉ" : "AUREV MEMBER"}</Label>
        </View>
      </View>
      <Text style={s.text}>{p.bio}</Text>
      <Button
        title="Edit your story"
        variant="outline"
        onPress={() => router.push("/edit-profile")}
      />
      <View style={s.card}>
        <Label>A LITTLE EXTRAORDINARY</Label>
        <Text style={s.h2}>Aurev Privé</Text>
        <Text style={s.body}>
          More room for the kind of connection you’re looking for.
        </Text>
        <Button
          title={state.prive ? "Manage demo membership" : "Explore Privé"}
          onPress={() => router.push("/prive")}
        />
      </View>
      <View>
        <RowLink
          title="Cosmic Chemistry"
          subtitle="An optional conversation with the stars"
          onPress={() => router.push("/cosmic")}
        />
        <RowLink
          title="Your preferences"
          onPress={() => router.push("/filters")}
        />
        <RowLink
          title="Your journeys"
          onPress={() => router.push("/(tabs)/trips")}
        />
        <RowLink
          title="Settings & privacy"
          subtitle="Safety, account and local demo controls"
          onPress={() => router.push("/settings")}
        />
      </View>
    </Page>
  );
}

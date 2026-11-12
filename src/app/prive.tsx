import { Text, View } from "react-native";
import { Sparkles, Check } from "lucide-react-native";
import { useStore } from "../store";
import { Button, Label, Notice, Page } from "../components/ui";
import { colors as c, s } from "../theme";
export default function Prive() {
  const { state, update } = useStore();
  const eligible = state.user?.gender === "Woman";
  return (
    <Page
      back
      kicker="AUREV PRIVÉ"
      title="Connection,{ '\n' }with a little more."
    >
      <View style={[s.card, { padding: 30, backgroundColor: c.amethyst }]}>
        <Sparkles size={34} color={c.gold} />
        <Text style={s.title}>For the beautifully{"\n"}intentional.</Text>
        <Label>
          {state.prive ? "YOUR PRIVÉ DEMO IS ACTIVE" : "AN INVITATION TO MORE"}
        </Label>
        <Text style={s.body}>
          Thoughtful extras. More possibilities. The same room to be yourself.
        </Text>
      </View>
      {[
        ["Likes", "10 likes per day in free demo · Unlimited with Privé"],
        ["See who’s curious", "Reveal fictional received likes with Privé"],
        [
          "Find your intention",
          "Basic filters free · Privé adds a relationship shortcut",
        ],
        ["Travel further", "2 saved journeys free · Unlimited with Privé"],
        ["A quieter presence", "Privé incognito preview, stored locally"],
        ["A little cosmic depth", "Extra reflection prompts with Privé"],
      ].map(([title, body]) => (
        <View key={title} style={s.row}>
          <Check color={c.gold} size={18} />
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={s.text}>{title}</Text>
            <Text style={s.body}>{body}</Text>
          </View>
        </View>
      ))}
      <Notice>
        {eligible
          ? "You qualify for complimentary prototype Privé based on your self-declared identity as a woman. No verification is requested."
          : "Everyone can activate Privé for free in this local prototype."}{" "}
        Pricing and eligibility are provisional and pending legal and fairness
        review.
      </Notice>
      <Button
        title={
          state.prive
            ? "Switch to free demo"
            : eligible
              ? "Activate complimentary Privé"
              : "Activate free Privé demo"
        }
        onPress={() =>
          update((v) => ({
            ...v,
            prive: !v.prive,
            incognito: v.prive ? false : v.incognito,
          }))
        }
      />
      {state.prive && (
        <Button
          title={
            state.incognito
              ? "Turn off incognito preview"
              : "Enable incognito preview"
          }
          variant="outline"
          onPress={() => update((v) => ({ ...v, incognito: !v.incognito }))}
        />
      )}
      <Notice>
        No payment, subscription or billing. Incognito is a visual demo
        preference; no public visibility or server exists. Safety, reports,
        blocking, deletion and essential messaging are always free.
      </Notice>
    </Page>
  );
}

import { Redirect, router } from "expo-router";
import { Text, View } from "react-native";
import { ArrowUpRight, Sparkles } from "lucide-react-native";
import { useStore } from "../store";
import { demoUser } from "../data/profiles";
import { Button, Label, Page, Portrait } from "../components/ui";
import { colors as c, fonts, s } from "../theme";
export default function Welcome() {
  const { state, complete, update } = useStore();
  if (state.user && !state.signedOut) return <Redirect href="/(tabs)" />;
  return (
    <Page>
      <View style={[s.between, { marginBottom: 12 }]}>
        <Text
          style={{
            fontFamily: fonts.display,
            color: c.ivory,
            fontSize: 40,
            letterSpacing: 4,
          }}
        >
          aurev
        </Text>
        <Label>EST. IN POSSIBILITY</Label>
      </View>
      <View style={{ borderRadius: 22, overflow: "hidden" }}>
        <Portrait uri="portrait:3" height={330} />
        <View
          style={{
            position: "absolute",
            left: 22,
            bottom: 24,
            right: 22,
            gap: 10,
          }}
        >
          <Sparkles size={22} color={c.rose} />
          <Text
            style={{ fontFamily: fonts.display, color: c.ivory, fontSize: 38 }}
          >
            For a connection{"\n"}less ordinary.
          </Text>
        </View>
      </View>
      <Label>THOUGHTFULLY MADE FOR INDIA</Label>
      <Text style={s.title}>
        A little chemistry.{"\n"}A lot of possibility.
      </Text>
      <Text style={s.body}>
        Meet people with depth. Find a spark in your city, on your next journey,
        or somewhere wonderfully unexpected.
      </Text>
      {state.user ? (
        <Button
          title={`Welcome back, ${state.user.name}`}
          onPress={() => update((v) => ({ ...v, signedOut: false }))}
        />
      ) : (
        <Button
          title="Begin your story  ↗"
          onPress={() => router.push("/onboarding")}
        />
      )}
      <Button
        title="Explore the fictional demo"
        variant="outline"
        onPress={() => complete(demoUser)}
      />
      <Text style={{ ...s.body, fontSize: 11, textAlign: "center" }}>
        18+ only · Local prototype · No real people or purchases.{"\n"}Your demo
        data stays on this device. Interactions are simulated.
      </Text>
      <View style={[s.row, { justifyContent: "center" }]}>
        <ArrowUpRight size={14} color={c.gold} />
        <Text style={{ ...s.eyebrow, fontSize: 9 }}>MEANINGFUL BY DESIGN</Text>
      </View>
    </Page>
  );
}

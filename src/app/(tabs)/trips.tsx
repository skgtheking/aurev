import { Text, View } from "react-native";
import { router } from "expo-router";
import { MapPin, Plane } from "lucide-react-native";
import { useStore } from "../../store";
import { Button, Empty, Label, Notice, Page } from "../../components/ui";
import { today } from "../../utils/domain";
import { colors as c, s } from "../../theme";
export default function Trips() {
  const { state } = useStore();
  const upcoming = state.trips.filter((t) => t.end >= today());
  return (
    <Page kicker="SOME STORIES BEGIN ELSEWHERE" title="TripMatch">
      <Text style={s.body}>
        A new city. A different rhythm. Someone you might never have met.
      </Text>
      <View style={[s.card, { backgroundColor: c.amethyst, padding: 28 }]}>
        <Plane color={c.gold} size={32} />
        <Text style={s.h2}>Take a little{"\n"}possibility with you.</Text>
        <Text style={s.body}>
          Meet fictional locals and fellow travellers across India. Share a
          destination, never a precise location.
        </Text>
        <Button
          title="Plan a journey  ↗"
          onPress={() => router.push("/trip")}
        />
      </View>
      <View style={s.between}>
        <Label>YOUR UPCOMING JOURNEYS</Label>
        <Text style={s.body}>{upcoming.length}</Text>
      </View>
      {upcoming.length ? (
        upcoming.map((t) => (
          <View style={s.card} key={t.id}>
            <View style={s.row}>
              <MapPin size={20} color={c.gold} />
              <Text style={s.h2}>{t.city}</Text>
            </View>
            <Text style={s.body}>
              {t.start} — {t.end}
            </Text>
            <Label>
              {t.optIn
                ? "TRAVELLER DISCOVERY ON"
                : "PRIVATE TRIP · DISCOVERY OFF"}
            </Label>
            <Button
              title="Explore connections & edit trip"
              variant="outline"
              onPress={() =>
                router.push({ pathname: "/trip", params: { id: t.id } })
              }
            />
          </View>
        ))
      ) : (
        <Empty
          title="Where will your story go?"
          body="Add an upcoming journey to discover locals and overlapping travellers."
        />
      )}
      <Notice>
        City-level information only. Traveller matching requires both people to
        opt in and dates to overlap. All traveller itineraries are fictional.
      </Notice>
    </Page>
  );
}

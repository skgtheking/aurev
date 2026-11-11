import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useStore } from "../store";
import { fixtureTrips, profiles } from "../data/profiles";
import { overlap, reciprocal, today, validateTrip } from "../utils/domain";
import {
  Button,
  Chips,
  Empty,
  Field,
  Label,
  Notice,
  Page,
} from "../components/ui";
import { PersonCard } from "../features/discover/PersonCard";
import { s } from "../theme";
export default function TripEditor() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state, saveTrip, update, react } = useStore();
  const existing = state.trips.find((t) => t.id === id);
  const [trip, setTrip] = useState(
    () =>
      existing || {
        id: `trip-${Date.now()}`,
        city: "",
        start: "",
        end: "",
        optIn: true,
      },
  );
  const persisted = state.trips.some((t) => t.id === trip.id);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(!!existing);
  const [deleting, setDeleting] = useState(false);
  const [mode, setMode] = useState("Locals");
  const fixtures = useMemo(() => fixtureTrips(), []);
  if (!state.user) return null;
  const people = profiles.filter(
    (p) =>
      !state.blocked.includes(p.id) &&
      reciprocal(state.user!, p) &&
      state.user!.traveler &&
      trip.optIn &&
      trip.end >= today() &&
      p.traveler &&
      (mode === "Locals"
        ? p.city.toLowerCase() === trip.city.trim().toLowerCase()
        : fixtures[p.id].some((t) => overlap(trip, t))),
  );
  return (
    <Page
      back
      title={existing ? "Your journey" : "Somewhere new"}
      kicker="TRIPMATCH · INDIA"
    >
      <Field
        label="Destination city in India"
        placeholder="Goa, Jaipur, Kochi…"
        value={trip.city}
        onChangeText={(city) => {
          setTrip({ ...trip, city });
          setSaved(false);
        }}
      />
      <Field
        label="Start date · YYYY-MM-DD"
        placeholder={today()}
        value={trip.start}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        onChangeText={(start) => {
          setTrip({ ...trip, start });
          setSaved(false);
        }}
      />
      <Field
        label="End date · YYYY-MM-DD"
        placeholder="YYYY-MM-DD"
        value={trip.end}
        maxLength={10}
        keyboardType="numbers-and-punctuation"
        onChangeText={(end) => {
          setTrip({ ...trip, end });
          setSaved(false);
        }}
      />
      <Label>Opt in to discovery on this trip</Label>
      <Chips
        values={["Off", "On"]}
        selected={[trip.optIn ? "On" : "Off"]}
        onSelect={(x) => {
          setTrip({ ...trip, optIn: x === "On" });
          setSaved(false);
        }}
      />
      {!state.user.traveler && (
        <Notice>
          Turn on traveller discovery in Edit Profile to see people. Your trip
          can still be saved privately.
        </Notice>
      )}
      {!!error && <Notice error>{error}</Notice>}
      <Button
        title={saved ? "Journey saved" : "Save journey"}
        onPress={() => {
          const issue = validateTrip(trip);
          if (issue) {
            setError(issue);
            return;
          }
          if (!state.prive && !persisted && state.trips.length >= 2) {
            setError(
              "The free demo supports two saved journeys. Delete a journey or explore Privé.",
            );
            return;
          }
          saveTrip({ ...trip, city: trip.city.trim() });
          setSaved(true);
          setError("");
        }}
      />
      {persisted && (
        <Button
          title="Delete journey"
          variant="quiet"
          onPress={() => setDeleting(true)}
        />
      )}{" "}
      {deleting && (
        <View style={s.card}>
          <Text style={s.body}>Delete this saved journey?</Text>
          <Button
            title="Confirm deletion"
            variant="danger"
            onPress={() => {
              update((v) => ({
                ...v,
                trips: v.trips.filter((t) => t.id !== trip.id),
              }));
              router.back();
            }}
          />
          <Button
            title="Keep journey"
            variant="outline"
            onPress={() => setDeleting(false)}
          />
        </View>
      )}
      <Notice>
        Try Goa for overlapping travellers during{" "}
        {Object.values(fixtures)[0][0].start} —{" "}
        {Object.values(fixtures)[0][0].end}. Future fictional itineraries are
        generated when this screen opens.
      </Notice>
      {saved && (
        <>
          <Label>MEET ALONG THE WAY</Label>
          <Chips
            values={["Locals", "Travellers"]}
            selected={[mode]}
            onSelect={setMode}
          />
          {people.length ? (
            people.map((p) => (
              <View style={s.card} key={p.id}>
                <PersonCard person={p} compact />
                <Notice>
                  {mode === "Locals"
                    ? "Fictional local · same destination city"
                    : "Fictional traveller · overlapping dates and mutual opt-in"}
                </Notice>
                {state.matches.includes(p.id) ? (
                  <Button
                    title="Ask for a local favourite"
                    onPress={() =>
                      router.push({
                        pathname: "/chat/[id]",
                        params: {
                          id: p.id,
                          starter: `If we had one afternoon in ${trip.city}, where would you take me?`,
                        },
                      })
                    }
                  />
                ) : (
                  <Button
                    title={
                      state.likes.includes(p.id) ? "Like sent" : "Send interest"
                    }
                    disabled={state.likes.includes(p.id)}
                    onPress={() => {
                      if (!state.prive && state.likes.length >= 10) {
                        router.push("/prive");
                        return;
                      }
                      if (react(p.id, true))
                        setError(
                          `A simulated match with ${p.name}! You can now open a conversation.`,
                        );
                    }}
                  />
                )}
              </View>
            ))
          ) : (
            <Empty
              title="A city full of possibility"
              body="No fictional connections meet the destination, dates and opt-in rules. Try the suggested Goa dates or enable traveller discovery."
            />
          )}
        </>
      )}
      <Notice>
        India-only demo. Destinations are free text and are not geocoded or
        verified. Never add hotel details, addresses, or real-time location.
      </Notice>
    </Page>
  );
}

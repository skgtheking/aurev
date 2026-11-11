import { useState } from "react";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useStore } from "../store";
import { profiles } from "../data/profiles";
import { Button, Label, Notice, Page, RowLink } from "../components/ui";
import { s } from "../theme";
export default function Settings() {
  const { state, update, reset } = useStore();
  const [confirm, setConfirm] = useState("");
  const perform = () => {
    if (confirm === "Sign out") update((v) => ({ ...v, signedOut: true }));
    else if (confirm === "Restart onboarding")
      update((v) => ({ ...v, user: null, signedOut: false }));
    else reset();
    setConfirm("");
    router.replace(confirm === "Restart onboarding" ? "/onboarding" : "/");
  };
  return (
    <Page back title="Settings & privacy" kicker="YOUR SPACE, YOUR RULES">
      <Notice>
        LOCAL DEMO · Your details, photos, messages and reports are saved in
        unencrypted device storage. There is no backend, authentication or real
        account security. Use fictional information.
      </Notice>
      <Label>YOUR PREFERENCES</Label>
      <RowLink
        title="Edit profile & identity"
        onPress={() => router.push("/edit-profile")}
      />
      <RowLink
        title="Discovery preferences"
        onPress={() => router.push("/filters")}
      />
      <RowLink
        title="Astrology & privacy"
        onPress={() => router.push("/cosmic")}
      />
      <View style={s.card}>
        <Text style={s.h2}>Privacy at a glance</Text>
        <Text style={s.body}>
          Only a city is shown. Birth date stays off your public profile.
          Astrology and travel discovery are optional. Photos are stored locally
          for this demonstration.
        </Text>
        <Text style={s.body}>
          Incognito preview: {state.incognito ? "enabled" : "disabled"}. No
          public profiles are transmitted by this prototype.
        </Text>
      </View>
      <Label>BLOCKED PROFILES · {state.blocked.length}</Label>
      {state.blocked.length ? (
        state.blocked.map((id) => (
          <View key={id} style={s.between}>
            <Text style={s.text}>
              {profiles.find((p) => p.id === id)?.name || "Unavailable profile"}
            </Text>
            <Button
              title="Unblock"
              variant="outline"
              onPress={() =>
                update((v) => ({
                  ...v,
                  blocked: v.blocked.filter((x) => x !== id),
                }))
              }
            />
          </View>
        ))
      ) : (
        <Text style={s.body}>You haven’t blocked anyone.</Text>
      )}
      <Text style={s.body}>
        {state.reports.length} local safety report(s) saved. Reports are not
        submitted to a server.
      </Text>
      <Label>ACCOUNT & DEMO</Label>
      {[
        "Sign out",
        "Restart onboarding",
        "Reset demo data",
        "Delete local account",
      ].map((title) => (
        <Button
          key={title}
          title={title}
          variant={title === "Delete local account" ? "danger" : "outline"}
          onPress={() => setConfirm(title)}
        />
      ))}
      {confirm && (
        <View style={s.card}>
          <Text style={s.h2}>{confirm}?</Text>
          <Text style={s.body}>
            {confirm === "Sign out"
              ? "Your local profile and conversations remain available when you return."
              : confirm === "Restart onboarding"
                ? "Your profile is cleared; demo interactions stay on this device."
                : "This clears your profile and all local changes and restores the fictional fixture data. There is no remote account to delete."}
          </Text>
          <Button
            title={`Confirm ${confirm.toLowerCase()}`}
            variant="danger"
            onPress={perform}
          />
          <Button
            title="Cancel"
            variant="quiet"
            onPress={() => setConfirm("")}
          />
        </View>
      )}
      <Notice>
        Aurev v0.1 · Adults 18+ · All India · Prototype only. Account deletion
        clears your user details and messages, then reinitializes the fictional
        demo fixtures.
      </Notice>
    </Page>
  );
}

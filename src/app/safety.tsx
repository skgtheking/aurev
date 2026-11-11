import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "react-native";
import { useStore } from "../store";
import { profiles } from "../data/profiles";
import { Button, Chips, Empty, Notice, Page } from "../components/ui";
import { s } from "../theme";
export default function Safety() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { block } = useStore();
  const [reason, setReason] = useState("");
  const [confirm, setConfirm] = useState(false);
  const p = profiles.find((p) => p.id === id);
  if (!p)
    return (
      <Page back>
        <Empty
          title="Profile unavailable"
          body="Choose a profile to open its safety controls."
        />
      </Page>
    );
  return (
    <Page back kicker="YOUR COMFORT COMES FIRST" title="A safer space">
      <Text style={s.body}>
        Blocking {p?.name || "this profile"} removes them from discovery, likes,
        matches and conversations on this device.
      </Text>
      <Button
        title="Block profile"
        variant="danger"
        onPress={() => {
          setReason("");
          setConfirm(true);
        }}
      />
      <Text style={s.h2}>Report a concern</Text>
      <Chips
        values={[
          "Harassment",
          "Impersonation",
          "Underage concern",
          "Inappropriate content",
          "Other safety concern",
        ]}
        selected={[reason]}
        onSelect={setReason}
      />
      <Button
        title="Report & block"
        variant="outline"
        disabled={!reason}
        onPress={() => setConfirm(true)}
      />
      {confirm && (
        <>
          <Notice>
            {reason
              ? "Save this local report and block the profile?"
              : "Block this profile?"}{" "}
            This removes their conversation history. Unblocking will not restore
            it.
          </Notice>
          <Button
            title="Confirm block"
            variant="danger"
            onPress={() => {
              block(id, reason || undefined);
              router.replace("/(tabs)");
            }}
          />
          <Button
            title="Cancel"
            variant="quiet"
            onPress={() => setConfirm(false)}
          />
        </>
      )}
      <Notice>
        Reports are stored locally for demonstration. There is no moderation
        team or emergency response behind this prototype. If you face immediate
        danger, contact local emergency services.
      </Notice>
    </Page>
  );
}

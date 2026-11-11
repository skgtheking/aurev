import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { Moon, Stars } from "lucide-react-native";
import { useStore } from "../store";
import { profiles } from "../data/profiles";
import { Button, Empty, Label, Notice, Page } from "../components/ui";
import { chemistry, zodiac } from "../utils/domain";
import { colors as c, s } from "../theme";
export default function Cosmic() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { state, update } = useStore();
  const p = id ? profiles.find((p) => p.id === id) : null;
  const user = state.user;
  if (!user)
    return (
      <Page back>
        <Empty
          title="Begin your story first"
          body="Cosmic Chemistry is an optional profile feature."
        />
      </Page>
    );
  const available =
    user.astrology && (!p || p.astrology) && !state.blocked.includes(id || "");
  return (
    <Page back kicker="A LITTLE WRITTEN IN THE STARS" title="Cosmic Chemistry">
      <View
        style={[
          s.card,
          { alignItems: "center", padding: 32, backgroundColor: c.amethyst },
        ]}
      >
        <Moon color={c.gold} size={38} />
        <Text style={[s.title, { textAlign: "center" }]}>
          {available
            ? `${zodiac(user.dob)}${p ? ` × ${zodiac(p.dob)}` : ""}`
            : "Your stars, your choice."}
        </Text>
        <Text style={[s.body, { textAlign: "center" }]}>
          A playful way to start a deeper conversation.
        </Text>
      </View>
      {!user.astrology ? (
        <>
          <Notice>
            Astrology is off. Enabling it derives only a Western sun sign from
            your locally stored date of birth.
          </Notice>
          <Button
            title="Opt in to Cosmic Chemistry"
            onPress={() =>
              update((v) => ({
                ...v,
                user: v.user ? { ...v.user, astrology: true } : null,
              }))
            }
          />
        </>
      ) : p && !p.astrology ? (
        <Notice>
          This fictional profile has not opted in. Their astrology is
          unavailable.
        </Notice>
      ) : available ? (
        <>
          <Label>WESTERN SUN SIGNS · ENTERTAINMENT</Label>
          <Text style={s.text}>
            {p
              ? chemistry(user.dob, p.dob)
              : `${zodiac(user.dob)} invites you to reflect on what lights you up. What feels like connection to you? Use astrology as a conversation prompt, never a judgment of someone’s worth.`}
          </Text>
          {state.prive && (
            <View style={s.card}>
              <Stars color={c.gold} size={24} />
              <Label>PRIVÉ REFLECTION</Label>
              <Text style={s.h2}>What makes you feel seen?</Text>
              <Text style={s.body}>
                Swap stories about a time someone understood you without an
                explanation. What would it take to create that feeling together?
              </Text>
            </View>
          )}
        </>
      ) : (
        <Notice>Astrology is unavailable for this profile.</Notice>
      )}
      <View style={s.card}>
        <Label>VEDIC ASTROLOGY · FUTURE FEATURES</Label>
        {[
          [
            "Rashi",
            "A lunar sign; a reliable calculation needs birth details and an astronomical ephemeris.",
          ],
          [
            "Nakshatra",
            "The Moon’s lunar mansion at birth. Not calculated in this prototype.",
          ],
          [
            "Kundli",
            "A birth chart based on time and place. No chart is generated here.",
          ],
          [
            "Guna Milan",
            "A traditional comparison framework. No numerical score is invented or shown.",
          ],
        ].map(([title, body]) => (
          <View key={title} style={{ gap: 5 }}>
            <Text style={s.h2}>{title}</Text>
            <Text style={s.body}>{body}</Text>
          </View>
        ))}
      </View>
      <Notice>
        For entertainment and cultural exploration only. We do not collect birth
        time or birthplace. Compatibility depends on people, communication and
        consent.
      </Notice>
      <Button
        title="Manage astrology in your profile"
        variant="outline"
        onPress={() => router.push("/edit-profile")}
      />
    </Page>
  );
}

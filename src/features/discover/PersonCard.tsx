import { router } from "expo-router";
import { MapPin, ArrowUpRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import type { Person } from "../../types";
import { Portrait, Label } from "../../components/ui";
import { age } from "../../utils/domain";
import { colors as c, s } from "../../theme";
export function PersonCard({
  person,
  compact = false,
}: {
  person: Person;
  compact?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${person.name}’s profile`}
      onPress={() =>
        router.push({ pathname: "/person/[id]", params: { id: person.id } })
      }
      style={{ gap: 16 }}
    >
      <Portrait uri={person.photos[0]} height={compact ? 220 : 370} />
      <View style={s.between}>
        <View style={{ gap: 5 }}>
          <Text style={s.h2}>
            {person.name}, {age(person.dob)}
          </Text>
          <View style={s.row}>
            <MapPin size={12} color={c.gold} />
            <Text style={{ ...s.body, fontSize: 12 }}>
              {person.city} · {person.pronouns}
            </Text>
          </View>
        </View>
        <ArrowUpRight size={20} color={c.gold} />
      </View>
      {!compact && (
        <>
          <Label>
            {person.intention} · {person.interests[0]}
          </Label>
          <Text style={s.body} numberOfLines={2}>
            {person.bio}
          </Text>
        </>
      )}
    </Pressable>
  );
}

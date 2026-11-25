import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, TextInput, View } from "react-native";
import { colors as c, fonts, s } from "../theme";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

function isoDate(year: number, month: number, day: number) {
  const d = new Date(Date.UTC(year, month - 1, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) return "";
  return year + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}
function displayDate(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? m[2] + "/" + m[3] + "/" + m[1] : "";
}
function parts(value: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return m ? { year: Number(m[1]), month: Number(m[2]) - 1, day: Number(m[3]) } : null;
}
function mask(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
}
function parse(value: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return m ? isoDate(Number(m[3]), Number(m[1]), Number(m[2])) : "";
}

export function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const selected = parts(value);
  const [text, setText] = useState(displayDate(value));
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => {
    const initial = selected || { year: new Date().getFullYear() - 25, month: new Date().getMonth(), day: 1 };
    return { year: initial.year, month: initial.month };
  });
  const earliest = useMemo(() => {
    const now = new Date();
    const latest = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    return new Date(latest.getFullYear() - 102, latest.getMonth(), latest.getDate());
  }, []);
  const latest = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
  }, []);
  const monthNumber = month.year * 12 + month.month;
  const minMonth = earliest.getFullYear() * 12 + earliest.getMonth();
  const maxMonth = latest.getFullYear() * 12 + latest.getMonth();
  const leading = new Date(Date.UTC(month.year, month.month, 1)).getUTCDay();
  const count = new Date(Date.UTC(month.year, month.month + 1, 0)).getUTCDate();
  const cells = Array.from({ length: Math.ceil((leading + count) / 7) * 7 }, (_, i) => {
    const day = i - leading + 1;
    return day > 0 && day <= count ? day : null;
  });
  const moveMonth = (delta: number) => setMonth((current) => {
    const d = new Date(current.year, current.month + delta, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const choose = (day: number) => {
    const iso = isoDate(month.year, month.month + 1, day);
    if (!iso) return;
    onChange(iso);
    setText(displayDate(iso));
    setOpen(false);
  };
  return (
    <View style={{ gap: 9 }}>
      <Text style={{ ...s.body, color: c.ivory, fontSize: 12 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TextInput
          accessibilityLabel={label}
          accessibilityHint="Type a birthday or choose it from the calendar. Format: MM/DD/YYYY."
          placeholder="MM/DD/YYYY"
          placeholderTextColor={c.muted}
          keyboardType="number-pad"
          value={text}
          onChangeText={(input) => {
            const next = mask(input);
            setText(next);
            const parsed = parse(next);
            onChange(parsed);
          }}
          maxLength={10}
          style={[s.input, { flex: 1 }]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={open ? "Close calendar" : "Choose birthday from calendar"}
          accessibilityState={{ expanded: open }}
          onPress={() => {
            if (!open && selected) setMonth({ year: selected.year, month: selected.month });
            setOpen(!open);
          }}
          style={({ pressed }) => ({
            height: 48, width: 48, alignItems: "center", justifyContent: "center",
            borderWidth: 1, borderColor: open ? c.gold : c.border, borderRadius: 12,
            backgroundColor: c.surface, opacity: pressed ? 0.7 : 1,
          })}
        ><CalendarDays color={c.gold} size={19} /></Pressable>
      </View>
      {open && (
        <View style={{ padding: 14, gap: 14, borderWidth: 1, borderColor: c.border, borderRadius: 16, backgroundColor: c.surface }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pressable accessibilityRole="button" accessibilityLabel="Previous month" disabled={monthNumber <= minMonth} onPress={() => moveMonth(-1)} style={{ padding: 8, opacity: monthNumber <= minMonth ? 0.35 : 1 }}>
              <ChevronLeft color={c.ivory} size={18} />
            </Pressable>
            <Text style={{ color: c.ivory, fontFamily: fonts.medium, fontSize: 14 }}>{months[month.month]} {month.year}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Next month" disabled={monthNumber >= maxMonth} onPress={() => moveMonth(1)} style={{ padding: 8, opacity: monthNumber >= maxMonth ? 0.35 : 1 }}>
              <ChevronRight color={c.ivory} size={18} />
            </Pressable>
          </View>
          <View style={{ flexDirection: "row" }}>
            {weekdays.map((day, i) => <Text key={i} style={{ width: "14.2857%", textAlign: "center", color: c.muted, fontFamily: fonts.medium, fontSize: 11 }}>{day}</Text>)}
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {cells.map((day, i) => {
              const picked = day === selected?.day && month.month === selected.month && month.year === selected.year;
              const candidate = day ? new Date(month.year, month.month, day) : null;
              const disabled = !day || !candidate || candidate < earliest || candidate > latest;
              return (
                <Pressable
                  key={i}
                  accessibilityRole={day ? "button" : undefined}
                  accessibilityLabel={day ? months[month.month] + " " + day + ", " + month.year : undefined}
                  accessibilityState={day ? { selected: picked, disabled } : undefined}
                  disabled={disabled}
                  onPress={() => day && choose(day)}
                  style={({ pressed }) => ({
                    width: "14.2857%", height: 38, alignItems: "center", justifyContent: "center",
                    borderRadius: 19, backgroundColor: picked ? c.gold : "transparent",
                    opacity: disabled ? 0.25 : pressed ? 0.6 : 1,
                  })}
                >
                  {day ? <Text style={{ color: picked ? c.bg : c.ivory, fontFamily: picked ? fonts.medium : fonts.body, fontSize: 12 }}>{day}</Text> : null}
                </Pressable>
              );
            })}
          </View>
          <Text style={{ ...s.body, fontSize: 11 }}>You must be at least 18. Your birthday stays private.</Text>
        </View>
      )}
    </View>
  );
}

import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react-native";
import { router } from "expo-router";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { colors as c, fonts, s } from "../theme";
export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.eyebrow}>{children}</Text>;
}
export function Button({
  title,
  onPress,
  variant = "gold",
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?: "gold" | "outline" | "quiet" | "danger";
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 50,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          variant === "gold"
            ? c.gold
            : variant === "danger"
              ? "#45242C"
              : "transparent",
        borderWidth: variant === "outline" ? 1 : 0,
        borderColor: c.border,
        opacity: disabled ? 0.45 : pressed ? 0.72 : 1,
      })}
    >
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 13,
          color:
            variant === "gold"
              ? c.bg
              : variant === "danger"
                ? c.danger
                : c.ivory,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function IconButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        minWidth: 46,
        minHeight: 46,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 23,
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.surface,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 9 }}>
      <Text style={{ ...s.body, color: c.ivory, fontSize: 12 }}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={c.muted}
        {...props}
        style={[
          s.input,
          props.multiline && { minHeight: 100, textAlignVertical: "top" },
          props.style,
        ]}
      />
    </View>
  );
}
export function Chips<T extends string>({
  values,
  selected,
  onSelect,
}: {
  values: readonly T[];
  selected: readonly string[];
  onSelect: (value: T) => void;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {values.map((value) => (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: selected.includes(value) }}
          key={value}
          onPress={() => onSelect(value)}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: selected.includes(value) ? c.gold : c.border,
            borderRadius: 30,
            backgroundColor: selected.includes(value) ? "#352A31" : c.surface,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: 12,
              color: selected.includes(value) ? c.rose : c.muted,
            }}
          >
            {value}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function Page({
  children,
  title,
  kicker,
  back = false,
  action,
  scroll = true,
}: {
  children: React.ReactNode;
  title?: string;
  kicker?: string;
  back?: boolean;
  action?: React.ReactNode;
  scroll?: boolean;
}) {
  const content = (
    <View style={s.content}>
      {(back || action) && (
        <View style={s.between}>
          {back ? (
            <IconButton
              label="Go back"
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
            >
              <ArrowLeft size={19} color={c.ivory} />
            </IconButton>
          ) : (
            <View />
          )}
          {action}
        </View>
      )}
      {kicker && <Label>{kicker}</Label>}
      {title && <Text style={s.title}>{title}</Text>}
      {children}
    </View>
  );
  return (
    <SafeAreaView style={s.page} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
export function Notice({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{
        padding: 14,
        borderRadius: 12,
        backgroundColor: error ? "#36212A" : c.amethyst,
      }}
    >
      <Text
        style={{ ...s.body, fontSize: 12, color: error ? c.danger : c.muted }}
      >
        {children}
      </Text>
    </View>
  );
}
export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={[s.card, { paddingVertical: 40, alignItems: "center" }]}>
      <Sparkles color={c.gold} size={30} />
      <Text style={[s.h2, { textAlign: "center" }]}>{title}</Text>
      <Text style={[s.body, { textAlign: "center" }]}>{body}</Text>
      {action}
    </View>
  );
}
export function RowLink({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        s.between,
        { paddingVertical: 16, borderBottomWidth: 1, borderColor: c.border },
      ]}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={s.text}>{title}</Text>
        {subtitle && <Text style={s.body}>{subtitle}</Text>}
      </View>
      <ArrowUpRight size={18} color={c.gold} />
    </Pressable>
  );
}
export function Loading() {
  return (
    <SafeAreaView
      style={[
        s.page,
        { justifyContent: "center", alignItems: "center", gap: 20 },
      ]}
    >
      <Text style={s.title}>aurev</Text>
      <ActivityIndicator color={c.gold} />
    </SafeAreaView>
  );
}
const palettes = [
  ["#8F6467", "#332236", "#D5A58C", "#30222C"],
  ["#7B7870", "#242D30", "#B88565", "#1E2027"],
  ["#75806D", "#25382F", "#D1A283", "#302B29"],
  ["#857495", "#31283F", "#B47F69", "#261C28"],
  ["#B18B64", "#433125", "#CC9C78", "#302127"],
  ["#658083", "#243337", "#B98570", "#28232F"],
];
/** Original vector portraits. No external photos or real identity implied. */
export function Portrait({
  uri = "portrait:0",
  height = 420,
}: {
  uri?: string;
  height?: number;
}) {
  if (!uri.startsWith("portrait:"))
    return (
      <Image
        source={{ uri }}
        accessibilityLabel="Selected profile photo"
        style={{ width: "100%", height, borderRadius: 18 }}
        resizeMode="cover"
      />
    );
  const n = Number(uri.split(":")[1]) || 0;
  const p = palettes[n % 6];
  return (
    <View
      accessibilityLabel="Original fictional illustrated portrait"
      style={{
        height,
        width: "100%",
        overflow: "hidden",
        borderRadius: 18,
        backgroundColor: p[1],
      }}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <LinearGradient id={`bg${n}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={p[0]} />
            <Stop offset="1" stopColor={p[1]} />
          </LinearGradient>
        </Defs>
        <Rect width="400" height="500" fill={`url(#bg${n})`} />
        <Circle cx="315" cy="100" r="105" fill="#F5F0EA" opacity=".07" />
        <Path d="M20 500 Q40 320 200 335 Q370 330 395 500" fill={p[3]} />
        <Path d="M150 310 L150 367 Q200 410 250 367 L246 300" fill={p[2]} />
        <Ellipse cx="198" cy="218" rx="89" ry="114" fill={p[3]} />
        <Ellipse cx="200" cy="228" rx="73" ry="95" fill={p[2]} />
        <Path
          d={
            n % 2
              ? "M119 211 Q100 79 215 105 Q306 105 282 230 Q263 149 222 156 Q160 184 119 211"
              : "M109 310 Q80 91 203 100 Q324 92 292 330 L262 267 Q285 173 222 152 Q185 213 131 204 L140 315"
          }
          fill={p[3]}
        />
        <Path
          d="M158 225 Q171 217 184 225 M217 225 Q231 217 245 225"
          stroke="#49312D"
          strokeWidth="3"
          fill="none"
        />
        <Path
          d="M181 276 Q202 287 224 274"
          stroke="#86514B"
          strokeWidth="3"
          fill="none"
        />
        <Path
          d="M200 234 L194 253 L205 255"
          stroke="#9A6C57"
          strokeWidth="2"
          fill="none"
        />
        <Path
          d="M98 500 L143 370 L199 420 L258 369 L310 500"
          fill={n % 2 ? "#665758" : "#CDC0AB"}
        />
        <Path d="M200 422 L199 500" stroke="#B69A72" strokeWidth="2" />
        <Circle cx="200" cy="447" r="3" fill="#B69A72" />
      </Svg>
      <View style={StyleSheet.absoluteFill} pointerEvents="none" />
      <Text
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          fontFamily: fonts.medium,
          fontSize: 8,
          letterSpacing: 2,
          color: c.ivory,
          backgroundColor: "#100D1680",
          padding: 8,
          borderRadius: 20,
        }}
      >
        FICTIONAL PORTRAIT
      </Text>
    </View>
  );
}

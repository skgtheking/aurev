import { Redirect, Tabs } from "expo-router";
import {
  Compass,
  Heart,
  MessageCircle,
  Plane,
  UserRound,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStore } from "../../store";
import { colors as c, fonts } from "../../theme";
export default function TabLayout() {
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  if (!state.user || state.signedOut) return <Redirect href="/" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.gold,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: {
          backgroundColor: c.bg,
          borderTopColor: c.border,
          height: 64 + Math.max(insets.bottom, 14),
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 14),
        },
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 10,
          marginTop: 3,
        },
        sceneStyle: { backgroundColor: c.bg },
      }}
    >
      {(
        [
          ["index", "Discover", Compass],
          ["trips", "TripMatch", Plane],
          ["likes", "Likes", Heart],
          ["chats", "Chats", MessageCircle],
          ["profile", "Profile", UserRound],
        ] as const
      ).map(([name, title, Icon]) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }) => (
              <Icon color={color} size={21} strokeWidth={1.5} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

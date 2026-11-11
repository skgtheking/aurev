import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { CormorantGaramond_500Medium } from "@expo-google-fonts/cormorant-garamond/500Medium";
import { StoreProvider, useStore } from "../store";
import { Loading, Notice } from "../components/ui";
import { colors } from "../theme";
function Routes() {
  const { ready, error, state } = useStore();
  if (!ready) return <Loading />;
  return (
    <>
      <StatusBar style="light" />
      {error && <Notice error>{error}</Notice>}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Protected guard={!!state.user && !state.signedOut}>
          {[
            "(tabs)",
            "person/[id]",
            "chat/[id]",
            "filters",
            "trip",
            "edit-profile",
            "cosmic",
            "prive",
            "safety",
            "settings",
          ].map((name) => (
            <Stack.Screen key={name} name={name} />
          ))}
        </Stack.Protected>
      </Stack>
    </>
  );
}
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    CormorantGaramond_500Medium,
  });
  if (!loaded && !error) return <Loading />;
  return (
    <StoreProvider>
      <Routes />
    </StoreProvider>
  );
}

import { useRef, useState, type ComponentRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Send, Shield } from "lucide-react-native";
import { useStore } from "../../store";
import { profiles } from "../../data/profiles";
import { Button, Empty, IconButton, Notice, Page } from "../../components/ui";
import { colors as c, fonts, s } from "../../theme";
export default function Chat() {
  const { id, starter } = useLocalSearchParams<{
    id: string;
    starter?: string;
  }>();
  const { state, message, update } = useStore();
  const list = useRef<ComponentRef<typeof ScrollView>>(null);
  const [text, setText] = useState(starter || "");
  const [confirm, setConfirm] = useState(false);
  const p = profiles.find((p) => p.id === id);
  const chat = state.chats.find((c) => c.personId === id);
  if (
    !state.user ||
    state.signedOut ||
    !p ||
    state.blocked.includes(id) ||
    !state.matches.includes(id)
  )
    return (
      <Page back>
        <Empty
          title="Conversation unavailable"
          body="Conversations require a mutual match and are unavailable after blocking."
        />
      </Page>
    );
  return (
    <SafeAreaView style={s.page}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%", maxWidth: 720, alignSelf: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ padding: 20, gap: 12 }}>
          <View style={s.between}>
            <IconButton label="Back to chats" onPress={() => router.back()}>
              <ArrowLeft color={c.ivory} size={18} />
            </IconButton>
            <Text style={s.h2}>{p.name}</Text>
            <IconButton
              label="Safety options"
              onPress={() =>
                router.push({ pathname: "/safety", params: { id } })
              }
            >
              <Shield color={c.gold} size={20} />
            </IconButton>
          </View>
          <Notice>
            Local simulated conversation · No real person receives these
            messages.
          </Notice>
        </View>
        <ScrollView
          ref={list}
          onContentSizeChange={() =>
            list.current?.scrollToEnd({ animated: true })
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 22, gap: 15 }}
        >
          {chat?.messages.map((m) => (
            <View
              key={m.id}
              style={{
                maxWidth: "88%",
                alignSelf: m.outgoing ? "flex-end" : "flex-start",
                padding: 16,
                gap: 6,
                borderRadius: 18,
                backgroundColor: m.outgoing ? "#413145" : c.surface,
                borderWidth: 1,
                borderColor: c.border,
              }}
            >
              {m.simulated && <Text style={s.eyebrow}>SIMULATED</Text>}
              <Text style={s.text}>{m.text}</Text>
              <Text style={{ ...s.body, fontSize: 10 }}>
                {new Date(m.at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))}
          {!chat?.messages.length && (
            <Text style={s.body}>
              Ask about {p.interests[0].toLowerCase()}, or start with their
              perfect Sunday.
            </Text>
          )}
        </ScrollView>
        <View
          style={{
            padding: 16,
            gap: 8,
            borderTopWidth: 1,
            borderColor: c.border,
          }}
        >
          <View style={s.row}>
            <TextInput
              accessibilityLabel="Your message"
              placeholder="A thoughtful hello…"
              placeholderTextColor={c.muted}
              value={text}
              maxLength={2000}
              onChangeText={setText}
              multiline
              style={[
                s.input,
                { flex: 1, maxHeight: 120, fontFamily: fonts.body },
              ]}
            />
            <IconButton
              label="Send message"
              onPress={() => {
                message(id, text);
                setText("");
              }}
            >
              <Send color={c.gold} size={20} />
            </IconButton>
          </View>
          <View style={s.row}>
            <Button
              title="Hide"
              variant="quiet"
              onPress={() => {
                update((v) => ({
                  ...v,
                  chats: v.chats.map((c) =>
                    c.personId === id ? { ...c, hidden: true } : c,
                  ),
                }));
                router.replace("/(tabs)/chats");
              }}
            />
            <Button
              title="Delete history"
              variant="quiet"
              onPress={() => setConfirm(!confirm)}
            />
          </View>
          {confirm && (
            <>
              <Notice>
                Delete the stored messages in this conversation? Your match
                remains.
              </Notice>
              <Button
                title="Confirm delete history"
                variant="danger"
                onPress={() => {
                  update((v) => ({
                    ...v,
                    chats: v.chats.map((c) =>
                      c.personId === id ? { ...c, messages: [] } : c,
                    ),
                  }));
                  setConfirm(false);
                }}
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function generateStaticParams() {
  return profiles.map((p) => ({ id: p.id }));
}

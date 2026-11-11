import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useStore } from "../../store";
import { profiles } from "../../data/profiles";
import { Button, Empty, Notice, Page, Portrait } from "../../components/ui";
import { colors as c, s } from "../../theme";
export default function Chats() {
  const { state, update } = useStore();
  const chats = state.chats.filter(
    (chat) => !chat.hidden && !state.blocked.includes(chat.personId),
  );
  return (
    <Page kicker="WORDS BECOME WORLDS" title="Conversations">
      <Text style={s.body}>
        Be curious. Be kind. Be a little more yourself.
      </Text>
      <Notice>
        SIMULATED CHAT · Replies are scripted local messages. No messages are
        sent to real people.
      </Notice>
      {chats.length ? (
        chats.map((chat) => {
          const p = profiles.find((p) => p.id === chat.personId);
          if (!p) return null;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Chat with ${p.name}`}
              key={p.id}
              onPress={() =>
                router.push({ pathname: "/chat/[id]", params: { id: p.id } })
              }
              style={[
                s.row,
                {
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderColor: c.border,
                },
              ]}
            >
              <View style={{ width: 68 }}>
                <Portrait uri={p.photos[0]} height={76} />
              </View>
              <View style={{ flex: 1, gap: 5 }}>
                <Text style={s.h2}>{p.name}</Text>
                <Text style={{ ...s.body, fontSize: 12 }} numberOfLines={2}>
                  {chat.messages.at(-1)?.text || "A new connection. Say hello."}
                </Text>
              </View>
            </Pressable>
          );
        })
      ) : (
        <Empty
          title="Let the conversation begin."
          body="Your mutual connections will have a place here."
        />
      )}
      {state.chats.some((c) => c.hidden) && (
        <Button
          title="Restore hidden conversations"
          variant="outline"
          onPress={() =>
            update((v) => ({
              ...v,
              chats: v.chats.map((c) => ({ ...c, hidden: false })),
            }))
          }
        />
      )}
    </Page>
  );
}

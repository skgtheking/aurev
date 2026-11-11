import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { profiles } from "../data/profiles";
import { createPersistor, decode, STORAGE_KEY } from "../services/persistence";
import type { AppState, Person, Trip } from "../types";
import { initialState } from "./initial";
import { blockPerson, reaction } from "../services/actions";
import { reciprocal } from "../utils/domain";
type Updater = (state: AppState) => AppState;
interface Store {
  state: AppState;
  ready: boolean;
  error: string;
  update: (fn: Updater) => void;
  complete: (p: Person) => void;
  react: (id: string, liked: boolean) => boolean;
  message: (id: string, text: string) => void;
  block: (id: string, reason?: string) => void;
  reset: () => void;
  saveTrip: (trip: Trip) => void;
}
const Context = createContext<Store | null>(null);
let sequence = 0;
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const current = useRef(state);
  const persist = useRef(createPersistor(AsyncStorage));
  useEffect(() => {
    let live = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (live) {
          const restored = decode(raw, initialState());
          current.current = restored;
          setState(restored);
          setReady(true);
        }
      })
      .catch(() => {
        if (live) {
          setError(
            "Storage could not be read. Changes may not survive a reload.",
          );
          setReady(true);
        }
      });
    return () => {
      live = false;
    };
  }, []);
  const update = (fn: Updater) => {
    const next = fn(current.current);
    current.current = next;
    setState(next);
    void persist
      .current(next)
      .catch(() =>
        setError(
          "Your latest changes could not be saved. Check available device storage.",
        ),
      );
  };
  const complete = (user: Person) =>
    update((v) => {
      const matches = v.matches.filter((id) => {
        const p = profiles.find((p) => p.id === id);
        return p && reciprocal(user, p) && !v.blocked.includes(id);
      });
      return {
        ...v,
        user,
        signedOut: false,
        matches,
        chats: v.chats.filter((c) => matches.includes(c.personId)),
      };
    });
  const react = (id: string, liked: boolean) => {
    const v = current.current;
    const p = profiles.find((p) => p.id === id);
    if (!v.user || !p || !reciprocal(v.user, p)) return false;
    const next = reaction(v, id, liked);
    update(() => next);
    return next !== v && liked && next.matches.includes(id);
  };
  const message = (id: string, text: string) => {
    if (
      !text.trim() ||
      current.current.blocked.includes(id) ||
      !current.current.matches.includes(id)
    )
      return;
    const at = new Date().toISOString();
    const key = `${Date.now()}-${sequence++}`;
    update((v) => ({
      ...v,
      chats: v.chats.some((c) => c.personId === id)
        ? v.chats.map((c) =>
            c.personId === id
              ? {
                  ...c,
                  hidden: false,
                  messages: [
                    ...c.messages,
                    { id: key, text: text.trim(), outgoing: true, at },
                    {
                      id: `${key}-reply`,
                      text: `Simulated reply from ${profiles.find((p) => p.id === id)?.name}: That sounds lovely. What’s the story behind that?`,
                      outgoing: false,
                      at,
                      simulated: true,
                    },
                  ],
                }
              : c,
          )
        : [
            ...v.chats,
            {
              personId: id,
              hidden: false,
              messages: [
                { id: key, text: text.trim(), outgoing: true, at },
                {
                  id: `${key}-reply`,
                  text: "Simulated reply: I’d love to hear more about that.",
                  outgoing: false,
                  at,
                  simulated: true,
                },
              ],
            },
          ],
    }));
  };
  const block = (id: string, reason?: string) =>
    update((v) => blockPerson(v, id, reason));
  const reset = () => update(() => initialState());
  const saveTrip = (trip: Trip) =>
    update((v) => ({
      ...v,
      trips: [...v.trips.filter((t) => t.id !== trip.id), trip],
    }));
  return (
    <Context.Provider
      value={{
        state,
        ready,
        error,
        update,
        complete,
        react,
        message,
        block,
        reset,
        saveTrip,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const store = useContext(Context);
  if (!store) throw Error("Missing StoreProvider");
  return store;
}

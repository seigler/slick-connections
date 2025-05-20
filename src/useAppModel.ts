import { makePersisted } from "@solid-primitives/storage";
import connections from "./assets/connections.json";
import { createStore } from "solid-js/store";
import { tauriStorage } from "@solid-primitives/storage/tauri";

type Solution = {
  id: number
  guesses: number
}

type AppStore = {
  solutions: Solution[]
};

export default function useAppModel() {
  const storage =
    "__TAURI_INTERNALS__" in window ? tauriStorage("AppStore") : localStorage;
  const [store, setStore] = makePersisted(
    createStore<AppStore>({
      solutions: []
    }),
    {
      name: "slick-connections",
      storage,
    }
  );
  function setSolution(id: number, guesses: number) {
    const nextSolutions = [
      ...(store.solutions ?? []),
    ];
    nextSolutions[id] = {
      id,
      guesses,
    }
    setStore({
      solutions: nextSolutions
    })
  }

  return {
    connections,
    store,
    setSolution,
  };
}

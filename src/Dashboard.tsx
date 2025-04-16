import { For } from "solid-js";
import useAppModel from "./useAppModel";
import { A } from "@solidjs/router";
import { css } from 'vite-plugin-inline-css-modules'

const styles = css`
  calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
  },
  entry: (solved: boolean) => {
    return {
      borderRadius: "50%",
      backgroundColor: solved ? "green" : "gray",
    }
  },
`

export default function Dashboard() {
  const { connections, store } = useAppModel();
  return (
    <div class={styles.calendar}>
      <For each={connections}>
        {(item) => {
          const isSolved = store.solutions[item.id] !== undefined;
          return (
            <A
              href={`/puzzle/${item.id}`}
              {...stylex.props(styles.entry(isSolved))}
            />
          );
        }}
      </For>
    </div>
  );
}

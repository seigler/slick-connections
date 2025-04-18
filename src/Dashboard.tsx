import { For, Show, createMemo } from "solid-js";
import useAppModel from "./useAppModel";
import { css } from 'vite-plugin-inline-css-modules'

const styles = css`
  .calendar {
    column-width: 7em;
    column-gap: 0.3em;
  }
  .entry {
    width: 0.8em;
    margin: 0.1em;
    display: inline-block;
    height: 0.8em;
    border-radius: 25%;
    background-color: gray;
  }
  .entryBlank {
    background: none;
  }
  .nextPuzzle {
    display: flex;
    justify-content: center;
    width: 100%;
    font-size: 3em;
    line-height: 1;
    padding: 1em;
    color: var(--color-foreground);
    background-color: var(--group-green);
    margin-bottom: 1em;
    &:hover, &:focus-visible, &:active {
      color: var(--color-foreground);
      outline: none;
      background-color: var(--group-yellow);
    }
  }
`

const colorStrings = [
  'var(--group-purple)',
  'var(--group-blue)',
  'var(--group-green)',
  'var(--group-yellow)',
]

export default function Dashboard() {
  const { connections, store } = useAppModel();
  const nextUnsolvedId = createMemo(() => {
    return connections.find(x => store.solutions[x.id] === undefined)?.id
  })
  return (
    <div>
      <Show when={nextUnsolvedId() !== undefined}>
        <a class={styles.nextPuzzle} href={`/puzzle/${nextUnsolvedId()}`}>Next puzzle: #{nextUnsolvedId()}</a>
      </Show>
      <div class={styles.calendar}>
        <div class={`${styles.entry} ${styles.entryBlank}`}></div>
        <For each={connections}>
          {(item) => {
            const isSolved = store.solutions[item.id] !== undefined;
            return (
              <a
                href={`/puzzle/${item.id}`}
                class={styles.entry}
                style={isSolved ? {
                  "background-color": colorStrings[store.solutions[item.id].guesses - 4] ?? 'var(--color-foreground)'
                } : {}}
                title={`#${item.id}, ${item.date}, ${store.solutions[item.id]?.guesses}`}
              />
            );
          }}
        </For>
      </div>
    </div>
  );
}

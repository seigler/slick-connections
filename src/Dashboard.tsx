import { For, Show, createMemo } from "solid-js";
import useAppModel from "./useAppModel";
import { css } from "vite-plugin-inline-css-modules";

const styles = css`
  .calendarWrapper {
    column-width: 14em;
  }
  .calendar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.25em;
  }
  .calendarHeader {
    flex-shrink: 1;
    width: 100%;
    border-bottom: 1px solid var(--color-foreground-trace);
  }
  .entry {
    break-before: avoid-column;
    break-inside: avoid-column;
    width: 2em;
    display: inline-block;
    height: 2em;
    border-radius: 10%;
    background-color: var(--color-foreground-faint);
    &:empty {
      background: none;
    }
  }
  .entryDate {
    color: var(--color-foreground);
    margin: 0.2em;
    font-size: 1.2em;
    font-weight: 300;
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
    &:hover,
    &:focus-visible,
    &:active {
      color: var(--color-foreground);
      outline: none;
      background-color: var(--group-yellow);
    }
  }
`;

const colorStrings = [
  "var(--group-purple)",
  "var(--group-blue)",
  "var(--group-green)",
  "var(--group-yellow)",
];

export default function Dashboard() {
  const { connections, store } = useAppModel();
  const nextUnsolvedId = createMemo(() => {
    return connections.find((x) => store.solutions[x.id] === undefined)?.id;
  });
  return (
    <div>
      <Show when={nextUnsolvedId() !== undefined}>
        <a class={styles.nextPuzzle} href={`/puzzle/${nextUnsolvedId()}`}>
          Next puzzle: #{nextUnsolvedId()}
        </a>
      </Show>
      <div class={styles.calendarWrapper}>
        <div class={styles.calendar}>
          <For each={connections}>
            {(item) => {
              const isSolved = store.solutions[item.id] !== undefined;
              const date = new Date(item.date);
              const showHeader = item.id === 1 || date.getDate() === 1;
              return (
                <>
                  {showHeader && (
                    <>
                      <div class={styles.calendarHeader}>
                        {date.toLocaleString("default", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <For each={Array.from({ length: date.getDay() })}>
                        {() => (
                          <div class={`${styles.entry} ${styles.entryBlank}`} />
                        )}
                      </For>
                    </>
                  )}
                  <a
                    href={`/puzzle/${item.id}`}
                    class={styles.entry}
                    style={
                      isSolved
                        ? {
                            "background-color":
                              colorStrings[
                                store.solutions[item.id].guesses - 4
                              ] ?? "var(--color-foreground)",
                          }
                        : {}
                    }
                    title={`#${item.id}, ${item.date}`}
                  >
                    <div class={styles.entryDate}>{date.getDate()}</div>
                  </a>
                </>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}

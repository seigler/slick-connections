import { For, createMemo, createSignal } from "solid-js";
import connections from "./assets/connections.json";
import "./App.css";
import { shuffleArray } from "./utils";
import { createStore } from "solid-js/store";

type Connection = (typeof connections)[number];
type Answer = Connection["answers"][number];

function fromIndex(index: number): [number, number] {
  const col = index % 4;
  const row = (index - col) / 4;
  return [row, col];
}

function App() {
  const [store, setStore] = createStore({
    puzzleIndex: 0,
    selected: [] as number[],
    solvedGroups: [] as Answer[],
    puzzle: shuffleArray(Array.from({ length: 16 }, (_, i) => i)),
    get answers() {
      return connections[store.puzzleIndex].answers;
    },
  });

  const getFromPuzzle = (index: number) => {
    const puzzleIndex = store.puzzle[index];
    const [groupIndex, memberIndex] = fromIndex(puzzleIndex);
    const group = store.answers[groupIndex];
    return {
      group: group.group,
      level: group.level,
      answer: store.answers[groupIndex].members[memberIndex],
    };
  };
  const handleGuess = () => {
    const selectedAnswers = store.selected.map((x) => getFromPuzzle(x));
    const { level } = selectedAnswers[0];
    const isCorrect = selectedAnswers.every((x) => x.level === level);
    if (!isCorrect) {
      // TODO you got it wrong
      alert("wrong");
      return;
    }
    setStore({
      puzzle: store.puzzle.filter((x) => store.selected.every((s) => store.puzzle[s] !== x)),
      selected: [],
    })
    const newSolvedGroup = store.answers.find((x) => x.level === level);
    if (newSolvedGroup != null) {
      setStore({
        solvedGroups: [...store.solvedGroups, newSolvedGroup]
      })
    }
  };
  // const handlePinUnpin = () => {
  //   const sel = store.selected
  //   if (sel.every(x => x <= pinnedCount())) {
  //     // we are unpinning
  //     return
  //   }
  //   // we are pinning
  // }

  return (
    <main class="container">
      <h1>Slick Connections</h1>
      <div class="puzzle">
        <For each={store.solvedGroups}>
          {({ group, level, members }) => (
            <div class="puzzle-row">
              <div class="puzzle-group" data-level={level}>
                <div class="puzzle-group-name">{group}</div>
                <div class="puzzle-group-members">{members.join(", ")}</div>
              </div>
            </div>
          )}
        </For>
        <For each={[0, 1, 2, 3].slice(0, store.puzzle.length / 4)}>
          {(row) => (
            <div class="puzzle-row">
              {[0, 1, 2, 3].map((col) => {
                const index = 4 * row + col;
                return (
                  <button
                    classList={{
                      "puzzle-item": true,
                      "is-selected": store.selected.includes(index),
                    }}
                    type="button"
                    on:click={() => {
                      setStore({
                        selected: store.selected.includes(index)
                          ? store.selected.filter((x) => x !== index)
                          : [...store.selected, index],
                      });
                    }}
                  >
                    {getFromPuzzle(index).answer}
                  </button>
                );
              })}
            </div>
          )}
        </For>
        <div class="puzzle-actions">
          <button type="button" disabled={store.selected.length === 0}>
            Pin
          </button>
          <button
            id="submitButton"
            type="button"
            on:click={handleGuess}
            disabled={store.selected.length !== 4}
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;

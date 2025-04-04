import { For, createMemo, createSignal } from "solid-js";
import connections from "./assets/connections.json";
import "./App.css";
import { shuffleArray } from "./utils";

type Connection = typeof connections[number]
type Answer = Connection["answers"][number]

function fromIndex(index: number): [number, number] {
  const col = index % 4;
  const row = (index - col) / 4;
  return [row, col];
}

function App() {
  const [puzzleIndex, setPuzzleIndex] = createSignal(0);
  // const [pinnedCount, setPinnedCount] = createSignal(0);
  const [selected, setSelected] = createSignal<number[]>([]);
  const [solvedGroups, setSolvedGroups] = createSignal<Answer[]>([])
  const [puzzle, setPuzzle] = createSignal(
    shuffleArray(
      Array(16)
        .fill(0)
        .map((_, i) => i)
    )
  );

  const answers = () => connections[puzzleIndex()].answers;
  const getFromPuzzle = (index: number) => {
    const puzzleIndex = puzzle()[index];
    const [groupIndex, memberIndex] = fromIndex(puzzleIndex);
    const group = answers()[groupIndex];
    return {
      group: group.group,
      level: group.level,
      answer: answers()[groupIndex].members[memberIndex],
    };
  };
  const handleGuess = () => {
    const selectedAnswers = selected().map((x) => getFromPuzzle(x));
    const { level } = selectedAnswers[0];
    const isCorrect = selectedAnswers.every(
      x => x.level === level
    );
    if (!isCorrect) {
      // TODO you got it wrong
      alert("wrong");
      return;
    }
    setPuzzle(puzzle().filter((x) => selected().every(s => puzzle()[s] !== x)));
    setSelected([]);
    const newSolvedGroup = answers().find((x) => x.level === level);
    if (newSolvedGroup != null) {
      setSolvedGroups([...solvedGroups(), newSolvedGroup])
    }
  };
  // const handlePinUnpin = () => {
  //   const sel = selected()
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
        <For each={solvedGroups()}>
          {({group, level, members}) => (
            <div class="puzzle-row">
              <div class="puzzle-group" data-level={level}>
                <strong>{group}</strong>
                <div>{members.join(', ')}</div>
              </div>
            </div>
          )}
        </For>
        <For each={[0, 1, 2, 3].slice(0, puzzle().length / 4)}>
          {(row) => (
            <div class="puzzle-row">
              {[0, 1, 2, 3].map((col) => {
                const index = 4 * row + col;
                return (
                  <button
                    classList={{
                      "puzzle-item": true,
                      "is-selected": selected().includes(index),
                    }}
                    type="button"
                    on:click={() => {
                      setSelected(
                        selected().includes(index)
                          ? selected().filter((x) => x !== index)
                          : [...selected(), index]
                      );
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
          <button type="button" disabled={selected().length === 0}>
            Pin
          </button>
          <button
            id="submitButton"
            type="button"
            on:click={handleGuess}
            disabled={selected().length !== 4}
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;

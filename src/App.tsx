import { For, createMemo, createSignal } from "solid-js";
import connections from "./assets/connections.json";
import "./App.css";
import { shuffleArray } from "./utils";

function fromIndex(index: number): [number, number] {
  const col = index % 4;
  const row = (index - col) / 4;
  return [row, col];
}

function App() {
  const [puzzleIndex, setPuzzleIndex] = createSignal(0);
  const [selected, setSelected] = createSignal<number[]>([]);
  const puzzle = createMemo(() =>
    shuffleArray(
      Array(16)
        .fill(0)
        .map((_, i) => i)
    )
  );
  const answers = () => connections[puzzleIndex()].answers;

  return (
    <main class="container">
      <h1>Slick Connections</h1>
      <div class="puzzle">
        <For each={[0, 1, 2, 3]}>
          {(row) => (
            <div class="puzzle-row">
              <For each={[0, 1, 2, 3]}>
                {(col) => {
                  const index = 4 * row + col;
                  const puzzleIndex = puzzle()[index];
                  const [groupIndex, memberIndex] = fromIndex(puzzleIndex);
                  const answer = answers()[groupIndex].members[memberIndex];
                  return (
                    <div
                      classList={{
                        "puzzle-item": true,
                        "is-selected": selected().includes(index),
                      }}
                      tabindex="0"
                      on:click={() => {
                        setSelected(
                          selected().includes(index)
                          ? selected().filter(x => x !== index)
                          : [...selected(), index]
                        );
                      }}
                    >
                      {answer}
                    </div>
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
    </main>
  );
}

export default App;

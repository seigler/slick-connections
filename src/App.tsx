import { For } from "solid-js";
import "./App.css";
import useAppModel from "./useAppModel";
import FitText from "./FitText";

// TODO
// add routing
// make overview page with calendar list of puzzles
// show solved / aced / busted
// make detail page with puzzle id in path
// add nav links

function App() {
  const {
    connections,
    store,
    setStore,
    handleGuess,
    handlePinUnpin,
    handleSelectGame,
    handleShuffle,
    handleDeselect,
    getFromPuzzle,
  } = useAppModel();

  return (
    <main class="container">
      <div class="puzzle">
        <header class="puzzle-header">
          <h1>Slick Connections</h1>
          <div class="puzzle-header-actions">
            <button
              type="button"
              on:click={() => {
                handleSelectGame(store.puzzleId - 1);
              }}
              disabled={store.puzzleId === 1}
            >
              -
            </button>
            <select
              name="puzzleNumber"
              id="puzzleNumber"
              on:input={({ target: { value } }) =>
                handleSelectGame(parseInt(value, 10))
              }
              value={store.puzzleId}
            >
              <For each={connections}>
                {({ id }) => <option value={id}>{id}</option>}
              </For>
            </select>
            <button
              type="button"
              on:click={() => {
                handleSelectGame(store.puzzleId + 1);
              }}
              disabled={
                store.puzzleId === connections[connections.length - 1].id
              }
            >
              +
            </button>
          </div>
        </header>
        <div>Create four groups of four words!</div>
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
                const answer = () => getFromPuzzle(index).answer;
                return (
                  <button
                    classList={{
                      "puzzle-item": true,
                      "is-selected": store.selected.includes(index),
                    }}
                    style={{ "view-transition-name": `puzzle-${answer}` }}
                    type="button"
                    on:click={() => {
                      setStore({
                        selected: store.selected.includes(index)
                          ? store.selected.filter((x) => x !== index)
                          : [...store.selected, index],
                      });
                    }}
                  >
                    <FitText body={answer} />
                    {store.pinnedCount > index && <div class="badge">🔒</div>}
                  </button>
                );
              })}
            </div>
          )}
        </For>
        <div class="puzzle-actions">
          <button
            type="button"
            disabled={store.selected.length === 0}
            on:click={handlePinUnpin}
          >
            {store.selected.length > 0 &&
            store.selected.every((x) => x < store.pinnedCount)
              ? "Unpin"
              : "Pin"}
          </button>
          <button type="button" on:click={handleShuffle}>
            Shuffle
          </button>
          <button type="button" on:click={handleDeselect} disabled={
            store.selected.length === 0
          }>
            Deselect all
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
      { store.solvedGroups.length === 4 && <div class="celebration" /> }
    </main>
  );
}

export default App;

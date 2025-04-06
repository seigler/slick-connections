import connections from "./assets/connections.json";
import { shuffleArray } from "./utils";
import { createStore } from "solid-js/store";

type Connection = (typeof connections)[number];
type Answer = Connection["answers"][number];

function fromIndex(index: number): [number, number] {
  const col = index % 4;
  const row = (index - col) / 4;
  return [row, col];
}

export default function useAppModel() {
  const [store, setStore] = createStore({
    puzzleId: 1,
    pinnedCount: 0,
    selected: [] as number[],
    solvedGroups: [] as Answer[],
    puzzle: shuffleArray(Array.from({ length: 16 }, (_, i) => i)),
    get answers() {
      return connections.find((x) => x.id === store.puzzleId)!.answers;
    },
  });

  const handleSelectGame = (newId: number) => {
    setStore({
      puzzleId: newId,
      selected: [],
      pinnedCount: 0,
      puzzle: shuffleArray(Array.from({ length: 16 }, (_, i) => i)),
      solvedGroups: [],
    });
  };

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
    const selectedPinnedCount = store.selected.reduce(
      (acc, cur) => acc + (cur < store.pinnedCount ? 1 : 0),
      0
    );
    setStore({
      pinnedCount: store.pinnedCount - selectedPinnedCount,
      puzzle: store.puzzle.filter((x) =>
        store.selected.every((s) => store.puzzle[s] !== x)
      ),
      selected: [],
    });
    const newSolvedGroup = store.answers.find((x) => x.level === level);
    if (newSolvedGroup != null) {
      setStore({
        solvedGroups: [...store.solvedGroups, newSolvedGroup],
      });
    }
    if (store.puzzle.length === 0) {
      // completely solved!
    }
  };

  const handleShuffle = () => {
    const pinned = store.puzzle.slice(0, store.pinnedCount);
    const toShuffle = store.puzzle.slice(store.pinnedCount);
    setStore({
      puzzle: [...pinned, ...shuffleArray(toShuffle)],
    });
  };

  const handlePinUnpin = () => {
    if (store.selected.every((x) => x < store.pinnedCount)) {
      // we are unpinning
      const puzzleStart = Array.from({ length: store.pinnedCount }, (_, i) => i)
        .filter((x) => !store.selected.includes(x))
        .map((x) => store.puzzle[x]);
      const puzzleMiddle = store.selected.map((x) => store.puzzle[x]);
      const puzzleEnd = store.puzzle.slice(store.pinnedCount);
      const newPuzzle = [...puzzleStart, ...puzzleMiddle, ...puzzleEnd];
      setStore({
        pinnedCount: store.pinnedCount - store.selected.length,
        selected: [],
        puzzle: newPuzzle,
      });
      return;
    }
    // we are pinning
    const puzzleStart = store.puzzle.slice(0, store.pinnedCount);
    const puzzleMid = store.selected
      .filter((x) => x >= store.pinnedCount)
      .map((x) => store.puzzle[x]);
    const puzzleEnd = Array.from(
      { length: 16 - store.pinnedCount },
      (_, i) => i + store.pinnedCount
    )
      .filter((x) => !store.selected.includes(x))
      .map((x) => store.puzzle[x]);
    setStore({
      pinnedCount: puzzleStart.length + puzzleMid.length,
      selected: [],
      puzzle: [...puzzleStart, ...puzzleMid, ...puzzleEnd],
    });
  };

  return {
    connections,
    store,
    setStore,
    handleGuess,
    handlePinUnpin,
    handleSelectGame,
    handleShuffle,
    getFromPuzzle,
  };
}

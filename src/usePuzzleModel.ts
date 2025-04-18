import { Accessor, createEffect } from "solid-js";
import connections from "./assets/connections.json";
import { shuffleArray } from "./utils";
import { createStore } from "solid-js/store";
import useAppModel from "./useAppModel";

type Connection = (typeof connections)[number];
type Answer = Connection["answers"][number];

function fromIndex(index: number): [number, number] {
  const col = index % 4;
  const row = (index - col) / 4;
  return [row, col];
}

type PuzzleStore = {
  guesses: number;
  pinnedCount: number;
  selected: number[];
  solvedGroups: Answer[];
  puzzle: number[];
};

export default function usePuzzleModel(id: Accessor<number>) {
  const [store, setStore] = createStore<PuzzleStore>({
    guesses: 0,
    pinnedCount: 0,
    selected: [],
    solvedGroups: [],
    puzzle: [],
  });

  const {
    setSolution
  } = useAppModel()

  createEffect(() => {
    id()
    setStore({
      guesses: 0,
      pinnedCount: 0,
      selected: [],
      solvedGroups: [],
      puzzle: shuffleArray(Array.from({ length: 16 }, (_, i) => i)),
    });
  })

  const answers = (): Answer[] => {
    return connections.find((x) => x.id === id())!.answers;
  };

  const getFromPuzzle = (index: number) => {
    const puzzleIndex = store.puzzle[index];
    const [groupIndex, memberIndex] = fromIndex(puzzleIndex);
    const group = answers()[groupIndex];
    return {
      group: group.group,
      level: group.level,
      answer: answers()[groupIndex].members[memberIndex],
    };
  };

  const handleGuess = () => {
    setStore('guesses', x => x+1)
    const selected = store.puzzle.length === 4 ? [0, 1, 2, 3] : store.selected;
    const selectedAnswers = selected.map((x) => getFromPuzzle(x));
    const { level } = selectedAnswers[0];
    const isCorrect = selectedAnswers.every((x) => x.level === level);
    if (!isCorrect) {
      // TODO you got it wrong
      alert("wrong");
      return;
    }
    const selectedPinnedCount = selected.reduce(
      (acc, cur) => acc + (cur < store.pinnedCount ? 1 : 0),
      0
    );
    setStore({
      pinnedCount: store.pinnedCount - selectedPinnedCount,
      puzzle: store.puzzle.filter((x) =>
        selected.every((s) => store.puzzle[s] !== x)
      ),
      selected: [],
    });
    const newSolvedGroup = answers().find((x) => x.level === level);
    if (newSolvedGroup != null) {
      setStore('solvedGroups', x => x.concat(newSolvedGroup))
    }
    if (store.puzzle.length === 0) {
      // completely solved!
      setSolution(id(), store.guesses)
    }
  };

  const handleShuffle = () => {
    const pinned = store.puzzle.slice(0, store.pinnedCount);
    const toShuffle = store.puzzle.slice(store.pinnedCount);
    setStore({
      puzzle: [...pinned, ...shuffleArray(toShuffle)],
    });
  };

  const handleDeselect = () => {
    setStore({
      selected: [],
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
      { length: store.puzzle.length - store.pinnedCount },
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
    handleShuffle,
    handleDeselect,
    getFromPuzzle,
  };
}

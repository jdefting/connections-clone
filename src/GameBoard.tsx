import type { ConnectionsData } from "./data.ts";
import { useState } from "react";

const colors = [
  "bg-yellow-300",
  "bg-green-400",
  "bg-blue-300",
  "bg-purple-400",
];

export function GameBoard({ connections }: { connections: ConnectionsData }) {
  const categories = connections;
  const colorByCategory = Object.fromEntries(
    categories.map((category, i) => [category.title, colors[i]]),
  );

  const [selectedCards, setSelectedCards] = useState(new Set<string>());
  const maxSelected = selectedCards.size === 4;
  const [correctCategories, setCorrectCategories] = useState<typeof categories>(
    [],
  );

  const [mistakes, setMistakes] = useState(0);
  const maxMistakes = 4;

  const [cards, setCards] = useState(() => {
    return shuffle(categories.flatMap((category) => category.cards));
  });

  const lostGame = mistakes === maxMistakes;
  const wonGame =
    categories.filter(
      (category) => !correctCategories.some((cat) => cat === category),
    ).length === 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <h3>Create four groups of four!</h3>
      <div className="grid grid-cols-4 gap-2 w-[600px]">
        {correctCategories.map((category) => (
          <div
            key={category.title}
            className={`col-span-4 flex items-center flex-col rounded ${colorByCategory[category.title]} px-4 py-2`}
          >
            <b>{category.title}</b>
            <div>{category.cards.map((card) => card).join(", ")}</div>
          </div>
        ))}
        {cards.map((card) => {
          const isSelected = selectedCards.has(card);
          return (
            <button
              type="button"
              disabled={maxSelected && !isSelected}
              className={`p-4 rounded ${isSelected ? "bg-gray-800 text-white" : "bg-gray-200"}`}
              key={card}
              onClick={() => {
                const newSelectedCards = new Set(selectedCards);
                if (isSelected) {
                  newSelectedCards.delete(card);
                } else {
                  newSelectedCards.add(card);
                }
                setSelectedCards(newSelectedCards);
              }}
            >
              {card}
            </button>
          );
        })}
      </div>
      {lostGame && (
        <div>
          <div>Game Over :(</div>
        </div>
      )}
      {wonGame && "You have won!"}
      {!lostGame && !wonGame && (
        <>
          <div>Mistakes remaining: {maxMistakes - mistakes}</div>
          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-full p-2 w-32 border border-gray-900"
              onClick={() => {
                setCards(shuffle(cards));
              }}
            >
              Shuffle
            </button>
            <button
              type="button"
              disabled={selectedCards.size === 0}
              className={`rounded-full p-2 w-32 border ${selectedCards.size > 0 ? "border-gray-900" : "border-gray-900 opacity-60"}`}
              onClick={() => {
                setSelectedCards(new Set());
              }}
            >
              Deselect All
            </button>
            <button
              type="button"
              className={`rounded-full p-2 w-32 border ${maxSelected ? "border-gray-900" : "border-gray-900 opacity-60"}`}
              disabled={!maxSelected}
              onClick={() => {
                const correctCategory = categories.find((category) =>
                  category.cards.every((card) => selectedCards.has(card)),
                );
                if (correctCategory) {
                  setCorrectCategories([...correctCategories, correctCategory]);
                  setCards((cards) =>
                    cards.filter((card) => !selectedCards.has(card)),
                  );
                  setSelectedCards(new Set());
                } else {
                  setMistakes(mistakes + 1);
                  alert("Incorrect guess, please try again.");
                }
              }}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function shuffle(cards: string[]) {
  return [...cards].sort(() => Math.random() - 0.5);
}

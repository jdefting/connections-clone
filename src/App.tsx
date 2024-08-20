import { useMemo, useState } from "react";
import { type ConnectionsData, connections } from "./data.ts";

function App() {
	const [gameStarted, setGameStarted] = useState(false);

	return (
		<div className="h-screen w-screen flex items-center justify-center">
			{gameStarted && connections ? (
				<GameBoard connections={connections} />
			) : (
				<div className="flex flex-col gap-2 items-center">
					<h1 className="text-4xl">Connections</h1>
					<h3>Group words that share a common thread.</h3>
					<button
						type="button"
						className="bg-black text-white rounded-full p-2 w-32"
						disabled={!connections}
						onClick={() => {
							setGameStarted(true);
						}}
					>
						Play
					</button>
				</div>
			)}
		</div>
	);
}

const colors = [
	"bg-yellow-300",
	"bg-green-400",
	"bg-blue-300",
	"bg-purple-400",
];

function GameBoard({ connections }: { connections: ConnectionsData }) {
	const categories = connections.categories;
	const colorByCategory = Object.fromEntries(
		categories.map((category, i) => [category.title, colors[i]]),
	);

	const [selectedCards, setSelectedCards] = useState(new Set<string>());
	const maxSelected = selectedCards.size === 4;
	const [correctCategories, setCorrectCategories] = useState<typeof categories>(
		[],
	);

	// todo: randomize the cards
	const availableCategories = categories.filter(
		(category) => !correctCategories.some((cat) => cat === category),
	);
	const [mistakes, setMistakes] = useState(0);
	const maxMistakes = 4;

	const flatCards = availableCategories.flatMap((category) => category.cards);
	const positions = useMemo(
		() =>
			Array.from({ length: flatCards.length }, (_, i) => i).sort(
				() => Math.random() - 0.5,
			),
		[flatCards.length],
	);
	const shuffledCards = positions.map((i) => flatCards[i]);

	const lostGame = mistakes === maxMistakes;
	const wonGame = correctCategories.length === 4;

	return (
		<div className="flex flex-col items-center gap-4">
			<h3>Create four groups four!</h3>
			<div className="grid grid-cols-4 gap-2 w-[600px]">
				{correctCategories.map((category) => (
					<div
						key={category.title}
						className={`col-span-4 flex items-center flex-col rounded ${colorByCategory[category.title]} p-4`}
					>
						<b>{category.title}</b>
						<div>{category.cards.map((card) => card.content).join(", ")}</div>
					</div>
				))}
				{shuffledCards.map((card) => {
					const isSelected = selectedCards.has(card.content);
					return (
						<button
							type="button"
							disabled={maxSelected && !isSelected}
							className={`p-4 rounded ${isSelected ? "bg-gray-800 text-white" : "bg-gray-200"}`}
							key={card.content}
							onClick={() => {
								const newSelectedCards = new Set(selectedCards);
								if (isSelected) {
									newSelectedCards.delete(card.content);
								} else {
									newSelectedCards.add(card.content);
								}
								setSelectedCards(newSelectedCards);
							}}
						>
							{card.content}
						</button>
					);
				})}
			</div>
			{lostGame && (
				<div>
					<div>Game Over :(</div>
					<button type="button" onClick={() => {}}>
						See results
					</button>
				</div>
			)}
			{wonGame && "You have won!"}
			{!lostGame && !wonGame && (
				<>
					<div>Mistakes remaining: {maxMistakes - mistakes}</div>
					<div className="flex gap-3">
						<button
							type="button"
							disabled={selectedCards.size === 0}
							className={`rounded-full p-2 w-32 ${selectedCards.size > 0 ? "bg-gray-900 text-white" : "ring-1 ring-gray-900"}`}
							onClick={() => {
								setSelectedCards(new Set());
							}}
						>
							Deselect All
						</button>
						<button
							type="button"
							className={` rounded-full p-2 w-32 ${maxSelected ? "bg-gray-900 text-white" : "ring-1 ring-gray-900"}`}
							disabled={!maxSelected}
							onClick={() => {
								const correctCategory = categories.find((category) =>
									category.cards.every((card) =>
										selectedCards.has(card.content),
									),
								);
								if (correctCategory) {
									setCorrectCategories([...correctCategories, correctCategory]);
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

// function useConnectionsData() {
// 	const [data, setData] = useState<ConnectionsData>();
//
// 	useEffect(() => {
// 		fetch("https://www.nytimes.com/svc/connections/v2/2024-08-17.json")
// 			.then((response) => response.json())
// 			.then(setData);
// 	}, []);
//
// 	return data;
// }

export default App;

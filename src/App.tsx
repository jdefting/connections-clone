import { useState } from "react";
import { connections } from "./data.ts";
import { GameBoard } from "./GameBoard.tsx";

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

export default App;

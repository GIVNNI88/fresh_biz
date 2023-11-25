import React, { useState } from "react";
import PlayerForm from "./components/PlayerForm";
import Board from "./components/Board";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);

  const [initialPlayerOrder, setInitialPlayerOrder] = useState([]); // Initialize initialPlayerOrder state

  const handleStartGame = (playersData, initialOrder) => {
    setGameStarted(true);
    setPlayers(playersData);
    setInitialPlayerOrder(initialOrder); // Set the initial player order
  };

  return (
    <div className="App" >
      {!gameStarted ? (
        <PlayerForm onStartGame={handleStartGame} />
      ) : (
        <Board players={players} initialPlayerOrder={initialPlayerOrder}  />
      )}
    </div>
  );
}

export default App;

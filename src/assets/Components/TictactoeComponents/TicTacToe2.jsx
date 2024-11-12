import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "./styles.css";
//useState manages the state's variable, useEffect is used for side effects(l. storage)
//squares- 9 cells, setSquares(function)-update square state(null/from local storage)
const TicTacToe2 = () => {
  const [squares, setSquares] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).squares : Array(9).fill(null);
  });

  //by default it is X's turn, checks X's turn, isXTurn(boolean)
  //setIsTurn(function)-checks if its X's turn or not
  const [isXTurn, setIsXTurn] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).isXTurn : true;
  });

  // winner can be either x,o or null
  const [winner, setWinner] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).winner : null;
  });

//showConfetti is a boolean, setShowConfetti(function)-updates when player wins
  const [showConfetti, setShowConfetti] = useState(false);


  //winningLine is boolean, stores indices of the squares that form the winning combination, default-empty array
  //setWinningLine(function)-updates the state
  const [winningLine, setWinningLine] = useState(() => {
    const saved = localStorage.getItem("gameState");
    return saved ? JSON.parse(saved).winningLine : [];
  });

  //playerOneWins, playerTwoWins(boolean)-Track the number of wins for Player 1(X) and Player 2(O)respectively. 
  //These are initialized from localStorage, or set to 0 if not found.
  const [playerOneWins, setPlayerOneWins] = useState(() => {
    return parseInt(localStorage.getItem("playerOneWins") || "0");
  });

  const [playerTwoWins, setPlayerTwoWins] = useState(() => {
    return parseInt(localStorage.getItem("playerTwoWins") || "0");
  });

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  //whenever there is a change(in square/isXturn/winner/winningLine), the useEffect is triggered, and it stores the changes in the local storage.
  useEffect(() => {
    localStorage.setItem(
      "gameState",
      JSON.stringify({
        squares,
        isXTurn,
        winner,
        winningLine,
      })
    );
  }, [squares, isXTurn, winner, winningLine]);//dependency array

  //useUpdates here updates the win counts of X and O
  useEffect(() => {
    localStorage.setItem("playerOneWins", playerOneWins.toString());
  }, [playerOneWins]);

  useEffect(() => {
    localStorage.setItem("playerTwoWins", playerTwoWins.toString());
  }, [playerTwoWins]);

  //Hnadleclick is called when player clicks on a square.
  //if the square is already filled/ winner is declared, no changes
  const handleClick = (index) => {
    if (squares[index] || winner) return;

//if new square is clicked, cheks who's turn it is x/o, sets the updated squares state, changes the X state, and checks if there's any winner.
    const newSquares = squares.slice();
    newSquares[index] = isXTurn ? "X" : "O";
    setSquares(newSquares);
    setIsXTurn(!isXTurn);

    checkWinner(newSquares);
  };

  //checks if winning combo matches the current board(board array)
  // if theres a winner: sets winner state(x/o), marks winningLine(),confetti, increases win count(x/o).
  const checkWinner = (board) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningLine(combo);
        setShowConfetti(true);
        if (board[a] === "X") {
          setPlayerOneWins((prev) => prev + 1);
        } else {
          setPlayerTwoWins((prev) => prev + 1);
        }
        setTimeout(() => setShowConfetti(false), 6000);
        return;
      }
    }

    //if every square is filled but no winner-draw
    if (board.every((cell) => cell)) {
      setWinner("Draw");
    }
  };

//Resets the game state to its initial values, clearing the board and setting the turn back to Player 1 (X).
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setShowConfetti(false);
    setWinningLine([]);
  };
  //resetAllStats: Resets both the game state and the win counts for both players.clears all data from localStorage.
  const resetAllStats = () => {
    resetGame();
    setPlayerOneWins(0);
    setPlayerTwoWins(0);
    localStorage.clear();
  };

  return (
    <div className="game-container">
      {showConfetti && <Confetti />}

      <h1 className="game-title">TIC TAC TOE</h1>

      <div className="game-layout">
        <div className="card">
          <div className={`player-info ${isXTurn && !winner ? "active" : ""}`}>
            <div className="player-label">Player 1 (X)</div>
            <div className="player-symbol">X</div>
            <div className="win-count">Wins: {playerOneWins}</div>
          </div>
        </div>

        <div className="game-board-container">
          <div className="game-board">
            {squares.map((square, index) => (
              <button
                key={index}
                className={`board-cell ${
                  winningLine.includes(index) ? "winning" : ""
                } 
                  ${square ? "filled" : ""}`}
                onClick={() => handleClick(index)}
              >
                {square}
              </button>
            ))}
          </div>

          <div className="game-status">
            <div className="status-message">
              {winner
                ? winner === "Draw"
                  ? "Game is a Draw!"
                  : `${winner} Wins!`
                : `Current Turn: ${isXTurn ? "Player 1 (X)" : "Player 2 (O)"}`}
            </div>
            <div className="button-container">
              {winner && (
                <button className="play-again-button" onClick={resetGame}>
                  Play Again
                </button>
              )}
              <button className="reset-button" onClick={resetAllStats}>
                Reset All
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className={`player-info ${!isXTurn && !winner ? "active" : ""}`}>
            <div className="player-label">Player 2 (O)</div>
            <div className="player-symbol">O</div>
            <div className="win-count">Wins: {playerTwoWins}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe2;
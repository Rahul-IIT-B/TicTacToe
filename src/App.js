import { useState, useEffect } from 'react';
import './styles.css';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onPlay, xIsNext }) {
  const clickSound = document.getElementById("click-sound");

  function handleClick(i) {
    // if (squares[i] || calculateWinner(squares)) {
    //   return;
    // }
    // clickSound.play(); // Play sound on click

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const winSound = document.getElementById("win-sound");

  let status;
  if (winner) {
    // winSound.play(); // Play sound on win
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [theme, setTheme] = useState('light');
  const [singlePlayer, setSinglePlayer] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function aiMove(squares) {
    // Ensure squares is a valid array before modifying
    if (!squares || squares.length !== 9) return squares;
    
    const availableMoves = squares
      .map((square, index) => (square === null ? index : null))
      .filter(index => index !== null);
  
    if (availableMoves.length === 0) return squares;  // No moves available
  
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    squares[randomMove] = 'O';
    return squares;
  }
  

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (!xIsNext) {
        setTimeLeft(10); // Reset timer for AI
        handlePlay(aiMove(currentSquares));
      } else {
        setTimeLeft(10); // Auto-switch player on timeout
        setCurrentMove(currentMove + 1);
      }
    }
  }, [timeLeft, xIsNext, currentSquares]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setTimeLeft(10);

    if (calculateWinner(nextSquares)) {
      if (xIsNext) setXWins(xWins + 1);
      else setOWins(oWins + 1);
    }
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setTimeLeft(10);
  }

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.body.className = theme;
  }

  function toggleMode() {
    setSinglePlayer(!singlePlayer);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Move #' + move;
    } else {
      description = 'Start';
    }
    return (
      <tr key={move}>
        <td>{move}</td>
        <td><button onClick={() => jumpTo(move)}>{description}</button></td>
      </tr>
    );
  });

  return (
    <div className={`game ${theme}`}>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <table>
          <thead>
            <tr>
              <th>Move #</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>{moves}</tbody>
        </table>
        <p>Timer: {timeLeft}s</p>
        <p>X Wins: {xWins}, O Wins: {oWins}</p>
      </div>
      <button onClick={resetGame}>Reset Game</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={toggleMode}>
        {singlePlayer ? 'Switch to Double Player' : 'Switch to Single Player'}
      </button>
    </div>
  );
}

export default Game;

function calculateWinner(squares) {
  // Guard clause to ensure squares is defined and has the correct length
  if (!squares || squares.length !== 9) {
    return null;
  }

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


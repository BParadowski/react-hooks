// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, selectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [squares, setSquares] = useLocalStorageState(
    'gameBoard',
    Array(9).fill(null),
  )
  const nextValue = React.useMemo(() => calculateNextValue(squares), [squares])
  const winner = React.useMemo(() => calculateWinner(squares), [squares])
  const status = React.useMemo(
    () => calculateStatus(winner, squares, nextValue),
    [squares, winner, nextValue],
  )
  const [history, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ])
  const selectedStep = history.findIndex(
    historySquares =>
      JSON.stringify(squares) === JSON.stringify(historySquares),
  )

  function selectSquare(square) {
    if (squares[square] || winner) return

    const newSquares = [...squares]
    newSquares[square] = nextValue

    setSquares(newSquares)
    setHistory(oldHistory => {
      return oldHistory.toSpliced(selectedStep + 1, Infinity, newSquares)
    })
  }

  function selectGameStep(stepNumber) {
    setSquares(history[stepNumber])
  }

  function restart() {
    setSquares(Array(9).fill(null))
    setHistory([Array(9).fill(null)])
  }

  const moves = history.map((board, i) => {
    return (
      <li key={i}>
        <button
          onClick={() => selectGameStep(i)}
          className={selectedStep === i ? 'grayed-out' : ''}
        >
          <span>{i === 0 ? 'Start of the game' : `Go to move #${i}`}</span>
          {selectedStep === i && <span>{' (current)'}</span>}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board selectSquare={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div>
        <p>{status}</p>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App

"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L"

interface Tetromino {
  type: TetrominoType
  shape: number[][]
  x: number
  y: number
}

const TETROMINOES: Record<TetrominoType, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
}

const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: "bg-cyan-500", // Cyan
  O: "bg-yellow-500", // Yellow
  T: "bg-purple-500", // Purple
  S: "bg-green-500", // Green
  Z: "bg-red-500", // Red
  J: "bg-blue-500", // Blue
  L: "bg-orange-500", // Orange
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

export function TetrisGame() {
  const [board, setBoard] = useState<number[][]>(() =>
    Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(0)),
  )
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const createRandomPiece = useCallback((): Tetromino => {
    const types: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"]
    const type = types[Math.floor(Math.random() * types.length)]
    return {
      type,
      shape: TETROMINOES[type],
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINOES[type][0].length / 2),
      y: 0,
    }
  }, [])

  const isValidPosition = useCallback(
    (piece: Tetromino, newX: number, newY: number, newShape?: number[][]): boolean => {
      const shape = newShape || piece.shape

      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardX = newX + x
            const boardY = newY + y

            if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
              return false
            }

            if (boardY >= 0 && board[boardY][boardX]) {
              return false
            }
          }
        }
      }
      return true
    },
    [board],
  )

  const placePiece = useCallback(
    (piece: Tetromino) => {
      const newBoard = board.map((row) => [...row])

      piece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = piece.y + y
            const boardX = piece.x + x
            if (boardY >= 0) {
              newBoard[boardY][boardX] = piece.type
            }
          }
        })
      })

      setBoard(newBoard)
    },
    [board],
  )

  const clearLines = useCallback(() => {
    const newBoard = board.filter((row) => row.some((cell) => cell === 0))
    const clearedLines = BOARD_HEIGHT - newBoard.length

    if (clearedLines > 0) {
      const emptyRows = Array(clearedLines)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(0))
      setBoard([...emptyRows, ...newBoard])
      setLines((prev) => prev + clearedLines)
      setScore((prev) => prev + clearedLines * 100 * level)
      setLevel(Math.floor((lines + clearedLines) / 10) + 1)
    }
  }, [board, level, lines])

  const rotatePiece = useCallback((piece: Tetromino): number[][] => {
    const rotated = piece.shape[0].map((_, index) => piece.shape.map((row) => row[index]).reverse())
    return rotated
  }, [])

  const movePiece = useCallback(
    (dx: number, dy: number) => {
      if (!currentPiece || gameOver) return

      const newX = currentPiece.x + dx
      const newY = currentPiece.y + dy

      if (isValidPosition(currentPiece, newX, newY)) {
        setCurrentPiece({ ...currentPiece, x: newX, y: newY })
      } else if (dy > 0) {
        // Piece hit bottom or another piece
        placePiece(currentPiece)
        clearLines()

        const newPiece = createRandomPiece()
        if (!isValidPosition(newPiece, newPiece.x, newPiece.y)) {
          setGameOver(true)
          setIsPlaying(false)
        } else {
          setCurrentPiece(newPiece)
        }
      }
    },
    [currentPiece, gameOver, isValidPosition, placePiece, clearLines, createRandomPiece],
  )

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || gameOver) return

    const rotatedShape = rotatePiece(currentPiece)
    if (isValidPosition(currentPiece, currentPiece.x, currentPiece.y, rotatedShape)) {
      setCurrentPiece({ ...currentPiece, shape: rotatedShape })
    }
  }, [currentPiece, gameOver, rotatePiece, isValidPosition])

  const startGame = () => {
    setBoard(
      Array(BOARD_HEIGHT)
        .fill(null)
        .map(() => Array(BOARD_WIDTH).fill(0)),
    )
    setCurrentPiece(createRandomPiece())
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setIsPlaying(true)
  }

  const pauseGame = () => {
    setIsPlaying(!isPlaying)
  }

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return

    const interval = setInterval(
      () => {
        movePiece(0, 1)
      },
      Math.max(100, 1000 - (level - 1) * 100),
    )

    return () => clearInterval(interval)
  }, [isPlaying, gameOver, level, movePiece])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          movePiece(-1, 0)
          break
        case "ArrowRight":
          e.preventDefault()
          movePiece(1, 0)
          break
        case "ArrowDown":
          e.preventDefault()
          movePiece(0, 1)
          break
        case "ArrowUp":
        case " ":
          e.preventDefault()
          rotatePieceHandler()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPlaying, gameOver, movePiece, rotatePieceHandler])

  const renderBoard = () => {
    const displayBoard = board.map((row) => [...row])

    // Add current piece to display board
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = currentPiece.y + y
            const boardX = currentPiece.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.type
            }
          }
        })
      })
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => {
          let cellClass = "w-6 h-6 border border-gray-400"

          if (cell === 0) {
            cellClass += " bg-gray-900 dark:bg-gray-100" // Empty cell
          } else if (typeof cell === "string") {
            cellClass += ` ${TETROMINO_COLORS[cell as TetrominoType]} border-gray-300`
          } else {
            cellClass += " bg-gray-600" // Fallback
          }

          return <div key={x} className={cellClass} />
        })}
      </div>
    ))
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Game Board */}
        <div className="border-2 border-border p-2 bg-muted/20">{renderBoard()}</div>

        {/* Game Info */}
        <div className="space-y-4 min-w-[200px]">
          <div className="space-y-2">
            <div className="text-sm">
              Score: <span className="font-mono">{score}</span>
            </div>
            <div className="text-sm">
              Level: <span className="font-mono">{level}</span>
            </div>
            <div className="text-sm">
              Lines: <span className="font-mono">{lines}</span>
            </div>
          </div>

          <div className="space-y-2">
            {!isPlaying && !gameOver && (
              <Button onClick={startGame} className="w-full">
                Start Game
              </Button>
            )}

            {isPlaying && !gameOver && (
              <Button onClick={pauseGame} variant="outline" className="w-full bg-transparent">
                Pause
              </Button>
            )}

            {gameOver && (
              <div className="space-y-2">
                <div className="text-center text-destructive font-semibold">Game Over!</div>
                <Button onClick={startGame} className="w-full">
                  Play Again
                </Button>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <div>Controls:</div>
            <div>← → Move</div>
            <div>↓ Drop</div>
            <div>↑ Rotate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

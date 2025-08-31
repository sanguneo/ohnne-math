"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check, Grid3X3, Lightbulb, RotateCcw } from "lucide-react"

type CellState = "empty" | "filled" | "marked"
type Difficulty = 3 | 4 | 5

interface NonogramProblem {
    size: number
    solution: boolean[][]
    rowClues: number[]
    colClues: number[]
}

export default function NonogramApp() {
    const [difficulty, setDifficulty] = useState<Difficulty>(3)
    const [currentProblem, setCurrentProblem] = useState<NonogramProblem | null>(null)
    const [playerGrid, setPlayerGrid] = useState<CellState[][]>([])
    const [isCompleted, setIsCompleted] = useState(false)
    const [showSolution, setShowSolution] = useState(false)
    const [score, setScore] = useState({ correct: 0, total: 0 })

    // 빈 격자 생성
    const createEmptyGrid = (size: number): CellState[][] => {
        return Array(size)
            .fill(null)
            .map(() => Array(size).fill("empty"))
    }

    // 간단한 솔루션 생성 (각 행/열마다 연속된 블록 하나씩)
    const generateSimpleSolution = (size: number): boolean[][] => {
        const solution: boolean[][] = Array(size)
            .fill(null)
            .map(() => Array(size).fill(false))

        // 각 행마다 연속된 블록 하나씩 배치
        for (let row = 0; row < size; row++) {
            const blockSize = Math.floor(Math.random() * (size - 1)) + 1 // 1 ~ size-1
            const startPos = Math.floor(Math.random() * (size - blockSize + 1)) // 시작 위치

            for (let col = startPos; col < startPos + blockSize; col++) {
                solution[row][col] = true
            }
        }

        return solution
    }

    // 단서 생성 (각 행/열마다 하나의 숫자)
    const generateSimpleClues = (solution: boolean[][]): { rowClues: number[]; colClues: number[] } => {
        const size = solution.length
        const rowClues: number[] = []
        const colClues: number[] = []

        // 행 단서 생성
        for (let i = 0; i < size; i++) {
            let count = 0
            for (let j = 0; j < size; j++) {
                if (solution[i][j]) {
                    count++
                }
            }
            rowClues.push(count)
        }

        // 열 단서 생성
        for (let j = 0; j < size; j++) {
            let count = 0
            for (let i = 0; i < size; i++) {
                if (solution[i][j]) {
                    count++
                }
            }
            colClues.push(count)
        }

        return { rowClues, colClues }
    }

    // 새 문제 생성
    const generateProblem = () => {
        const solution = generateSimpleSolution(difficulty)
        const { rowClues, colClues } = generateSimpleClues(solution)

        const problem: NonogramProblem = {
            size: difficulty,
            solution,
            rowClues,
            colClues,
        }

        setCurrentProblem(problem)
        setPlayerGrid(createEmptyGrid(difficulty))
        setIsCompleted(false)
        setShowSolution(false)
    }

    // 셀 클릭 처리
    const handleCellClick = (row: number, col: number, clickType: "left" | "right") => {
        if (isCompleted) return

        setPlayerGrid((prev) => {
            const newGrid = prev.map((r) => [...r])

            if (clickType === "left") {
                // 좌클릭: empty → filled → empty
                if (newGrid[row][col] === "empty") {
                    newGrid[row][col] = "filled"
                } else if (newGrid[row][col] === "filled") {
                    newGrid[row][col] = "empty"
                } else if (newGrid[row][col] === "marked") {
                    newGrid[row][col] = "filled"
                }
            } else {
                // 우클릭: empty → marked → empty
                if (newGrid[row][col] === "empty") {
                    newGrid[row][col] = "marked"
                } else if (newGrid[row][col] === "marked") {
                    newGrid[row][col] = "empty"
                } else if (newGrid[row][col] === "filled") {
                    newGrid[row][col] = "marked"
                }
            }

            return newGrid
        })
    }

    // 완성 확인
    const checkCompletion = () => {
        if (!currentProblem) return

        const isCorrect = playerGrid.every((row, i) =>
            row.every((cell, j) => {
                const shouldBeFilled = currentProblem.solution[i][j]
                const isFilled = cell === "filled"
                return shouldBeFilled === isFilled
            }),
        )

        if (isCorrect) {
            setIsCompleted(true)
            setScore((prev) => ({
                correct: prev.correct + 1,
                total: prev.total + 1,
            }))
        } else {
            setScore((prev) => ({
                correct: prev.correct,
                total: prev.total + 1,
            }))
        }
    }

    // 격자 초기화
    const resetGrid = () => {
        if (currentProblem) {
            setPlayerGrid(createEmptyGrid(currentProblem.size))
            setIsCompleted(false)
            setShowSolution(false)
        }
    }

    // 격자 초기화 -> 게임 초기화로 변경
    const resetToStart = () => {
        setCurrentProblem(null)
        setPlayerGrid([])
        setIsCompleted(false)
        setShowSolution(false)
    }

    // 셀 렌더링
    const renderCell = (row: number, col: number) => {
        const cellState = playerGrid[row][col]
        let cellClass = "w-6 h-6 sm:w-8 sm:h-8 border border-gray-400 cursor-pointer transition-all hover:scale-110 "

        switch (cellState) {
            case "filled":
                cellClass += "bg-blue-600 hover:bg-blue-700"
                break
            case "marked":
                cellClass += "bg-red-200 hover:bg-red-300"
                break
            default:
                cellClass += "bg-white hover:bg-gray-100"
        }

        return (
            <div
                key={`${row}-${col}`}
                className={cellClass}
                onClick={() => handleCellClick(row, col, "left")}
                onContextMenu={(e) => {
                    e.preventDefault()
                    handleCellClick(row, col, "right")
                }}
            >
                {cellState === "marked" && (
                    <div className="w-full h-full flex items-center justify-center text-red-600 text-xs">×</div>
                )}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
            <div className="max-w-4xl mx-auto">
            {/* Score Display */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-4 bg-white/80 rounded-full px-6 py-3 border-none shadow-none text-sm sm:text-base">
                    <div className="text-green-600 font-semibold">완성: {score.correct}</div>
                    <div className="text-gray-500">|</div>
                    <div className="text-blue-600 font-semibold">총 시도: {score.total}</div>
                    {score.total > 0 && (
                        <>
                            <div className="text-gray-500">|</div>
                            <div className="text-purple-600 font-semibold">
                                성공률: {Math.round((score.correct / score.total) * 100)}%
                            </div>
                        </>
                    )}
                </div>
            </div>

            {!currentProblem ? (
                /* Start Screen */
                <Card className="bg-white border-2 border-indigo-300 shadow-xl">
                    <CardContent className="p-6 sm:p-8 md:p-12 text-center">
                        <div className="mb-8">
                            <Grid3X3 className="w-20 h-20 md:w-24 md:h-24 mx-auto text-indigo-500 mb-4" />
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">노노그램</h2>
                            <p className="text-base sm:text-lg text-gray-600 mb-2">숫자 단서를 보고 그림을 완성하세요!</p>
                            <p className="text-sm sm:text-base text-gray-500">Complete the picture using number clues!</p>
                        </div>

                        {/* 난이도 선택 */}
                        <div className="mb-8">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">난이도 선택</h3>
                            <div className="flex flex-wrap justify-center gap-4">
                                {[3, 4, 5].map((size) => (
                                    <Button
                                        key={size}
                                        onClick={() => setDifficulty(size as Difficulty)}
                                        variant={difficulty === size ? "primary" : "outline"}
                                        className="px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold"
                                    >
                                        {size}×{size}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={generateProblem}
                            variant="primary"
                            className="text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-lg"
                        >
                            퍼즐 시작! Start Puzzle! 🧩
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                /* Game Screen */
                <div className="space-y-6">
                    {/* Controls */}
                    <Card className="bg-white border-2 border-indigo-300 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-center md:text-left">
                                    <h2 className="text-xl sm:text-2xl font-bold text-indigo-600">
                                        {difficulty}×{difficulty} 노노그램
                                    </h2>
                                    <p className="text-gray-600">좌클릭: 칠하기 | 우클릭: X 표시</p>
                                </div>

                                {isCompleted && (
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600 mb-2">🎉 완성!</div>
                                        <div className="text-lg text-gray-700">축하합니다!</div>
                                    </div>
                                )}

                                <div className="flex gap-2 flex-wrap">
                                    <Button onClick={resetGrid} variant="outline" className="bg-white/80 hover:bg-white">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        초기화
                                    </Button>
                                    <Button onClick={resetToStart} variant="outline" className="bg-white/80 hover:bg-white">
                                        <Grid3X3 className="w-4 h-4 mr-2" />
                                        난이도 변경
                                    </Button>
                                    <Button
                                        onClick={() => setShowSolution(!showSolution)}
                                        variant="outline"
                                        className="bg-white/80 hover:bg-white"
                                    >
                                        <Lightbulb className="w-4 h-4 mr-2" />
                                        {showSolution ? "답 숨기기" : "답 보기"}
                                    </Button>
                                    <Button onClick={checkCompletion} variant="success">
                                        <Check className="w-4 h-4 mr-2" />
                                        확인
                                    </Button>
                                    <Button onClick={generateProblem} variant="primary">
                                        <RefreshCw className="w-4 h-4 mr-2" />새 퍼즐
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Game Grid */}
                    <Card className="bg-white border-2 border-gray-300 shadow-lg">
                        <CardContent className="p-4 sm:p-8 overflow-x-auto">
                            <div className="flex justify-center">
                                <div className="inline-block">
                                    {/* 열 단서 */}
                                    <div className="flex">
                                        <div className="w-12 sm:w-16"></div> {/* 빈 공간 */}
                                        {currentProblem.colClues.map((clue, colIndex) => (
                                            <div key={`col-${colIndex}`} className="w-6 h-12 sm:w-8 sm:h-16 flex items-end justify-center">
                                                <div className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-semibold text-gray-700">
                                                    {clue}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 행 단서 + 게임 격자 */}
                                    {currentProblem.rowClues.map((rowClue, rowIndex) => (
                                        <div key={rowIndex} className="flex items-center">
                                            {/* 행 단서 */}
                                            <div className="w-12 sm:w-16 h-6 sm:h-8 pr-2 flex items-center justify-end">
                                                <div className="bg-gray-100 px-2 py-1 rounded text-xs sm:text-sm font-semibold text-gray-700">
                                                    {rowClue}
                                                </div>
                                            </div>

                                            {/* 게임 셀들 */}
                                            {Array(currentProblem.size)
                                                .fill(null)
                                                .map((_, colIndex) => renderCell(rowIndex, colIndex))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 솔루션 표시 */}
                            {showSolution && (
                                <div className="mt-8 text-center">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">정답</h3>
                                    <div className="inline-block">
                                        {currentProblem.solution.map((row, i) => (
                                            <div key={i} className="flex">
                                                {row.map((cell, j) => (
                                                    <div
                                                        key={j}
                                                        className={`w-4 h-4 sm:w-6 sm:h-6 border border-gray-400 ${cell ? "bg-green-500" : "bg-white"}`}
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Instructions */}
                    <Card className="bg-blue-50 border-2 border-blue-200 shadow-lg">
                        <CardContent className="p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-bold text-blue-800 mb-3">게임 방법</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-700">
                                <div>
                                    <strong>• 좌클릭:</strong> 셀을 파란색으로 칠합니다
                                </div>
                                <div>
                                    <strong>• 우클릭:</strong> 빈 셀임을 표시합니다 (×)
                                </div>
                                <div>
                                    <strong>• 숫자 단서:</strong> 그 행/열에 칠해진 셀의 총 개수
                                </div>
                                <div>
                                    <strong>• 목표:</strong> 모든 단서에 맞게 그림 완성
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            </div>
        </div>
    )
}

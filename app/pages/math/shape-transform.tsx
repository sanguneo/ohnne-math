"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check, X, RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from "lucide-react"

type TransformationType = "rotation" | "reflection"
type RotationDirection = "clockwise" | "counterclockwise"
type ReflectionType = "horizontal" | "vertical"

interface Problem {
  originalShape: boolean[][]
  transformationType: TransformationType
  rotationSteps?: number
  rotationDirection?: RotationDirection
  reflectionSteps?: ReflectionType[]
  correctAnswer: boolean[][]
  options: boolean[][][]
  questionText: string
}

const GRID_SIZE = 4

export default function ShapeTransformationApp() {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  // 빈 격자 생성
  const createEmptyGrid = (): boolean[][] => {
    return Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(false))
  }

  // 랜덤 도형 생성
  const generateRandomShape = (): boolean[][] => {
    const grid = createEmptyGrid()
    const numCells = Math.floor(Math.random() * 4) + 2 // 2-5개 셀 (기존 4-11개에서 줄임)

    for (let i = 0; i < numCells; i++) {
      let row, col
      do {
        row = Math.floor(Math.random() * GRID_SIZE)
        col = Math.floor(Math.random() * GRID_SIZE)
      } while (grid[row][col])
      grid[row][col] = true
    }

    return grid
  }

  // 시계방향 90도 회전
  const rotateClockwise = (grid: boolean[][]): boolean[][] => {
    const newGrid = createEmptyGrid()
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newGrid[j][GRID_SIZE - 1 - i] = grid[i][j]
      }
    }
    return newGrid
  }

  // 반시계방향 90도 회전
  const rotateCounterclockwise = (grid: boolean[][]): boolean[][] => {
    const newGrid = createEmptyGrid()
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newGrid[GRID_SIZE - 1 - j][i] = grid[i][j]
      }
    }
    return newGrid
  }

  // 좌우 대칭
  const flipHorizontal = (grid: boolean[][]): boolean[][] => {
    return grid.map((row) => [...row].reverse())
  }

  // 위아래 대칭
  const flipVertical = (grid: boolean[][]): boolean[][] => {
    return [...grid].reverse()
  }

  // 격자 복사
  const copyGrid = (grid: boolean[][]): boolean[][] => {
    return grid.map((row) => [...row])
  }

  // 격자 비교
  const gridsEqual = (grid1: boolean[][], grid2: boolean[][]): boolean => {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid1[i][j] !== grid2[i][j]) return false
      }
    }
    return true
  }

  // 회전 문제 생성
  const generateRotationProblem = (): Problem => {
    const originalShape = generateRandomShape()
    const rotationSteps = Math.floor(Math.random() * 3) + 1 // 1-3번 회전
    const rotationDirection: RotationDirection = Math.random() > 0.5 ? "clockwise" : "counterclockwise"

    let correctAnswer = copyGrid(originalShape)
    for (let i = 0; i < rotationSteps; i++) {
      correctAnswer =
          rotationDirection === "clockwise" ? rotateClockwise(correctAnswer) : rotateCounterclockwise(correctAnswer)
    }

    const questionText = `이 도형을 ${rotationDirection === "clockwise" ? "시계방향" : "반시계방향"}으로 ${rotationSteps}번 회전하면?`

    return {
      originalShape,
      transformationType: "rotation",
      rotationSteps,
      rotationDirection,
      correctAnswer,
      options: [],
      questionText,
    }
  }

  // 대칭 문제 생성
  const generateReflectionProblem = (): Problem => {
    const originalShape = generateRandomShape()
    const numSteps = Math.floor(Math.random() * 3) + 1 // 1-3번 변환
    const reflectionSteps: ReflectionType[] = []

    let correctAnswer = copyGrid(originalShape)
    const questionParts: string[] = []

    for (let i = 0; i < numSteps; i++) {
      const reflectionType: ReflectionType = Math.random() > 0.5 ? "horizontal" : "vertical"
      reflectionSteps.push(reflectionType)

      if (reflectionType === "horizontal") {
        correctAnswer = flipHorizontal(correctAnswer)
        questionParts.push("좌우 대칭")
      } else {
        correctAnswer = flipVertical(correctAnswer)
        questionParts.push("위아래 대칭")
      }
    }

    const questionText = `이 도형을 ${questionParts.join(" → ")} 하면?`

    return {
      originalShape,
      transformationType: "reflection",
      reflectionSteps,
      correctAnswer,
      options: [],
      questionText,
    }
  }

  // 오답 선택지 생성
  const generateWrongOptions = (correctAnswer: boolean[][], originalShape: boolean[][]): boolean[][][] => {
    const options: boolean[][][] = []

    // 다른 회전들
    let temp = copyGrid(originalShape)
    for (let i = 1; i <= 3; i++) {
      temp = rotateClockwise(temp)
      if (!gridsEqual(temp, correctAnswer)) {
        options.push(copyGrid(temp))
      }
    }

    // 대칭 변환들
    const horizontal = flipHorizontal(originalShape)
    const vertical = flipVertical(originalShape)

    if (!gridsEqual(horizontal, correctAnswer)) options.push(horizontal)
    if (!gridsEqual(vertical, correctAnswer)) options.push(vertical)

    // 원본 도형
    if (!gridsEqual(originalShape, correctAnswer)) {
      options.push(originalShape)
    }

    // 랜덤 변형
    while (options.length < 3) {
      const randomShape = generateRandomShape()
      if (!gridsEqual(randomShape, correctAnswer) && !options.some((opt) => gridsEqual(opt, randomShape))) {
        options.push(randomShape)
      }
    }

    return options.slice(0, 3)
  }

  const generateProblem = () => {
    const problemType = Math.random() > 0.5 ? "rotation" : "reflection"
    const problem = problemType === "rotation" ? generateRotationProblem() : generateReflectionProblem()

    const wrongOptions = generateWrongOptions(problem.correctAnswer, problem.originalShape)
    const allOptions = [problem.correctAnswer, ...wrongOptions]

    // 선택지 섞기
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]]
    }

    problem.options = allOptions
    setCurrentProblem(problem)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const checkAnswer = () => {
    if (!currentProblem || selectedAnswer === null) return

    const isCorrect = gridsEqual(currentProblem.options[selectedAnswer], currentProblem.correctAnswer)
    setShowResult(true)
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }))
  }

  const renderGrid = (grid: boolean[][], size: "large" | "small" = "large") => {
    const cellSize = size === "large" ? "w-10 h-10" : "w-8 h-8" // 기존보다 조금 더 크게

    return (
        <div className="inline-block border-2 border-gray-400 bg-white">
          {grid.map((row, i) => (
              <div key={i} className="flex">
                {row.map((cell, j) => (
                    <div key={j} className={`${cellSize} border border-gray-300 ${cell ? "bg-blue-500" : "bg-white"}`} />
                ))}
              </div>
          ))}
        </div>
    )
  }

  const getTransformationIcon = () => {
    if (!currentProblem) return null

    if (currentProblem.transformationType === "rotation") {
      return currentProblem.rotationDirection === "clockwise" ? (
          <RotateCw className="w-6 h-6 text-blue-600" />
      ) : (
          <RotateCcw className="w-6 h-6 text-blue-600" />
      )
    } else {
      return currentProblem.reflectionSteps?.includes("horizontal") ? (
          <FlipHorizontal className="w-6 h-6 text-green-600" />
      ) : (
          <FlipVertical className="w-6 h-6 text-green-600" />
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-4 bg-white/80 rounded-full px-6 py-3 border-2 border-gray-200 shadow-sm">
          <div className="text-green-600 font-semibold">정답: {score.correct}</div>
          <div className="text-gray-500">|</div>
          <div className="text-blue-600 font-semibold">총 문제: {score.total}</div>
          {score.total > 0 && (
              <>
                <div className="text-gray-500">|</div>
                <div className="text-orange-600 font-semibold">
                  정답률: {Math.round((score.correct / score.total) * 100)}%
                </div>
              </>
          )}
        </div>
      </div>

      {!currentProblem ? (
          /* Start Screen */
          <Card className="bg-white border-2 border-orange-300 shadow-xl">
            <CardContent className="p-6 md:p-12 text-center">
              <div className="mb-8">
                <div className="text-6xl mb-4">🔄</div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">도형 변환</h2>
                <p className="text-base md:text-lg text-gray-600 mb-2">도형의 회전과 대칭을 학습해보세요!</p>
                <p className="text-sm md:text-md text-gray-500">Learn shape rotation and reflection!</p>
              </div>

              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <RotateCw className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-sm font-semibold">시계방향 회전</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <RotateCcw className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-sm font-semibold">반시계방향 회전</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <FlipHorizontal className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <div className="text-sm font-semibold">좌우 대칭</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <FlipVertical className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <div className="text-sm font-semibold">위아래 대칭</div>
                </div>
              </div>

              <Button
                  onClick={generateProblem}
                  variant="primaryGradient"
                  className="text-xl px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                문제 시작! Start! 🎯
              </Button>
            </CardContent>
          </Card>
      ) : (
          /* Problem Screen */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Question */}
            <Card className="bg-white border-2 border-blue-300 shadow-lg">
              <CardContent className="p-8 h-full">
                <div className="text-center mb-6 h-full flex flex-col">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {getTransformationIcon()}
                    <h2 className="text-2xl font-bold text-gray-800">문제</h2>
                  </div>
                  <p className="text-xl text-gray-700 mb-6">{currentProblem.questionText}</p>

                  <div className="flex justify-center my-auto">{renderGrid(currentProblem.originalShape, "large")}</div>
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card className="bg-white border-2 border-green-300 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 text-center mb-6">정답을 선택하세요</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {currentProblem.options.map((option, index) => (
                      <div
                          key={index}
                          onClick={() => !showResult && setSelectedAnswer(index)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                              selectedAnswer === index
                                  ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                          } ${showResult ? "cursor-not-allowed" : ""}`}
                      >
                        <div className="mb-2 font-semibold text-gray-700">선택지 {index + 1}</div>
                        {renderGrid(option, "small")}

                        {showResult && (
                            <div className="mt-2">
                              {gridsEqual(option, currentProblem.correctAnswer) ? (
                                  <div className="text-green-600 font-bold">✅ 정답</div>
                              ) : selectedAnswer === index ? (
                                  <div className="text-red-600 font-bold">❌ 오답</div>
                              ) : null}
                            </div>
                        )}
                      </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center mt-8">
                  {!showResult ? (
                      <Button
                          onClick={checkAnswer}
                          disabled={selectedAnswer === null}
                          variant="successGradient"
                          className="px-8 py-3 rounded-full font-semibold"
                      >
                        확인하기 Check! ✓
                      </Button>
                  ) : (
                      <div className="text-center">
                        <div
                            className={`text-2xl font-bold mb-4 ${
                                selectedAnswer !== null &&
                                gridsEqual(currentProblem.options[selectedAnswer], currentProblem.correctAnswer)
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                          {selectedAnswer !== null &&
                          gridsEqual(currentProblem.options[selectedAnswer], currentProblem.correctAnswer) ? (
                              <div className="flex items-center justify-center gap-2">
                                <Check className="w-8 h-8" />
                                정답입니다! 🎉
                              </div>
                          ) : (
                              <div className="flex items-center justify-center gap-2">
                                <X className="w-8 h-8" />
                                틀렸어요! 다시 도전해보세요!
                              </div>
                          )}
                        </div>

                    <Button
                            onClick={generateProblem}
                            variant="primaryGradient"
                            className="px-8 py-3 rounded-full font-semibold"
                        >
                          <RefreshCw className="w-5 h-5 mr-2" />
                          다음 문제 Next!
                        </Button>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
      )}
      </div>
    </div>
  )
}

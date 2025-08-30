"use client"

import {useState, useEffect, type ChangeEvent, type KeyboardEvent} from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Check, Calculator, Trophy, ChevronUp, ChevronDown } from "lucide-react"

type Difficulty = "easy" | "medium" | "hard"
type Operation = "addition" | "subtraction"

interface Problem {
  id: number
  num1: number
  num2: number
  operation: Operation
  answer: number
  userAnswer: string
  isCorrect?: boolean
}

interface DifficultyConfig {
  name: string
  description: string
  range1: [number, number] // 첫 번째 숫자 범위
  range2: [number, number] // 두 번째 숫자 범위
  color: string
  bgColor: string
}

const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: "쉬움",
    description: "1자리 + 1자리",
    range1: [1, 9],
    range2: [1, 9],
    color: "text-green-600",
    bgColor: "bg-green-100 border-green-300",
  },
  medium: {
    name: "보통",
    description: "2자리 + 1자리",
    range1: [10, 99],
    range2: [1, 9],
    color: "text-blue-600",
    bgColor: "bg-blue-100 border-blue-300",
  },
  hard: {
    name: "어려움",
    description: "2자리 + 2자리",
    range1: [10, 99],
    range2: [10, 99],
    color: "text-purple-600",
    bgColor: "bg-purple-100 border-purple-300",
  },
}

export default function MathBasicsApp() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [problems, setProblems] = useState<Problem[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const generateNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const generateProblem = (id: number, config: DifficultyConfig): Problem => {
    const operation: Operation = Math.random() > 0.5 ? "addition" : "subtraction"
    let num1 = generateNumber(config.range1[0], config.range1[1])
    let num2 = generateNumber(config.range2[0], config.range2[1])

    // 뺄셈의 경우 음수가 나오지 않도록 조정
    if (operation === "subtraction" && num2 > num1) {
      ;[num1, num2] = [num2, num1]
    }

    const answer = operation === "addition" ? num1 + num2 : num1 - num2

    return {
      id,
      num1,
      num2,
      operation,
      answer,
      userAnswer: "",
    }
  }

  const generateProblems = () => {
    const config = difficultyConfigs[difficulty]
    const newProblems = Array.from({ length: 10 }, (_, i) => generateProblem(i + 1, config))
    setProblems(newProblems)
    setIsCompleted(false)
    setShowResults(false)
    setScore(0)
  }

  const handleAnswerChange = (problemId: number, value: string) => {
    // 숫자만 입력 허용
    if (value === "" || /^\d+$/.test(value)) {
      setProblems((prev) =>
          prev.map((problem) => (problem.id === problemId ? { ...problem, userAnswer: value } : problem)),
      )
    }
  }

  const checkAnswers = () => {
    let correctCount = 0
    const updatedProblems = problems.map((problem) => {
      const isCorrect = Number.parseInt(problem.userAnswer) === problem.answer
      if (isCorrect) correctCount++
      return { ...problem, isCorrect }
    })

    setProblems(updatedProblems)
    setScore(correctCount)
    setShowResults(true)
    setIsCompleted(true)
  }

  const resetProblems = () => {
    generateProblems()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // 현재 input
      const currentInput = e.target as HTMLInputElement;

      // 모든 input 리스트 가져오기
      const inputs = Array.from(document.querySelectorAll('input[data-seq]')) as HTMLInputElement[];

      // 현재 input의 index 찾기
      const currentIndex = inputs.indexOf(currentInput);

      // 다음 input이 있으면 focus, 없으면 submit
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      } else {
        checkAnswers();
      }
    }
  };

  useEffect(() => {
    if (initialized) generateProblems()
  }, [difficulty])

  useEffect(() => {
    // setTimeout(() => {setInitialized(true);}, 500);
  }, [])


  const allAnswered = problems.every((problem) => problem.userAnswer.trim() !== "")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
      {problems.length === 0 ? (
          /* Start Screen */
          <Card className="bg-white border-2 border-blue-300 shadow-xl">
            <CardContent className="p-6 md:p-12 text-center">
              <div className="mb-8">
                <Calculator className="w-20 h-20 md:w-24 md:h-24 mx-auto text-blue-500 mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">덧셈뺄셈</h2>
                <p className="text-base md:text-lg text-gray-600 mb-2">덧셈과 뺄셈을 연습해보세요!</p>
              </div>

              {/* 난이도 선택 */}
              <div className="mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">난이도 선택</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(difficultyConfigs).map(([key, config]) => (
                      <div
                          key={key}
                          onClick={() => setDifficulty(key as Difficulty)}
                          className={`p-6 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                              difficulty === key
                                  ? `${config.bgColor} shadow-lg scale-105`
                                  : "bg-gray-100 border-gray-300 hover:bg-gray-200 hover:shadow-md"
                          }`}
                      >
                        <div className={`text-xl font-bold mb-2 ${difficulty === key ? config.color : "text-gray-700"}`}>
                          {config.name}
                        </div>
                        <div className="text-sm text-gray-600">{config.description}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {key === "easy" && "예: 5 + 3 = ?"}
                          {key === "medium" && "예: 25 + 7 = ?"}
                          {key === "hard" && "예: 34 + 28 = ?"}
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              <Button
                  onClick={generateProblems}
                  variant="primaryGradient"
                  className="text-xl px-8 py-4 rounded-full font-semibold"
              >
                {difficultyConfigs[difficulty].name} 단계 시작! 📝
              </Button>
            </CardContent>
          </Card>
      ) : (
          /* Problems Screen */
          <div className="space-y-6">
            {/* Header with difficulty and score */}
            <Card className={`${difficultyConfigs[difficulty].bgColor} border-2 shadow-lg`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left flex items-center gap-4">
                    <div>
                      <h2 className={`text-2xl font-bold ${difficultyConfigs[difficulty].color}`}>
                        {difficultyConfigs[difficulty].name} 단계
                      </h2>
                      <p className="text-gray-600">{difficultyConfigs[difficulty].description}</p>
                    </div>

                    {/* 난이도 조절 버튼들 */}
                    <div className="flex flex-col gap-1">
                      <Button
                          onClick={() => {
                            const levels: Difficulty[] = ["easy", "medium", "hard"]
                            const currentIndex = levels.indexOf(difficulty)
                            if (currentIndex < levels.length - 1) {
                              setDifficulty(levels[currentIndex + 1])
                            }
                          }}
                          disabled={difficulty === "hard"}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                          onClick={() => {
                            const levels: Difficulty[] = ["easy", "medium", "hard"]
                            const currentIndex = levels.indexOf(difficulty)
                            if (currentIndex > 0) {
                              setDifficulty(levels[currentIndex - 1])
                            }
                          }}
                          disabled={difficulty === "easy"}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {showResults && (
                      <div className="text-center">
                        <div className="flex items-center gap-2 justify-center mb-2">
                          <Trophy className="w-6 h-6 text-yellow-500" />
                          <span className="text-xl font-bold text-gray-800">점수: {score}/10</span>
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {score >= 9 ? "완벽해요! 🌟" : score >= 7 ? "잘했어요! 👏" : "더 연습해봐요! 💪"}
                        </div>
                      </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={resetProblems} variant="outline" className="bg-white/80 hover:bg-white">
                      <RefreshCw className="w-4 h-4 mr-2" />새 문제
                    </Button>
                    {!showResults && (
                        <Button
                            onClick={checkAnswers}
                            disabled={!allAnswered}
                            variant="successGradient"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          채점하기
                        </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {problems.map((problem) => (
                  <Card
                      key={problem.id}
                      className={`border-2 shadow-sm ${
                          showResults
                              ? problem.isCorrect
                                  ? "bg-green-50 border-green-300"
                                  : "bg-red-50 border-red-300"
                              : "bg-white border-gray-300"
                      }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        {/* Problem Number */}
                        <div className="text-sm font-semibold text-gray-500 min-w-[60px]">문제 {problem.id}</div>

                        {/* Math Problem */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-2xl font-bold text-gray-800">
                            {problem.num1} {problem.operation === "addition" ? "+" : "−"} {problem.num2} =
                          </div>

                          {/* Answer Input */}
                          <Input
                              type="number"
                              value={problem.userAnswer}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleAnswerChange(problem.id, e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="w-20 h-10 text-xl font-bold text-center border-2 border-gray-300 rounded-lg"
                              placeholder="?"
                              disabled={showResults}
                              data-seq={`${problem.id}`}
                          />

                          {/* Show correct answer if wrong */}
                          {showResults && !problem.isCorrect && (
                              <div className="text-lg font-semibold text-red-600">정답: {problem.answer}</div>
                          )}
                        </div>

                        {/* Result Icon */}
                        {showResults && (
                            <div className="text-2xl min-w-[40px] text-center">{problem.isCorrect ? "✅" : "❌"}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>

            {/* Results Summary */}
            {showResults && (
                <Card className="bg-white border-2 border-gray-300 shadow-lg">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">결과 요약</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                        <div className="text-green-600 text-sm font-medium">정답</div>
                        <div className="text-3xl font-bold text-green-800">{score}개</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                        <div className="text-red-600 text-sm font-medium">오답</div>
                        <div className="text-3xl font-bold text-red-800">{10 - score}개</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                        <div className="text-blue-600 text-sm font-medium">정답률</div>
                        <div className="text-3xl font-bold text-blue-800">{score * 10}%</div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                          onClick={resetProblems}
                          variant="primaryGradient"
                          className="px-6 py-3 rounded-full font-semibold"
                      >
                        같은 난이도 다시하기
                      </Button>
                      <Button
                          onClick={() => {
                            setProblems([])
                            setShowResults(false)
                          }}
                          variant="primaryGradient"
                          className="px-6 py-3 rounded-full font-semibold"
                      >
                        난이도 바꾸기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            )}
          </div>
      )}
      </div>
    </div>
  )
}

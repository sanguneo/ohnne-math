"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface Problem {
  type: "split" | "combine"
  total: number
  parts: number[]
  missingIndex?: number
  question: string
  answer: number
}

const colors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-orange-400",
  "bg-cyan-400",
]

export default function SplittingCombiningApp() {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null)
  const [userAnswer, setUserAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [difficulty, setDifficulty] = useState<2 | 3 | 4>(2) // 2, 3, 4개로 나누기

  function toArray(maybeArray:HTMLElement|HTMLElement[]) {
    return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
  }

  function getCenterBottom(el:HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.bottom + window.scrollY,
    };
  }

  function getCenterTop(el:HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top + window.scrollY,
    };
  }

  function connectElements(from: HTMLElement|HTMLElement[], to:HTMLElement|HTMLElement[], svgId: string = 'line-layer') {
    const svg = document.getElementById(svgId);
    if (!svg) return;

    // 지우기
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const fromEls = toArray(from);
    const toEls = toArray(to);
    const max = Math.max(fromEls.length, toEls.length);

    for (let i = 0; i < max; i++) {
      const fromEl = fromEls[Math.min(i, fromEls.length - 1)];
      const toEl = toEls[Math.min(i, toEls.length - 1)];

      const start = getCenterBottom(fromEl);
      const end = getCenterTop(toEl);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(start.x));
      line.setAttribute("y1", String(start.y));
      line.setAttribute("x2", String(end.x));
      line.setAttribute("y2", String(end.y));
      line.setAttribute("stroke", "#6B7280");
      line.setAttribute("stroke-width", "2");
      svg.appendChild(line);
    }
  }

  const generateProblem = (): Problem => {
    const type = Math.random() > 0.5 ? "split" : "combine"
    const numParts = difficulty


    setTimeout(()=> {
      const fromEls = Array.from(document.querySelectorAll(".from")) as HTMLElement[];
      const toEls = Array.from(document.querySelectorAll(".to")) as HTMLElement[];

      connectElements([...fromEls], [...toEls]);
    }, 50);

    if (type === "split") {
      const total = Math.floor(Math.random() * 8) + numParts // 최소 parts 개수만큼
      const parts: number[] = []

      // 랜덤하게 parts 생성
      let remaining = total
      for (let i = 0; i < numParts - 1; i++) {
        const maxPart = remaining - (numParts - i - 1) // 나머지 부분들을 위해 최소 1씩 남겨둠
        const part = Math.floor(Math.random() * Math.min(maxPart, 5)) + 1
        parts.push(part)
        remaining -= part
      }
      parts.push(remaining) // 마지막 부분

      // 랜덤하게 하나를 숨김
      const missingIndex = Math.floor(Math.random() * numParts)
      const answer = parts[missingIndex]

      return {
        type: "split",
        total,
        parts,
        missingIndex,
        question: `${total}을 ${numParts}개로 나누면?`,
        answer,
      }
    } else {
      // combine
      const parts: number[] = []
      for (let i = 0; i < numParts; i++) {
        parts.push(Math.floor(Math.random() * 4) + 1) // 1-4
      }
      const total = parts.reduce((sum, part) => sum + part, 0)

      return {
        type: "combine",
        total,
        parts,
        question: `${parts.join(" + ")} = ?`,
        answer: total,
      }
    }
  }

  const startNewProblem = () => {
    const problem = generateProblem()
    setCurrentProblem(problem)
    setUserAnswer(null)
    setShowResult(false)
  }

  const handleNumberSelect = (number: number) => {
    setUserAnswer(number)
  }

  const checkAnswer = () => {
    if (userAnswer === null || !currentProblem) return

    const isCorrect = userAnswer === currentProblem.answer
    setShowResult(true)
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }))
  }


  const renderDots = (count: number, color = "bg-blue-400") => {
    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={`w-6 h-6 rounded-full border-2 border-gray-300 ${color} shadow-sm`} />
        ))}
      </div>
    )
  }

  const renderTreeVisualization = () => {
    if (!currentProblem) return null

    if (currentProblem.type === "split") {
      const { total, parts, missingIndex } = currentProblem

      return (
        <div className="flex flex-col items-center space-y-8">
          {/* 전체 (루트) */}
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 mb-3">전체</div>
            <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-300 from">
              {renderDots(total, "bg-blue-400")}
              <div className="text-xl font-bold text-blue-800 mt-2">{total}</div>
            </div>
          </div>

          {/* 부분들 */}
          <div className="flex justify-center gap-6">
            {parts.map((part, index) => (
              <div key={index} className="text-center to">
                <div
                  className={`rounded-lg p-4 border-2 ${
                    index === missingIndex
                      ? "bg-gray-100 border-gray-300"
                      : `${colors[index % colors.length].replace("bg-", "bg-").replace("-400", "-100")} border-${colors[index % colors.length].replace("bg-", "").replace("-400", "-300")}`
                  }`}
                >
                  {index === missingIndex ? (
                    showResult && userAnswer !== null ? (
                      <>
                        {renderDots(userAnswer, colors[index % colors.length])}
                        <div className="text-lg font-bold mt-2">{userAnswer}</div>
                      </>
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <span className="text-4xl text-gray-400">?</span>
                      </div>
                    )
                  ) : (
                    <>
                      {renderDots(part, colors[index % colors.length])}
                      <div className="text-lg font-bold mt-2">{part}</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    } else {
      // combine
      const { parts, total } = currentProblem

      return (
        <div className="flex flex-col items-center space-y-8">
          {/* 부분들 */}
          <div className="flex justify-center gap-6">
            {parts.map((part, index) => (
              <div key={index} className="text-center from">
                <div
                  className={`rounded-lg p-4 border-2 ${colors[index % colors.length].replace("bg-", "bg-").replace("-400", "-100")} border-${colors[index % colors.length].replace("bg-", "").replace("-400", "-300")}`}
                >
                  {renderDots(part, colors[index % colors.length])}
                  <div className="text-lg font-bold mt-2">{part}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 전체 (결과) */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300 to">
              {showResult ? (
                <>
                  {renderDots(total, "bg-blue-400")}
                  <div className="text-xl font-bold text-blue-800 mt-2">{total}</div>
                </>
              ) : (
                <div className="w-20 h-16 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">?</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto relative">
        <svg
          id="line-layer"
          className="connector-line absolute top-0 left-0 pointer-events-none z-0"
          width="100%"
          height="100%"
        ></svg>
        {/* Score Display */}
        <div className="text-center mb-6">
          <div
            className="inline-flex flex-wrap justify-center items-center gap-2 sm:gap-4 bg-white/80 rounded-full px-4 sm:px-6 py-2 sm:py-3 border-2 border-blue-200 shadow-md text-sm sm:text-lg"
          >
            <div className="text-green-600 font-semibold">정답: {score.correct}</div>
            <div className="text-gray-500">|</div>
            <div className="text-blue-600 font-semibold">총 문제: {score.total}</div>
            {score.total > 0 && (
              <>
                <div className="text-gray-500">|</div>
                <div className="text-blue-600 font-semibold">
                  정답률: {Math.round((score.correct / score.total) * 100)}%
                </div>
              </>
            )}
          </div>
        </div>

        {!currentProblem ? (
          /* Start Screen */
          <Card className="bg-white border-2 border-blue-300 shadow-xl">
            <CardContent className="p-6 md:p-12 text-center">
              <div className="mb-8">
                <div className="text-5xl md:text-6xl mb-4">🔢</div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">가르기와 모으기</h2>
                <p className="text-base md:text-lg text-gray-600 mb-2">숫자를 나누고 합치는 연습을 해보세요!</p>
                <p className="text-sm md:text-md text-gray-500">Practice splitting and combining numbers!</p>
              </div>

              {/* 난이도 선택 */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">난이도 선택</h3>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {[2, 3, 4].map((level) => (
                    <Button
                      key={level}
                      onClick={() => setDifficulty(level as 2 | 3 | 4)}
                      variant={difficulty === level ? "primary" : "outline"}
                      className="px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold text-sm sm:text-base"
                    >
                      {level}개로 나누기
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={startNewProblem}
                variant="primary"
                className="text-lg md:text-xl px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg"
              >
                시작하기 Start! 🚀
              </Button>
            </CardContent>
          </Card>
          ) : (
          /* Problem Screen */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Question Card */}
            <Card className="bg-white border-2 border-blue-300 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">문제</h2>
                  <p className="text-lg md:text-xl text-gray-700">{currentProblem.question}</p>
                </div>
                {/* Tree Visualization */}
                <div className="mb-8 overflow-x-auto">{renderTreeVisualization()}</div>
              </CardContent>
            </Card>

            {/* Answer Selection */}
            <Card className="bg-white border-2 border-blue-300 shadow-lg">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 text-center mb-4">답을 선택하세요</h3>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-6">
                  {Array.from({ length: difficulty * 6 }, (_, i) => i + 1).map((number) => (
                    <Button
                      key={number}
                      onClick={() => handleNumberSelect(number)}
                      variant={userAnswer === number ? "primary" : "outline"}
                      className="h-12 sm:h-14 text-base sm:text-lg font-bold rounded-xl border-2 transition-all"
                    >
                      {number}
                    </Button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 sm:gap-4 justify-center">
                  {!showResult ? (
                    <Button
                      onClick={checkAnswer}
                      disabled={userAnswer === null}
                      variant="success"
                      className="px-8 md:px-16 py-4 md:py-6 rounded-sm font-semibold text-base md:text-lg"
                    >
                      확인하기 Check! ✓
                    </Button>
                  ) : (
                    <div className="text-center">
                      <div
                        className={`text-xl md:text-2xl font-bold mb-4 ${
                          userAnswer === currentProblem.answer ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {userAnswer === currentProblem.answer ? (
                          <div className="flex items-center justify-center gap-2 text-base md:text-lg rounded-sm">
                            <Check className="w-6 h-6 md:w-8 md:h-8" />
                            정답입니다! 🎉
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 text-base md:text-lg rounded-sm">
                            <X className="w-6 h-6 md:w-8 md:h-8" />
                            틀렸어요. 정답은 {currentProblem.answer}입니다.
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={startNewProblem}
                        variant="primary"
                        className="px-8 md:px-16 py-4 md:py-6 rounded-sm font-semibold text-base md:text-lg"
                      >
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

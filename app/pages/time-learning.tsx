"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Check, X, Clock } from "lucide-react"

interface TimeQuestion {
  hour: number
  minute: number
  displayType: "analog" | "digital"
  questionText: string
}

export default function TimeLearningApp() {
  const [currentQuestion, setCurrentQuestion] = useState<TimeQuestion | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const generateQuestion = (): TimeQuestion => {
    const hour = Math.floor(Math.random() * 12) + 1 // 1-12
    const minute = Math.floor(Math.random() * 12) * 5 // 0, 5, 10, ..., 55
    const displayType = Math.random() > 0.5 ? "analog" : "digital"

    return {
      hour,
      minute,
      displayType,
      questionText: displayType === "analog" ? "아날로그 시계의 시간을 읽어보세요" : "디지털 시계의 시간을 읽어보세요",
    }
  }

  const startNewQuestion = () => {
    const question = generateQuestion()
    setCurrentQuestion(question)
    setSelectedHour(null)
    setSelectedMinute(null)
    setShowResult(false)
  }

  const checkAnswer = () => {
    if (!currentQuestion || selectedHour === null || selectedMinute === null) return

    const isCorrect = selectedHour === currentQuestion.hour && selectedMinute === currentQuestion.minute
    setShowResult(true)
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }))
  }

  const renderAnalogClock = (hour: number, minute: number) => {
    const hourAngle = (hour % 12) * 30 + minute * 0.5 // 시침 각도
    const minuteAngle = minute * 6 // 분침 각도

    return (
      <div className="relative w-64 h-64 mx-auto">
        {/* 시계 외곽 */}
        <div className="w-full h-full rounded-full border-8 border-gray-800 bg-white shadow-2xl relative">
          {/* 시간 숫자들 */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = i * 30 - 90
            const x = Math.cos((angle * Math.PI) / 180) * 100
            const y = Math.sin((angle * Math.PI) / 180) * 100
            return (
              <div
                key={i}
                className="absolute w-8 h-8 flex items-center justify-center text-xl font-bold text-gray-800"
                style={{
                  left: `calc(50% + ${x}px - 16px)`,
                  top: `calc(50% + ${y}px - 16px)`,
                }}
              >
                {i === 0 ? 12 : i}
              </div>
            )
          })}

          {Array.from({ length: 12 }, (_, i) => {
            const angle = i * 30 - 90
            const x = Math.cos((angle * Math.PI) / 180) * 140
            const y = Math.sin((angle * Math.PI) / 180) * 140
            return (
              <div
                key={i}
                className="absolute w-4 h-4 flex items-center justify-center text-sm font-medium text-gray-600 opacity-30"
                style={{
                  left: `calc(50% + ${x}px - 8px)`,
                  top: `calc(50% + ${y}px - 8px)`,
                }}
              >
                {i * 5 === 0 ? "00" : i * 5}
              </div>
            )
          })}

          {/* 시침 */}
          <div
            className="absolute w-1 bg-red-600 origin-bottom rounded-full shadow-lg"
            style={{
              height: "60px",
              left: "calc(50% - 2px)",
              top: "calc(50% - 60px)",
              transform: `rotate(${hourAngle}deg)`,
              transformOrigin: "bottom center",
            }}
          />

          {/* 분침 */}
          <div
            className="absolute w-0.5 bg-gray-600 origin-bottom rounded-full shadow-lg"
            style={{
              height: "80px",
              left: "calc(50% - 1px)",
              top: "calc(50% - 80px)",
              transform: `rotate(${minuteAngle}deg)`,
              transformOrigin: "bottom center",
            }}
          />

          {/* 중심점 */}
          <div className="absolute w-4 h-4 bg-gray-800 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg" />
        </div>
      </div>
    )
  }

  const renderDigitalClock = (hour: number, minute: number) => {
    const displayHour = hour.toString().padStart(2, "0")
    const displayMinute = minute.toString().padStart(2, "0")

    return (
      <div className="w-80 h-32 mx-auto">
        <div className="w-full h-full bg-gray-900 rounded-2xl border-4 border-gray-700 shadow-2xl flex items-center justify-center">
          <div className="text-6xl font-mono font-bold text-green-400 tracking-wider">
            {displayHour}:{displayMinute}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Score Display */}
      <div className="text-center mb-6">
        <div
          className="inline-flex items-center gap-4 bg-white/80 rounded-full px-6 py-3 border-none border-gray-200 shadow-none text-xl">
          <div className="text-green-600 font-semibold">정답: {score.correct}</div>
          <div className="text-gray-500">|</div>
          <div className="text-blue-600 font-semibold">총 문제: {score.total}</div>
          {score.total > 0 && (
            <>
              <div className="text-gray-500">|</div>
              <div className="text-purple-600 font-semibold">
                정답률: {Math.round((score.correct / score.total) * 100)}%
              </div>
            </>
          )}
        </div>
      </div>

        {!currentQuestion ? (
          /* Start Screen */
          <Card className="bg-white border-2 border-blue-300 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <Clock className="w-24 h-24 mx-auto text-blue-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">시간 배우기</h2>
                <p className="text-lg text-gray-600 mb-2">아날로그와 디지털 시계로 시간을 읽어보세요!</p>
                <p className="text-md text-gray-500">Learn to read analog and digital clocks!</p>
              </div>

              <Button
                onClick={startNewQuestion}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-8 py-4 rounded-full font-semibold shadow-lg"
              >
                시작하기 Start! 🕐
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Question Screen */
          <div className="space-y-6 grid grid-cols-2 gap-2">
            {/* Clock Display */}
            <Card className="bg-white border-none shadow-none">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentQuestion.questionText}</h2>
                  <p className="text-lg text-gray-600">이 시계가 가리키는 시간은?</p>
                </div>

                <div className="flex justify-center mb-8">
                  {currentQuestion.displayType === "analog"
                    ? renderAnalogClock(currentQuestion.hour, currentQuestion.minute)
                    : renderDigitalClock(currentQuestion.hour, currentQuestion.minute)}
                </div>
              </CardContent>
            </Card>

            {/* Answer Selection */}
            <Card className="bg-white  border-none shadow-none">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 text-center mb-6">시간을 선택하세요</h3>

                {/* Hour Selection */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">시 (Hour)</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <Button
                        key={hour}
                        onClick={() => setSelectedHour(hour)}
                        className={`h-12 text-lg font-bold rounded-lg border-2 transition-all ${
                          selectedHour === hour
                            ? "bg-blue-500 text-white border-blue-600 shadow-lg scale-105"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        {hour}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Minute Selection */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 text-center">분 (Minute)</h4>
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                      <Button
                        key={minute}
                        onClick={() => setSelectedMinute(minute)}
                        className={`h-12 text-lg font-bold rounded-lg border-2 transition-all ${
                          selectedMinute === minute
                            ? "bg-green-500 text-white border-green-600 shadow-lg scale-105"
                            : "bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50"
                        }`}
                      >
                        {minute.toString().padStart(2, "0")}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Selected Time Display */}
                {(selectedHour !== null || selectedMinute !== null) && (
                  <div className="text-center mb-6">
                    <div className="inline-block bg-gray-100 rounded-lg px-6 py-3 border-2 border-gray-300">
                      <span className="text-2xl font-bold text-gray-800">
                        {selectedHour || "?"}시{" "}
                        {selectedMinute !== null ? selectedMinute.toString().padStart(2, "0") : "?"}분
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  {!showResult ? (
                    <Button
                      onClick={checkAnswer}
                      disabled={selectedHour === null || selectedMinute === null}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full font-semibold disabled:opacity-50"
                    >
                      확인하기 Check! ✓
                    </Button>
                  ) : (
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold mb-4 ${
                          selectedHour === currentQuestion.hour && selectedMinute === currentQuestion.minute
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedHour === currentQuestion.hour && selectedMinute === currentQuestion.minute ? (
                          <div className="flex items-center justify-center gap-2">
                            <Check className="w-8 h-8" />
                            정답입니다! 🎉
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <X className="w-8 h-8" />
                              틀렸어요!
                            </div>
                            <div className="text-lg">
                              정답은 {currentQuestion.hour}시 {currentQuestion.minute.toString().padStart(2, "0")}
                              분입니다.
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={startNewQuestion}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold"
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
      </>
  )
}

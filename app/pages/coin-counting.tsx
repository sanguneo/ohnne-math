import { useState } from "react"
import { Minus, Plus, Coins } from "lucide-react"
import { Card, CardContent } from "~/components/ui/card"
import { Button } from "~/components/ui/button"

const koreanCoins = [
  {
    value: 10,
    color: "bg-amber-100 border-amber-300",
    textColor: "text-amber-800",
    iconColor: "from-amber-300 to-amber-500 border-amber-600 text-amber-900",
  },
  {
    value: 50,
    color: "bg-orange-100 border-orange-300",
    textColor: "text-orange-800",
    iconColor: "from-orange-300 to-orange-500 border-orange-600 text-orange-900",
  },
  {
    value: 100,
    color: "bg-red-100 border-red-300",
    textColor: "text-red-800",
    iconColor: "from-red-300 to-red-500 border-red-600 text-red-900",
  },
  {
    value: 500,
    color: "bg-purple-100 border-purple-300",
    textColor: "text-purple-800",
    iconColor: "from-purple-300 to-purple-500 border-purple-600 text-purple-900",
  },
]

export default function CoinCounting() {
  const [coinCounts, setCoinCounts] = useState<Record<number, number>>({
    10: 0,
    50: 0,
    100: 0,
    500: 0,
  })

  const updateCoinCount = (coinValue: number, change: number) => {
    setCoinCounts((prev) => ({
      ...prev,
      [coinValue]: Math.max(0, prev[coinValue] + change),
    }))
  }

  const totalCoins = Object.values(coinCounts).reduce((sum, count) => sum + count, 0)
  const totalAmount = Object.entries(coinCounts).reduce(
    (sum, [value, count]) => sum + Number.parseInt(value) * count,
    0,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">동전 세기 🪙</h1>
          <p className="text-lg text-gray-600">Korean Coin Counting</p>
        </div>

        {/* Coin Cards - Horizontally Scrollable */}
        <div className="overflow-x-auto pb-4 mb-8">
          <div className="flex gap-4 px-2">
            {koreanCoins.map((coin) => (
              <Card key={coin.value} className={`${coin.color} border-2 w-72 flex-shrink-0 shadow-lg`}>
                <CardContent className="p-6">
                  {/* Mixed Coin Image and Title */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${coin.iconColor} border-4 flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-lg font-bold">₩</span>
                    </div>
                    <div className={`${coin.textColor}`}>
                      <h3 className="text-2xl font-bold">{coin.value}원</h3>
                    </div>
                  </div>

                  {/* Counter */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full border-2 bg-transparent"
                      onClick={() => updateCoinCount(coin.value, -1)}
                      disabled={coinCounts[coin.value] === 0}
                    >
                      <Minus className="h-6 w-6" />
                    </Button>

                    <div className="bg-white rounded-lg px-4 py-2 min-w-[60px] text-center border-2 border-gray-200">
                      <span className="text-2xl font-bold text-gray-800">{coinCounts[coin.value]}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full border-2 bg-transparent"
                      onClick={() => updateCoinCount(coin.value, 1)}
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Visual Coins */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 justify-center min-h-[40px] items-center">
                      {Array.from({ length: coinCounts[coin.value] }, (_, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${coin.iconColor} border-2 flex items-center justify-center text-xs font-bold`}
                        >
                          ₩
                        </div>
                      ))}
                      {/*{coinCounts[coin.value] > 8 && (*/}
                      {/*  <div className="text-sm font-semibold text-gray-600">+{coinCounts[coin.value] - 8}</div>*/}
                      {/*)}*/}
                    </div>
                  </div>

                  {/* Total for this coin */}
                  <div className={`text-center p-3 rounded-lg bg-white/50 ${coin.textColor}`}>
                    <div className="text-sm font-medium">Total</div>
                    <div className="text-xl font-bold">{coinCounts[coin.value] * coin.value}원</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <Card className="bg-white border-2 border-green-300 shadow-xl">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Summary Stats with Graphical Coins */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left">총합 Summary</h2>

                {/* Graphical representation of all coins */}
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <div className="text-gray-600 text-sm font-medium mb-3">All Your Coins</div>
                  <div className="flex flex-wrap gap-2 min-h-[60px] items-center justify-center">
                    {koreanCoins.map((coin) =>
                      Array.from({ length: coinCounts[coin.value] }, (_, i) => (
                        <div
                          key={`${coin.value}-${i}`}
                          className={`w-8 h-8 rounded-full bg-gradient-to-br ${coin.iconColor} border-2 flex items-center justify-center text-xs font-bold shadow-sm`}
                          title={`${coin.value}원`}
                        >
                          ₩
                        </div>
                      )),
                    )}
                    {totalCoins === 0 && (
                      <div className="text-gray-400 text-center py-4">Add some coins to see them here!</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <div className="text-blue-600 text-sm font-medium">Total Coins</div>
                    <div className="text-3xl font-bold text-blue-800">{totalCoins}개</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="text-green-600 text-sm font-medium">Total Amount</div>
                    <div className="text-3xl font-bold text-green-800">{totalAmount}원</div>
                  </div>
                </div>
              </div>

              {/* Coin Jar */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-48 h-56 bg-gradient-to-b from-blue-100 to-blue-200 rounded-t-full border-4 border-blue-400 flex items-end justify-center pb-8 shadow-lg">
                    <Coins className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="w-52 h-8 bg-blue-300 rounded-full border-4 border-blue-400 -mt-2 relative z-10 shadow-lg"></div>
                  <div className="text-center mt-4">
                    <span className="text-lg font-bold text-gray-700">동전 항아리</span>
                  </div>

                  {/* Floating coins animation */}
                  {totalCoins > 0 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex gap-1 animate-bounce">
                        {Array.from({ length: Math.min(3, totalCoins) }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-600"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

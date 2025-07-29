"use client"

import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Coins, Calculator, Clock, Palette, BookOpen, Puzzle, Music, Globe, Star, Heart } from "lucide-react"

const toyPages = [
  {
    id: "coin-counting",
    title: "동전 세기",
    subtitle: "Coin Counting",
    description: "Learn Korean coin values through interactive counting",
    icon: Coins,
    color: "bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-300",
    iconColor: "text-yellow-600",
    available: true,
    path: "/coin-counting",
  },
  {
    id: "math-basics",
    title: "기초 수학",
    subtitle: "Math Basics",
    description: "Addition, subtraction, and number recognition games",
    icon: Calculator,
    color: "bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300",
    iconColor: "text-blue-600",
    available: false,
    path: "/math-basics",
  },
  {
    id: "time-learning",
    title: "시간 배우기",
    subtitle: "Time Learning",
    description: "Interactive clock to learn telling time",
    icon: Clock,
    color: "bg-gradient-to-br from-green-100 to-emerald-100 border-green-300",
    iconColor: "text-green-600",
    available: false,
    path: "/time-learning",
  },
  {
    id: "color-mixing",
    title: "색깔 놀이",
    subtitle: "Color Play",
    description: "Mix colors and learn about primary and secondary colors",
    icon: Palette,
    color: "bg-gradient-to-br from-pink-100 to-rose-100 border-pink-300",
    iconColor: "text-pink-600",
    available: false,
    path: "/color-mixing",
  },
  {
    id: "alphabet-game",
    title: "알파벳 게임",
    subtitle: "Alphabet Game",
    description: "Learn English and Korean letters through fun activities",
    icon: BookOpen,
    color: "bg-gradient-to-br from-purple-100 to-violet-100 border-purple-300",
    iconColor: "text-purple-600",
    available: false,
    path: "/alphabet-game",
  },
  {
    id: "shape-puzzle",
    title: "도형 퍼즐",
    subtitle: "Shape Puzzle",
    description: "Drag and drop shapes to learn geometry basics",
    icon: Puzzle,
    color: "bg-gradient-to-br from-orange-100 to-red-100 border-orange-300",
    iconColor: "text-orange-600",
    available: false,
    path: "/shape-puzzle",
  },
  {
    id: "music-maker",
    title: "음악 만들기",
    subtitle: "Music Maker",
    description: "Create simple melodies and learn about musical notes",
    icon: Music,
    color: "bg-gradient-to-br from-indigo-100 to-blue-100 border-indigo-300",
    iconColor: "text-indigo-600",
    available: false,
    path: "/music-maker",
  },
  {
    id: "world-explorer",
    title: "세계 탐험",
    subtitle: "World Explorer",
    description: "Learn about different countries and their cultures",
    icon: Globe,
    color: "bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-300",
    iconColor: "text-teal-600",
    available: false,
    path: "/world-explorer",
  },
]

export default function EducationalToysHub() {
  const navigate  = useNavigate();
  const handleToyClick = (toy: (typeof toyPages)[0]) => {
    if (toy.available) {
      navigate(toy.path);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Star className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-800">교육 놀이터</h1>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-xl text-gray-600 mb-2">Educational Playground</p>
          <p className="text-lg text-gray-500">재미있게 배우는 어린이 학습 게임</p>
          <div className="flex justify-center mt-4">
            <Heart className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
        </div>

        {/* Toy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {toyPages.map((toy) => {
            const IconComponent = toy.icon
            return (
              <Card
                key={toy.id}
                className={`${toy.color} border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  !toy.available ? "opacity-60" : ""
                }`}
                onClick={() => handleToyClick(toy)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="flex justify-center mb-3">
                    <div
                      className={`w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-md ${
                        !toy.available ? "grayscale" : ""
                      }`}
                    >
                      <IconComponent className={`w-8 h-8 ${toy.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800">{toy.title}</CardTitle>
                  <p className="text-sm font-medium text-gray-600">{toy.subtitle}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 text-center mb-4 min-h-[40px]">{toy.description}</p>

                  {toy.available ? (
                    <Button
                      className="w-full bg-white/80 text-gray-800 hover:bg-white border-2 border-gray-200 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToyClick(toy)
                      }}
                    >
                      놀러가기 Play Now! 🎮
                    </Button>
                  ) : (
                    <Button disabled className="w-full bg-gray-200 text-gray-500 cursor-not-allowed">
                      곧 출시 Coming Soon! ⏰
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white/50 rounded-2xl border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-2">더 많은 게임이 준비 중이에요!</h3>
          <p className="text-gray-600">More educational games are coming soon!</p>
          <div className="flex justify-center gap-2 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 text-yellow-400 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

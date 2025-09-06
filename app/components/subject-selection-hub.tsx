"use client";

import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Calculator, BookOpen, Star, Heart } from "lucide-react";

const subjects = [
  {
    id: "math",
    title: "수학",
    subtitle: "Math",
    description: "재미있는 수학 놀이",
    icon: Calculator,
    color: "bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300",
    iconColor: "text-blue-600",
    path: "/math",
  },
  {
    id: "english",
    title: "영어",
    subtitle: "English",
    description: "재미있는 영어 놀이",
    icon: BookOpen,
    color: "bg-gradient-to-br from-purple-100 to-violet-100 border-purple-300",
    iconColor: "text-purple-600",
    path: "/english",
  },
];

export default function SubjectSelectionHub() {
  const navigate = useNavigate();
  const handleClick = (subject: (typeof subjects)[0]) => {
    navigate(subject.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mt-8 mb-12">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              어떤 과목을 배울까요?
            </h1>
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <Card
                key={subject.id}
                className={`${subject.color} border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                onClick={() => handleClick(subject)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="flex justify-center mb-3">
                    <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center shadow-md">
                      <IconComponent className={`w-8 h-8 ${subject.iconColor}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {subject.title}
                  </CardTitle>
                  <p className="text-sm font-medium text-gray-600">{subject.subtitle}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 text-center mb-4 min-h-[40px]">
                    {subject.description}
                  </p>
                  <Button
                    className="w-full bg-white/80 text-gray-800 hover:bg-white border-2 border-gray-200 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(subject);
                    }}
                  >
                    시작하기 Start Learning 📚
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}


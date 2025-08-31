"use client";

import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Calculator, BookOpen } from "lucide-react";

const subjects = [
  {
    id: "math",
    title: "수학",
    subtitle: "Math",
    description: "재미있는 수학 놀이",
    icon: Calculator,
    color: "bg-gradient-to-r from-sky-400 to-blue-600",
    iconColor: "text-white",
    path: "/math",
  },
  {
    id: "english",
    title: "영어",
    subtitle: "English",
    description: "재미있는 영어 놀이",
    icon: BookOpen,
    color: "bg-gradient-to-r from-purple-400 to-fuchsia-600",
    iconColor: "text-white",
    path: "/english",
  },
];

export default function SubjectSelectionHub() {
  const navigate = useNavigate();
  const handleClick = (subject: (typeof subjects)[0]) => {
    navigate(subject.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          어떤 과목을 배울까요?
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {subjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <Card
                key={subject.id}
                className={`${subject.color} text-white cursor-pointer hover:shadow-xl transition-transform hover:scale-[1.02]`}
                onClick={() => handleClick(subject)}
              >
                <CardHeader className="flex items-center justify-between pb-0 text-white">
                  <CardTitle className="text-xl font-semibold">
                    {subject.title}
                  </CardTitle>
                  <IconComponent className="w-10 h-10" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm opacity-90">{subject.description}</p>
                </CardContent>
                <CardContent className="pt-0">
                  <Button
                    className="mt-4 bg-white/90 text-gray-800 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(subject);
                    }}
                  >
                    시작하기
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


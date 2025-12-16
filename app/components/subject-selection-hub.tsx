"use client";

import { useNavigate } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Calculator, BookOpen, Sparkles } from "lucide-react";

const subjects = [
  {
    id: "math",
    title: "수학",
    subtitle: "Math",
    description: "재미있는 숫자 놀이와 도형 탐험",
    icon: Calculator,
    path: "/math",
  },
  {
    id: "english",
    title: "영어",
    subtitle: "English",
    description: "새로운 단어와 이야기 배우기",
    icon: BookOpen,
    path: "/english",
  },
];

export default function SubjectSelectionHub() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl w-full mx-auto z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">Learning Hub</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            오늘은 무엇을 배워볼까요?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            원하는 과목을 선택해서 즐거운 학습 여행을 떠나보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-12">
          {subjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <Card
                key={subject.id}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm"
                onClick={() => navigate(subject.path)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="p-8 flex flex-col items-center text-center h-full relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-black/5">
                    <IconComponent className="w-10 h-10 text-primary" />
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {subject.title}
                  </h2>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
                    {subject.subtitle}
                  </span>

                  <p className="text-muted-foreground mb-8 line-clamp-2">
                    {subject.description}
                  </p>

                  <Button
                    className="w-full mt-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-semibold h-12 rounded-xl text-base"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(subject.path);
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


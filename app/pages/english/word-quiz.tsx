import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

interface QuizItem {
  id?: string;
  question: string;
  options: string[];
  answer: number; // index of correct option
  explanation?: string;
  word?: string;
  kind?: string; // synonyms, antonyms, wordpairs
}

interface QuizResponse {
  _metadata: { date: string };
  synonyms: QuizItem[];
  antonyms: QuizItem[];
  wordpairs: QuizItem[];
}

const baseUrl = `${import.meta.env.VITE_APIBASE}/english`;
const sessionId = "kid-001";

export default function WordQuizPage() {
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [date, setDate] = useState<string>("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    fetch(`${baseUrl}/word-quiz`)
      .then((res) => res.json())
      .then((data: QuizResponse) => {
        const items: QuizItem[] = [
          ...(data.synonyms || []).map((q) => ({ ...q, kind: "synonyms" })),
          ...(data.antonyms || []).map((q) => ({ ...q, kind: "antonyms" })),
          ...(data.wordpairs || []).map((q) => ({ ...q, kind: "wordpairs" })),
        ];
        setQuiz(items);
        setDate(data._metadata?.date || "");
        setAnswers(Array(items.length).fill(null));
      });
  }, []);

  const handleSelect = (option: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = option;
      return next;
    });
  };

  const handleNext = () => {
    setCurrent((c) => Math.min(c + 1, quiz.length - 1));
  };

  const handlePrev = () => {
    setCurrent((c) => Math.max(c - 1, 0));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setReviewIndex(0);
  };

  const finishReview = async () => {
    try {
      // mark quiz learned
      if (date) {
        await fetch(`${baseUrl}/word-quiz/${date}/learned`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      }
      // save learned words
      await fetch(`${baseUrl}/learned-words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          items: quiz.map((q) => ({
            word: q.word || q.question,
            kind: q.kind || "",
            note: q.explanation || "",
          })),
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const nextReview = () => {
    if (reviewIndex === quiz.length - 1) {
      finishReview();
    } else {
      setReviewIndex((i) => i + 1);
    }
  };

  if (quiz.length === 0) {
    return <div className="p-4">Loading...</div>;
  }

  if (!submitted) {
    const q = quiz[current];
    const allAnswered = answers.every((a) => a !== null && a !== undefined);
    return (
      <div className="p-4 max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">오늘의 단어 학습</h2>
        <p className="font-semibold">문제 {current + 1} / {quiz.length}</p>
        <p>{q.question}</p>
        <ul className="space-y-2">
          {q.options.map((opt, i) => (
            <li key={i}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q-${current}`}
                  checked={answers[current] === i}
                  onChange={() => handleSelect(i)}
                />
                {opt}
              </label>
            </li>
          ))}
        </ul>
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrev} disabled={current === 0}>
            이전
          </Button>
          {current === quiz.length - 1 ? (
            <Button onClick={handleSubmit} disabled={!allAnswered}>
              채점
            </Button>
          ) : (
            <Button onClick={handleNext}>다음</Button>
          )}
        </div>
      </div>
    );
  }

  const q = quiz[reviewIndex];
  const userAnswer = answers[reviewIndex];

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">문제 리뷰 {reviewIndex + 1} / {quiz.length}</h2>
      <p>{q.question}</p>
      <ul className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.answer;
          const isSelected = i === userAnswer;
          return (
            <li key={i}>
              <div
                className={`flex items-center justify-between p-2 border rounded ${
                  isCorrect ? "border-green-500" : ""
                } ${
                  isSelected && !isCorrect ? "border-red-500" : ""
                } ${isSelected ? "bg-gray-100" : ""}`}
              >
                <span>{opt}</span>
                {isCorrect ? (
                  <span className="text-green-500">✓</span>
                ) : (
                  isSelected && <span className="text-red-500">✕</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {q.explanation && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <p className="font-semibold">해설</p>
          <p>{q.explanation}</p>
        </div>
      )}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setReviewIndex((i) => Math.max(i - 1, 0))} disabled={reviewIndex === 0}>
          이전
        </Button>
        <Button onClick={nextReview}>
          {reviewIndex === quiz.length - 1 ? "완료" : "다음"}
        </Button>
      </div>
    </div>
  );
}


import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

interface LearnedWord {
  id: string;
  word: string;
  kind: string;
  note?: string;
}

const baseUrl = `${import.meta.env.VITE_APIBASE}/english`;
const sessionId = "kid-001";

export default function LearnedWordsPage() {
  const [words, setWords] = useState<LearnedWord[]>([]);

  const loadWords = () => {
    fetch(`${baseUrl}/learned-words?sessionId=${sessionId}&limit=50`)
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : data.items;
        setWords(items || []);
      });
  };

  useEffect(() => {
    loadWords();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`${baseUrl}/learned-words/${id}?sessionId=${sessionId}`, {
      method: "DELETE",
    });
    loadWords();
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">배운 단어</h2>
      {words.length === 0 ? (
        <p>아직 배운 단어가 없어요.</p>
      ) : (
        <ul className="space-y-2">
          {words.map((w) => (
            <li key={w.id} className="border p-2 rounded flex justify-between items-start gap-4">
              <div>
                <p className="font-semibold">{w.word}</p>
                <p className="text-sm text-gray-600">{w.note}</p>
              </div>
              <Button variant="dangerGradient" size="sm" onClick={() => handleDelete(w.id)}>
                삭제
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


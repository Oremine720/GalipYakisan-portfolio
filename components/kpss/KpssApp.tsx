"use client";

import { useState } from "react";
import KpssHome from "./KpssHome";
import SubjectPicker from "./SubjectPicker";
import QuizRunner from "./QuizRunner";
import ExamSetup from "./ExamSetup";
import ExamRunner from "./ExamRunner";
import ResultView from "./ResultView";
import FavoritesView from "./FavoritesView";
import StatsView from "./StatsView";
import type { FinishedSession } from "@/lib/kpss/session";

type Mode = "study" | "exam";

type View =
  | { k: "home" }
  | { k: "pick"; mode: Mode }
  | { k: "study"; subjectId: string | null; onlyIds?: string[]; title?: string }
  | { k: "examSetup"; subjectId: string | null }
  | { k: "exam"; subjectId: string | null; size: number }
  | { k: "result"; session: FinishedSession }
  | { k: "favorites" }
  | { k: "stats" };

export default function KpssApp() {
  const [view, setView] = useState<View>({ k: "home" });
  const home = () => setView({ k: "home" });

  const restart = (session: FinishedSession) => {
    if (session.mode === "exam") {
      setView({
        k: "exam",
        subjectId: session.subjectId,
        size: session.questions.length,
      });
    } else {
      setView({ k: "study", subjectId: session.subjectId });
    }
  };

  switch (view.k) {
    case "home":
      return (
        <KpssHome
          onPick={(mode) => setView({ k: "pick", mode })}
          onFavorites={() => setView({ k: "favorites" })}
          onStats={() => setView({ k: "stats" })}
        />
      );

    case "pick":
      return (
        <SubjectPicker
          mode={view.mode}
          onBack={home}
          onChoose={(subjectId) =>
            view.mode === "study"
              ? setView({ k: "study", subjectId })
              : setView({ k: "examSetup", subjectId })
          }
        />
      );

    case "study":
      return (
        <QuizRunner
          subjectId={view.subjectId}
          onlyIds={view.onlyIds}
          titleOverride={view.title}
          onExit={home}
          onFinish={(session) => setView({ k: "result", session })}
        />
      );

    case "examSetup":
      return (
        <ExamSetup
          subjectId={view.subjectId}
          onBack={() => setView({ k: "pick", mode: "exam" })}
          onStart={(size) => setView({ k: "exam", subjectId: view.subjectId, size })}
        />
      );

    case "exam":
      return (
        <ExamRunner
          subjectId={view.subjectId}
          size={view.size}
          onExit={home}
          onFinish={(session) => setView({ k: "result", session })}
        />
      );

    case "result":
      return (
        <ResultView
          session={view.session}
          onRestart={() => restart(view.session)}
          onExit={home}
        />
      );

    case "favorites":
      return (
        <FavoritesView
          onExit={home}
          onStudy={(ids) =>
            setView({ k: "study", subjectId: null, onlyIds: ids, title: "Favoriler" })
          }
        />
      );

    case "stats":
      return (
        <StatsView
          onExit={home}
          onStudyWrong={(ids) =>
            setView({ k: "study", subjectId: null, onlyIds: ids, title: "Yanlışlar" })
          }
        />
      );
  }
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Phase = "form" | "submitting" | "done" | "error";

const PLACEHOLDER =
  "שאל/י כאילו הוא/היא חבר/ה שלך — בשפה חופשית...";

const EXAMPLE_PROMPTS = [
  "עד מתי הכלבו פתוח היום?",
  "למי אפשר לפנות בנושא רכבים בקיבוץ?",
  "מה הזכויות שלי בתור חבר קיבוץ סעד?",
  "מתי השער הישן נפתח?"
];

export default function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (phase === "form") textareaRef.current?.focus();
  }, [phase]);

  const canSubmit = question.trim().length >= 4 && phase === "form";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setPhase("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error();
      setPhase("done");
    } catch {
      setPhase("error");
    }
  };

  const handleRetry = () => {
    setPhase("form");
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.72 0.15 185 / 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-64"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, oklch(0.55 0.18 260 / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-3xl">🏠</span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            זה הבית
          </h1>
        </div>
        <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">
          קהילת סעד
        </p>
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
        className="w-full max-w-xl"
      >
        <div
          className="rounded-3xl border p-8 shadow-2xl relative"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.018 240) 0%, oklch(0.15 0.015 235) 100%)",
            boxShadow:
              "0 25px 60px -12px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.06), inset 0 1px 0 oklch(1 0 0 / 0.08)",
          }}
        >
          {/* Friend avatar */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.15 185) 0%, oklch(0.6 0.18 210) 100%)",
                boxShadow: "0 0 20px oklch(0.72 0.15 185 / 0.3)",
              }}
            >
              🤝
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                החבר שלך בקבוצת "סעד זה הבית"
              </p>
              <p className="text-xs text-muted-foreground">
                יודע הכל • כאן בשבילך • תמיד זמין
              </p>
            </div>
            <div className="mr-auto flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">מחובר</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {phase !== "done" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                {/* The question */}
                <div className="mb-6">
                  <p className="text-lg font-semibold leading-relaxed text-foreground mb-1">
                    מה היית שואל/ת אותו?
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    אם היה לך חבר שיודע את כל התשובות בנושא סעד — בשפה
                    חופשית, עם תשובות מיידיות ועם מענה מדויק לשאלות — מה היית שואל/ת?
                  </p>
                </div>

                {/* Textarea */}
                <div className="relative mb-4">
                  <Textarea
                    ref={textareaRef}
                    value={question}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={PLACEHOLDER}
                    rows={5}
                    disabled={phase === "submitting"}
                    className="w-full resize-none rounded-2xl border text-base leading-relaxed transition-all duration-200 placeholder:text-muted-foreground/50"
                    style={{
                      background: "oklch(0.12 0.012 240)",
                      borderColor:
                        question.length > 0
                          ? "oklch(0.72 0.15 185 / 0.4)"
                          : "oklch(1 0 0 / 0.08)",
                      boxShadow:
                        question.length > 0
                          ? "0 0 0 3px oklch(0.72 0.15 185 / 0.1)"
                          : "none",
                      outline: "none",
                    }}
                  />
                  {charCount > 0 && (
                    <span className="absolute bottom-3 left-3 text-xs text-muted-foreground/50 select-none">
                      {charCount}
                    </span>
                  )}
                </div>

                {/* Example prompts */}
                {question.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-5"
                  >
                    <p className="text-xs text-muted-foreground mb-2">
                      לדוגמה:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {EXAMPLE_PROMPTS.map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setQuestion(p);
                            setCharCount(p.length);
                            textareaRef.current?.focus();
                          }}
                          className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 cursor-pointer"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Helper text */}
                <p className="text-xs text-muted-foreground mb-5 text-center">
                  אין תשובה נכונה או לא נכונה. כתוב/י בחופשיות.{" "}
                  <span className="opacity-60">Enter לשליחה</span>
                </p>

                {/* Submit button */}
                <motion.div
                  whileTap={canSubmit ? { scale: 0.97 } : {}}
                  whileHover={canSubmit ? { scale: 1.01 } : {}}
                >
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="w-full h-12 text-base font-semibold rounded-2xl transition-all duration-200"
                    style={
                      canSubmit
                        ? {
                          background:
                            "linear-gradient(135deg, oklch(0.72 0.15 185) 0%, oklch(0.65 0.18 200) 100%)",
                          color: "oklch(0.1 0.01 240)",
                          boxShadow: "0 4px 20px oklch(0.72 0.15 185 / 0.35)",
                        }
                        : {}
                    }
                  >
                    {phase === "submitting" ? (
                      <span className="flex items-center gap-2">
                        <Spinner />
                        שולח...
                      </span>
                    ) : (
                      "שלח/י את השאלה שלי 💙"
                    )}
                  </Button>
                </motion.div>

                {phase === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-center text-sm text-destructive"
                  >
                    משהו השתבש.{" "}
                    <button
                      onClick={handleRetry}
                      className="underline cursor-pointer hover:no-underline"
                    >
                      נסה/י שוב
                    </button>
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.15,
                    type: "spring",
                    stiffness: 260,
                    damping: 18,
                  }}
                  className="text-6xl mb-5"
                >
                  💙
                </motion.div>
                <h2 className="text-2xl font-bold mb-3 text-foreground">
                  תודה רבה!
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  השאלה שלך התקבלה בהצלחה!.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-7">
                  ניתן למלא שוב עם שאלות נוספות🤝
                </p>
                <button
                  onClick={() => {
                    setQuestion("");
                    setCharCount(0);
                    setPhase("form");
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors cursor-pointer"
                >
                  יש לי שאלה נוספת
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-xs text-muted-foreground/50 text-center"
      >
        המידע שתשתף/י ישמש את חברי הקיבוץ לבניית פיתרון משמעותי עבור כולנו
      </motion.p>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

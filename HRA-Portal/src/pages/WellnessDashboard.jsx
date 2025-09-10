// src/pages/WellnessDashboard.jsx
import {
  Bell,
  CheckCircle,
  Clock,
  Download,
  Droplet,
  Frown,
  Heart,
  HeartPulse,
  Meh,
  Plus,
  RefreshCcw,
  Smile,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * Wellness & Mental Health
 *
 * - Pure React + Tailwind (no 3rd-party UI libs)
 * - Persists to localStorage so employees see their history
 * - Many features implemented as self-contained logic that you can
 *   later wire to your backend APIs.
 *
 * NOTE: This file is intentionally verbose and feature-rich to serve
 * as a near-production-ready component that you can extend.
 */

/* -------------------------
   Utility helpers
   ------------------------- */
const LS_KEY = "ems_wellness_v1";

const todayKey = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse localStorage", e);
    return null;
  }
}

function saveToStorage(payload) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}

// Friendly date
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/* -------------------------
   Default sample data
   ------------------------- */
const SAMPLE = {
  meta: {
    createdAt: new Date().toISOString(),
    hydrationGoal: 8,
  },
  daily: {
    // keyed by date YYYY-MM-DD
    // sample week data
    [todayKey()]: {
      mood: "neutral",
      moodNote: "Busy morning, feeling okay.",
      stress: 5,
      hydration: 2,
      activities: [
        {
          id: "a1",
          type: "mood",
          text: "Checked in",
          ts: new Date().toISOString(),
        },
      ],
    },
  },
  timeline: [
    // fallback timeline entries
  ],
};

/* -------------------------
   Toast (simple)
   ------------------------- */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(
        () => setToasts((s) => s.filter((x) => x.id !== t.id)),
        t.duration || 3500
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);
  const push = (msg, opts = {}) =>
    setToasts((s) => [
      ...s,
      { id: `${Date.now()}-${Math.random()}`, msg, ...opts },
    ]);
  return {
    toasts,
    push,
    remove: (id) => setToasts((s) => s.filter((t) => t.id !== id)),
  };
}

/* -------------------------
   Main component
   ------------------------- */
export default function WellnessDashboard() {
  // state backed by localStorage
  const [store, setStore] = useState(() => {
    const loaded = loadFromStorage();
    return loaded || SAMPLE;
  });

  // derived for today
  const [today, setToday] = useState(
    () =>
      store.daily?.[todayKey()] || {
        mood: null,
        stress: 0,
        hydration: 0,
        moodNote: "",
        activities: [],
      }
  );

  // UI/UX state
  const [stressInput, setStressInput] = useState(today.stress || 0);
  const [moodNote, setMoodNote] = useState(today.moodNote || "");
  const [hydrationCount, setHydrationCount] = useState(today.hydration || 0);
  const [anonymous, setAnonymous] = useState(true);
  const [feedbackText, setFeedbackText] = useState("");
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [breakTimer, setBreakTimer] = useState(null);
  const [isTakingBreak, setIsTakingBreak] = useState(false);
  const { toasts, push: pushToast } = useToasts();

  const breathingRef = useRef({ step: 0, interval: null, remaining: 120 });

  // Keep derived states in sync when store changes (e.g. load sample or clear)
  useEffect(() => {
    const t = store.daily?.[todayKey()];
    setToday(
      t || { mood: null, stress: 0, hydration: 0, moodNote: "", activities: [] }
    );
    setStressInput((t && t.stress) || 0);
    setHydrationCount((t && t.hydration) || 0);
    setMoodNote((t && t.moodNote) || "");
  }, [store]);

  // persist store on change
  useEffect(() => {
    saveToStorage(store);
  }, [store]);

  /* -------------------------
     Data helpers & analytics
     ------------------------- */

  const weekStress = useMemo(() => {
    // generate last 7 days data points
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const val = store.daily?.[key]?.stress ?? null;
      arr.push({
        day: d.toLocaleDateString(undefined, { weekday: "short" }),
        stress: val === null ? 0 : val,
        key,
        has: val !== null,
      });
    }
    return arr;
  }, [store]);

  const avgStress = useMemo(() => {
    const vals = weekStress.filter((d) => d.has).map((d) => d.stress);
    if (!vals.length) return 0;
    return (
      Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
    );
  }, [weekStress]);

  const streak = useMemo(() => {
    // consecutive days with any checkin
    let s = 0;
    for (let i = 0; ; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (store.daily?.[key]) s++;
      else break;
    }
    return s;
  }, [store]);

  /* -------------------------
     Actions
     ------------------------- */

  function saveToday(mood) {
    const key = todayKey();
    const now = new Date().toISOString();
    const dayObj = {
      mood: mood ?? (today && today.mood) ?? null,
      moodNote,
      stress: clamp(Number(stressInput), 0, 10),
      hydration: hydrationCount,
      activities: [
        ...(store.daily?.[key]?.activities || []),
        {
          id: `act-${Date.now()}`,
          type: "save",
          text: `Saved check-in`,
          ts: now,
        },
      ],
    };
    const newStore = {
      ...store,
      daily: { ...(store.daily || {}), [key]: dayObj },
      timeline: [
        {
          id: `t-${Date.now()}`,
          type: "checkin",
          mood: dayObj.mood,
          stress: dayObj.stress,
          hydration: dayObj.hydration,
          ts: now,
        },
        ...(store.timeline || []),
      ].slice(0, 500),
    };
    setStore(newStore);
    pushToast("Today's check-in saved ✔️");
  }

  function setMood(m) {
    // set mood in UI, but don't persist until Save pressed
    setToday((t) => ({ ...t, mood: m }));
    // immediate small persistence for UX
    const key = todayKey();
    const shallow = { ...(store.daily?.[key] || {}) };
    shallow.mood = m;
    shallow.moodNote = moodNote;
    shallow.stress = clamp(Number(stressInput), 0, 10);
    shallow.hydration = hydrationCount;
    shallow.activities = [
      ...(shallow.activities || []),
      {
        id: `act-${Date.now()}`,
        type: "mood",
        text: `Mood set to ${m}`,
        ts: new Date().toISOString(),
      },
    ];
    const newStore = {
      ...store,
      daily: { ...(store.daily || {}), [key]: shallow },
    };
    setStore(newStore);
    pushToast(`Mood set to ${m}`);
  }

  function quickHydrate(amount = 1) {
    setHydrationCount((s) => {
      const n = s + amount;
      setToday((t) => ({ ...t, hydration: n }));
      const key = todayKey();
      const shallow = { ...(store.daily?.[key] || {}) };
      shallow.hydration = n;
      shallow.activities = [
        ...(shallow.activities || []),
        {
          id: `act-${Date.now()}`,
          type: "hydration",
          text: `+${amount} water`,
          ts: new Date().toISOString(),
        },
      ];
      setStore((prev) => ({
        ...prev,
        daily: { ...(prev.daily || {}), [key]: shallow },
      }));
      return n;
    });
    pushToast("Logged water 💧");
  }

  function submitFeedback() {
    if (!feedbackText.trim()) {
      pushToast("Feedback is empty — please write something so HR can help.");
      return;
    }
    // In real app: POST to /api/wellness/feedback with { text, anonymous }
    // For now append to timeline and clear
    const now = new Date().toISOString();
    const entry = {
      id: `fb-${Date.now()}`,
      type: "feedback",
      text: feedbackText.trim(),
      anonymous,
      ts: now,
    };
    setStore((prev) => ({
      ...prev,
      timeline: [entry, ...(prev.timeline || [])],
    }));
    setFeedbackText("");
    pushToast("Feedback submitted — HR notified");
  }

  function exportJSON() {
    const data = JSON.stringify(store, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wellness-export-${todayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    pushToast("Exported data as JSON");
  }

  function clearData(confirm = false) {
    if (!confirm) {
      if (!window.confirm("Clear all wellness data? This cannot be undone."))
        return;
    }
    setStore({
      meta: { createdAt: new Date().toISOString(), hydrationGoal: 8 },
      daily: {},
      timeline: [],
    });
    pushToast("All wellness data cleared");
  }

  function loadSample() {
    setStore(SAMPLE);
    pushToast("Loaded sample data");
  }

  /* -------------------------
     Break Timer & Breathing
     ------------------------- */
  useEffect(() => {
    let timer;
    if (isTakingBreak && breakTimer > 0) {
      timer = setTimeout(() => setBreakTimer((t) => t - 1), 1000);
    } else if (isTakingBreak && breakTimer === 0) {
      setIsTakingBreak(false);
      pushToast("Break ended — welcome back!");
    }
    return () => clearTimeout(timer);
  }, [isTakingBreak, breakTimer]);

  function startBreak(seconds = 300) {
    setBreakTimer(seconds);
    setIsTakingBreak(true);
    pushToast("Break started — relax a little");
  }

  function startBreathing() {
    // breathingRef manages steps: inhale 4s, hold 4s, exhale 6s (repeat)
    breathingRef.current.remaining = 120;
    breathingRef.current.step = 0;
    setBreathingOpen(true);
    // we won't rely on interval here (complexity) — simple countdown while modal open
  }

  /* -------------------------
     Activity list helpers
     ------------------------- */
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const timeline = store.timeline || [];
  const totalPages = Math.max(1, Math.ceil(timeline.length / pageSize));
  const pageEntries = timeline.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  );

  function removeTimelineItem(id) {
    setStore((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((t) => t.id !== id),
    }));
    pushToast("Removed item");
  }

  /* -------------------------
     Simple Recommendations engine (very basic rules)
     ------------------------- */
  const recommendations = useMemo(() => {
    const recs = [];
    if ((today && today.stress >= 7) || avgStress >= 6) {
      recs.push({
        id: "r1",
        title: "High stress detected",
        text: "Try a short break or guided breathing (2 minutes).",
      });
    } else if ((today && today.stress >= 4) || avgStress >= 4) {
      recs.push({
        id: "r2",
        title: "Moderate stress",
        text: "Take a 5-minute walk and hydrate.",
      });
    } else {
      recs.push({
        id: "r3",
        title: "All looking good",
        text: "Keep up the good balance — maintain hydration and short breaks.",
      });
    }
    if (today && today.hydration < (store.meta?.hydrationGoal || 8)) {
      recs.push({
        id: "r4",
        title: "Hydration goal",
        text: `You've had ${today.hydration || 0} glasses — aim for ${
          store.meta?.hydrationGoal || 8
        }.`,
      });
    }
    return recs;
  }, [today, avgStress, store]);

  /* -------------------------
     Small UI helpers
     ------------------------- */
  function niceMoodLabel(m) {
    if (!m) return "No check-in";
    if (m === "happy") return "Happy";
    if (m === "neutral") return "Neutral";
    if (m === "stressed") return "Stressed";
    return m;
  }

  /* -------------------------
     JSX: large UI
     ------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      {/* Top header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Wellness & Mental Health
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Daily check-ins, stress tracking, hydration, guided breaks, and
              confidential feedback.
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={exportJSON}
              aria-label="Export data"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition"
            >
              <Download size={16} /> Export
            </button>

            <button
              onClick={() => clearData(false)}
              aria-label="Clear data"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition"
            >
              <Trash2 size={16} /> Clear
            </button>

            <button
              onClick={loadSample}
              aria-label="Load sample"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <RefreshCcw size={16} /> Load Sample
            </button>
          </div>
        </div>

        {/* Stats & Quick summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-50">
              <Smile size={22} className="text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Today's Mood</div>
              <div className="font-semibold text-gray-800">
                {niceMoodLabel(today?.mood)}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-50">
              <HeartPulse size={22} className="text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg Stress (7d)</div>
              <div className="font-semibold text-gray-800">{avgStress}</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <Droplet size={22} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Water</div>
              <div className="font-semibold text-gray-800">
                {today.hydration || 0}/{store.meta?.hydrationGoal || 8} glasses
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-50">
              <CheckCircle size={22} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Streak</div>
              <div className="font-semibold text-gray-800">{streak} days</div>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: check-in + hydration + recommendations */}
          <div className="space-y-6">
            {/* Check-in card */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Daily Check-In
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Tell us how you feel — it helps us support you.
                  </p>
                </div>
                <div className="text-sm text-gray-400">Date: {todayKey()}</div>
              </div>

              <div className="mt-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setMood("happy")}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 ${
                      today.mood === "happy"
                        ? "bg-green-500 text-white border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-green-50"
                    }`}
                    aria-pressed={today.mood === "happy"}
                  >
                    <Smile /> Happy
                  </button>

                  <button
                    onClick={() => setMood("neutral")}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 ${
                      today.mood === "neutral"
                        ? "bg-yellow-500 text-white border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-yellow-50"
                    }`}
                    aria-pressed={today.mood === "neutral"}
                  >
                    <Meh /> Neutral
                  </button>

                  <button
                    onClick={() => setMood("stressed")}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition flex items-center justify-center gap-2 ${
                      today.mood === "stressed"
                        ? "bg-red-500 text-white border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-red-50"
                    }`}
                    aria-pressed={today.mood === "stressed"}
                  >
                    <Frown /> Stressed
                  </button>
                </div>

                <label className="block mt-4 text-sm text-gray-600">
                  Optional note
                </label>
                <textarea
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  className="w-full mt-2 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Write a short note about how you feel (private to HR)"
                />

                <label className="block mt-4 text-sm text-gray-600">
                  Stress level: {stressInput}
                </label>
                <input
                  aria-label="stress slider"
                  type="range"
                  min={0}
                  max={10}
                  value={stressInput}
                  onChange={(e) => setStressInput(Number(e.target.value))}
                  className="w-full mt-1"
                />

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      saveToday(today.mood || "neutral");
                      // update local note/stress/hydration into storage (already handled)
                    }}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Save Check-In
                  </button>

                  <button
                    onClick={() => {
                      setStressInput(0);
                      setHydrationCount(0);
                      setMoodNote("");
                      pushToast("Inputs reset");
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => startBreathing()}
                    className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    <Heart /> Breathe (2m)
                  </button>
                </div>
              </div>
            </section>

            {/* Hydration + quick actions */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Hydration</h3>
                <div className="text-sm text-gray-500">
                  Goal: {store.meta?.hydrationGoal || 8}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-500">Glasses today</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {hydrationCount}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => quickHydrate(1)}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={16} /> +1
                  </button>
                  <button
                    onClick={() => quickHydrate(2)}
                    className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 flex items-center gap-2"
                  >
                    +2
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-500">Set goal</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={store.meta?.hydrationGoal || 8}
                  onChange={(e) =>
                    setStore((prev) => ({
                      ...prev,
                      meta: {
                        ...(prev.meta || {}),
                        hydrationGoal: Number(e.target.value),
                      },
                    }))
                  }
                  className="mt-2 w-32 p-2 rounded-lg border"
                />
              </div>
            </section>

            {/* Recommendations */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-800">Recommendations</h3>
              <div className="mt-3 space-y-3">
                {recommendations.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{r.title}</div>
                        <div className="text-sm text-gray-600">{r.text}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => startBreak(300)}
                          className="px-3 py-1 rounded-lg text-sm bg-yellow-50 border hover:bg-yellow-100"
                        >
                          Take 5m break
                        </button>
                        <button
                          onClick={() => startBreathing()}
                          className="px-3 py-1 rounded-lg text-sm bg-green-50 border hover:bg-green-100"
                        >
                          Guided breathe
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-xs text-gray-400">
                  Tip: Your inputs are private and only HR can view feedback.
                </div>
              </div>
            </section>
          </div>

          {/* Middle column: charts and timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly stress chart */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Weekly Stress Trend
                  </h3>
                  <div className="text-sm text-gray-500">
                    Visualize your stress over the last 7 days
                  </div>
                </div>
                <div className="text-sm text-gray-500">Avg: {avgStress}</div>
              </div>

              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekStress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Timeline & activities */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Activity Timeline
                </h3>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">
                    Total: {timeline.length}
                  </div>
                  <button
                    onClick={() => setPage(1)}
                    className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm"
                  >
                    First
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {pageEntries.length === 0 && (
                  <div className="text-sm text-gray-500">
                    No recent activity
                  </div>
                )}
                {pageEntries.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-start justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {e.type === "feedback"
                          ? "Feedback"
                          : e.type === "checkin"
                          ? "Check-in"
                          : e.type}
                        {e.anonymous ? " (anonymous)" : ""}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(e.ts)}
                      </div>
                      <div className="mt-1 text-sm text-gray-700">
                        {e.text ?? (e.mood ? `Mood: ${e.mood}` : "")}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeTimelineItem(e.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {page} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>

            {/* Feedback panel */}
            <section className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Confidential Feedback
                </h3>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-500">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={() => setAnonymous((s) => !s)}
                      className="h-4 w-4"
                    />
                    Send anonymously
                  </label>
                </div>
              </div>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share anything you want HR to know. This is confidential."
                className="w-full mt-4 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-200"
                rows={4}
              />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={submitFeedback}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    setFeedbackText("");
                    pushToast("Feedback cleared");
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-50"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setFeedbackText(
                      "I would like to talk with HR about workload management."
                    );
                    setAnonymous(false);
                  }}
                  className="ml-auto px-3 py-2 rounded-lg bg-yellow-50"
                >
                  Suggest text
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Footer quick actions + break timer */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => startBreak(300)}
              className="px-4 py-2 rounded-lg bg-yellow-500 text-white"
            >
              Start 5m Break
            </button>
            <button
              onClick={() => startBreak(600)}
              className="px-4 py-2 rounded-lg bg-yellow-600 text-white"
            >
              Start 10m Break
            </button>
            <button
              onClick={() => startBreathing()}
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
            >
              Start Breathing
            </button>
          </div>

          <div className="text-sm text-gray-500">
            If you need urgent support, contact HR or your manager. This
            dashboard is to help daily wellbeing.
          </div>
        </div>

        {/* Breathing modal / small overlay */}
        {breathingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">
                  Guided Breathing — 2 minutes
                </h4>
                <button
                  onClick={() => setBreathingOpen(false)}
                  className="text-sm text-gray-500"
                >
                  Close
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Follow the breathing rhythm: Inhale — Hold — Exhale. Repeat
                  slowly.
                </p>

                {/* Simple visual circle & instruction (non-audio) */}
                <div className="mt-6 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center text-3xl font-bold text-white">
                    Breathe
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    When ready, press Start
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setBreathingOpen(false);
                        pushToast("Breathing canceled");
                      }}
                      className="px-3 py-2 rounded-lg bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setBreathingOpen(false);
                        startBreak(120);
                        pushToast("Guided breathing started");
                      }}
                      className="px-3 py-2 rounded-lg bg-green-600 text-white"
                    >
                      Start 2m
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Break timer compact indicator */}
        {isTakingBreak && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-xl">
              <Clock size={18} />
              <div className="text-sm">
                Break — {Math.floor(breakTimer / 60)}:
                {String(breakTimer % 60).padStart(2, "0")}
              </div>
              <button
                onClick={() => {
                  setIsTakingBreak(false);
                  setBreakTimer(null);
                  pushToast("Break stopped");
                }}
                className="ml-3 text-sm px-2 py-1 rounded-lg bg-red-50"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Toasts */}
        <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="bg-white px-4 py-2 rounded-md shadow-md border flex items-center gap-3"
            >
              <Bell size={16} />
              <div className="text-sm">{t.msg}</div>
            </div>
          ))}
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
}

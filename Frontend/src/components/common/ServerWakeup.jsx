import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HEALTH_URL = "https://outfy-backend.onrender.com/api/health";

// Only show the loader if the server hasn't responded within this many ms
// This means: server is confirmed sleeping
const SHOW_LOADER_AFTER_MS = 5000;

// How often to retry after a failed ping
const PING_INTERVAL_MS = 4000;

// Max time we'll retry before giving up and proceeding anyway
const MAX_WAIT_MS = 90_000;

const STATUS_MESSAGES = [
  "Waking up the server…",
  "Brewing the backend…",
  "Almost there, hold tight…",
  "Connecting to Outfy servers…",
  "Server is warming up…",
  "Just a few more seconds…",
];

export default function ServerWakeup({ onReady }) {
  // "hidden" = server responded fast, no loader needed
  // "visible" = server is sleeping, show loader
  const [visible, setVisible] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [dots, setDots] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(0);

  const startRef = useRef(Date.now());
  const resolvedRef = useRef(false);
  const loaderTimerRef = useRef(null);
  const retryIntervalRef = useRef(null);
  const giveUpRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Animated dots
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 500);
    return () => clearInterval(id);
  }, []);

  // Rotate status messages (only when visible)
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length), 4000);
    return () => clearInterval(id);
  }, [visible]);

  // Progress bar (only when visible)
  useEffect(() => {
    if (!visible) return;
    progressIntervalRef.current = setInterval(() => {
      const ms = Date.now() - startRef.current;
      setElapsed(Math.floor(ms / 1000));
      // Fills to 90% over MAX_WAIT_MS, held until server actually responds
      setProgress(Math.min(90, (ms / MAX_WAIT_MS) * 100));
    }, 300);
    return () => clearInterval(progressIntervalRef.current);
  }, [visible]);

  const succeed = (wasVisible) => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;

    // Clean up all timers
    clearTimeout(loaderTimerRef.current);
    clearTimeout(giveUpRef.current);
    clearInterval(retryIntervalRef.current);
    clearInterval(progressIntervalRef.current);

    if (wasVisible) {
      // Briefly show 100% then fade out
      setProgress(100);
      setTimeout(onReady, 700);
    } else {
      // Server was awake all along — proceed immediately, no loader ever shown
      onReady();
    }
  };

  const pingServer = async () => {
    try {
      const res = await fetch(HEALTH_URL, {
        method: "GET",
        cache: "no-store",
        // No tight timeout here — we want it to naturally wait for Render to wake up
        signal: AbortSignal.timeout(12_000),
      });
      if (res.ok) {
        succeed(visible || resolvedRef.current ? visible : false);
        return true;
      }
    } catch {
      // Fetch timed out or failed — server still sleeping, keep retrying
    }
    return false;
  };

  useEffect(() => {
    let alive = true;

    // Schedule: if server hasn't replied in SHOW_LOADER_AFTER_MS, show the loader
    loaderTimerRef.current = setTimeout(() => {
      if (!resolvedRef.current && alive) {
        setVisible(true);
        startRef.current = Date.now(); // Reset elapsed from when loader appears
      }
    }, SHOW_LOADER_AFTER_MS);

    // Give-up timer — proceed no matter what after MAX_WAIT_MS
    giveUpRef.current = setTimeout(() => {
      if (!resolvedRef.current && alive) {
        succeed(true);
      }
    }, MAX_WAIT_MS);

    // First ping
    pingServer().then((ok) => {
      if (ok || !alive) return;

      // Failed — keep retrying every PING_INTERVAL_MS
      retryIntervalRef.current = setInterval(async () => {
        if (!alive) return;
        const ok = await pingServer();
        if (ok) clearInterval(retryIntervalRef.current);
      }, PING_INTERVAL_MS);
    });

    return () => {
      alive = false;
      clearTimeout(loaderTimerRef.current);
      clearTimeout(giveUpRef.current);
      clearInterval(retryIntervalRef.current);
      clearInterval(progressIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render anything if server is awake (or loader timer hasn't fired yet)
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="wakeup-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#FAF8F5",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        }}
      >
        {/* ── Logo ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48, textAlign: "center" }}
        >
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "#1A1C19",
              lineHeight: 1,
            }}
          >
            OUTFY<span style={{ color: "#ef4444" }}>.</span>
          </p>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "#827668",
              marginTop: 6,
            }}
          >
            Fashion Forward
          </p>
        </motion.div>

        {/* ── Pulsing server icon ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ marginBottom: 36, position: "relative", width: 72, height: 72 }}
        >
          <motion.div
            animate={{ scale: [1, 1.65, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid #1A1C19",
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.38, 1], opacity: [0.45, 0, 0.45] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.45 }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid #1A1C19",
            }}
          />
          <div
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "#1A1C19",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="#FAF8F5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="5" rx="1" />
              <rect x="2" y="10" width="20" height="5" rx="1" />
              <rect x="2" y="17" width="20" height="5" rx="1" />
              <circle cx="6" cy="5.5" r="0.75" fill="#FAF8F5" stroke="none" />
              <circle cx="6" cy="12.5" r="0.75" fill="#FAF8F5" stroke="none" />
              <circle cx="6" cy="19.5" r="0.75" fill="#ef4444" stroke="none" />
            </svg>
          </div>
        </motion.div>

        {/* ── Rotating status text ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={statusIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              style={{ fontSize: 14, fontWeight: 500, color: "#1A1C19", letterSpacing: "0.02em" }}
            >
              {STATUS_MESSAGES[statusIdx]}{dots}
            </motion.p>
          </AnimatePresence>
          <p style={{ fontSize: 11, color: "#827668", marginTop: 8, letterSpacing: "0.05em" }}>
            Our server wakes up in ~30 seconds after being idle
          </p>
        </motion.div>

        {/* ── Progress bar ── */}
        <div
          style={{
            width: "min(320px, 85vw)",
            background: "#E8E5E0",
            borderRadius: 99,
            height: 4,
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ height: "100%", background: "#1A1C19", borderRadius: 99, minWidth: "3%" }}
          />
        </div>

        {/* ── Elapsed timer ── */}
        <p style={{ fontSize: 11, color: "#BFBAB4", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {elapsed}s elapsed
        </p>

        {/* ── Bottom tagline ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 10,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#C8C3BC",
          }}
        >
          Premium Fashion · Curated for You
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

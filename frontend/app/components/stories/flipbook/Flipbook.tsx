"use client";

import { useEffect, useRef, useState } from "react";
import BookImage from "../../BookImage";

/**
 * Ported 1:1 from the design HTML — a click-driven book.
 * flip: 0 = closed cover, 1 = spread one open, 2 = spread two open.
 */
export default function Flipbook() {
  const [flip, setFlip] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const flipTo = (target: number) => {
    const start = flip;
    if (Math.abs(target - start) < 0.001) return;
    if (timer.current) clearInterval(timer.current);
    const dist = Math.abs(target - start);
    const dur = 620 * Math.max(dist, 0.4);
    const t0 = Date.now();
    timer.current = setInterval(() => {
      const t = Math.min((Date.now() - t0) / dur, 1);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      if (t >= 1) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setFlip(target);
      } else {
        setFlip(start + (target - start) * e);
      }
    }, 16);
  };

  const open = Math.min(flip, 1);
  const turn = Math.max(0, Math.min(flip - 1, 1));
  const opened = open > 0.995;

  const prevPage = () => flipTo(Math.max(0, Math.ceil(flip - 0.001) - 1));
  const nextPage = () => flipTo(Math.min(2, Math.floor(flip + 0.001) + 1));
  const goSpread1 = () => flipTo(1);
  const goSpread2 = () => flipTo(2);

  const navBase: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "clamp(38px, 6.4vw, 44px)",
    height: "clamp(38px, 6.4vw, 44px)",
    borderRadius: "50%",
    border: "1px solid rgba(30,28,23,0.15)",
    background: "rgba(255,255,255,0.92)",
    color: "#1E1C17",
    fontFamily: "Georgia, serif",
    fontSize: 22,
    lineHeight: 1,
    cursor: "pointer",
    zIndex: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(30,28,23,0.12)",
    transition: "opacity 0.35s ease",
  };
  const hide = (h: boolean): React.CSSProperties =>
    h ? { opacity: 0, pointerEvents: "none" } : { opacity: 1 };
  const dot = (on: boolean): React.CSSProperties => ({
    width: 8,
    height: 8,
    padding: 0,
    borderRadius: "50%",
    cursor: "pointer",
    border: `1px solid ${on ? "#5C5A2E" : "rgba(30,28,23,0.3)"}`,
    background: on ? "#5C5A2E" : "transparent",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div
        style={{
          position: "relative",
          width: "min(100%, 680px)",
          perspective: "2600px",
          perspectiveOrigin: "50% 40%",
        }}
      >
        {/* PAGE-EDGE THICKNESS STACK — sits under the right half to fake the block of paper */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: "50%",
            aspectRatio: "3 / 4",
            zIndex: 0,
            pointerEvents: "none",
            transition: "opacity 0.45s ease",
            opacity: 1 - turn * 0.85,
          }}
        >
          {[10, 8, 6, 4, 2].map((offset, i) => (
            <div
              key={offset}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "0 5px 5px 0",
                background: i % 2 === 0 ? "#EFEBDD" : "#F6F3EA",
                boxShadow: "inset -1px 0 0 rgba(30,28,23,0.06)",
                transform: `translate(${offset}px, ${offset}px)`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            transition: "background-color 0.5s ease, box-shadow 0.5s ease",
            background: open > 0.02 ? "#FFFFFF" : "transparent",
            boxShadow: open > 0.02 ? `0 26px 70px rgba(30,28,23,${(0.16 * open).toFixed(3)})` : "none",
          }}
        >
          {/* LEFT PAGE */}
          <div
            style={{
              position: "relative",
              aspectRatio: "3 / 4",
              overflow: "hidden",
              background: "#FFFFFF",
              transition: "opacity 0.45s ease",
              opacity: open > 0.03 ? 1 : 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "clamp(24px, 5.5vw, 44px) clamp(20px, 5vw, 38px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "clamp(10px, 2.4vw, 18px)",
                transition: "opacity 0.3s ease",
                opacity: turn < 0.5 ? 1 : 0,
              }}
            >
              <div className="text-stroke-thin font-italiana" style={{ fontSize: "clamp(22px, 5vw, 36px)", lineHeight: 1.1, letterSpacing: "0.01em", color: "#1E1C17" }}>Dear mom and dad,</div>
              <div style={{ width: 40, height: 1, background: "rgba(30,28,23,0.3)" }} />
              <div className="font-montserrat" style={{ fontSize: "clamp(9px, 1.7vw, 11px)", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(30,28,23,0.45)" }}>JUL 2026</div>
            </div>
            <div style={{ position: "absolute", inset: 0, transition: "opacity 0.3s ease", opacity: turn >= 0.5 ? 1 : 0 }}>
              <BookImage src="/picture/flip_book/IMG_5203.jpg" alt="AMS canal house" rounded={false} />
            </div>
          </div>

          {/* RIGHT PAGE STACK */}
          <div style={{ position: "relative", aspectRatio: "3 / 4" }}>
            {/* under leaf: spread two */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#FFFFFF", zIndex: 1 }}>
              <div style={{ position: "absolute", inset: 0, padding: "clamp(16px, 4vw, 26px) clamp(16px, 4vw, 26px) clamp(16px, 4vw, 26px) clamp(14px, 3.4vw, 22px)", display: "flex", flexDirection: "column", gap: "clamp(9px, 2.2vw, 14px)" }}>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 1fr)", gap: "clamp(10px, 2.5vw, 16px)" }}>
                  <div style={{ position: "relative" }}><BookImage src="/picture/flip_book/IMG_8322.JPG" alt="Amsterdam street moment" /></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "clamp(7px, 1.8vw, 12px)", minWidth: 0 }}>
                    <div className="font-montserrat" style={{ fontSize: "clamp(7px, 1.3vw, 8px)", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(30,28,23,0.45)" }}>AMS</div>
                    <div className="text-stroke-thin font-italiana" style={{ fontSize: "clamp(17px, 3.7vw, 26px)", lineHeight: 1.1, letterSpacing: "0.01em", color: "#1E1C17" }}>The morning we found it.</div>
                    <div style={{ width: 28, height: 1, background: "rgba(30,28,23,0.25)" }} />
                    <div className="font-montserrat" style={{ fontSize: "clamp(8px, 1.5vw, 10px)", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(30,28,23,0.4)", marginTop: "auto" }}>Jul 27 · 08:14</div>
                  </div>
                </div>
                <div style={{ position: "relative", flex: 1.05 }}><BookImage src="/picture/flip_book/IMG_2921.jpg" alt="Canal view" /></div>
              </div>
            </div>

            {/* turning leaf: spread one right page */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                background: "#FFFFFF",
                zIndex: 4,
                transformOrigin: "left center",
                backfaceVisibility: "hidden",
                transform: `rotateY(${(-176 * turn).toFixed(2)}deg)`,
                boxShadow: turn > 0 ? "0 18px 40px rgba(30,28,23,0.22)" : undefined,
              }}
            >
              <div style={{ position: "absolute", inset: 0, padding: "clamp(16px, 4vw, 26px) clamp(16px, 4vw, 26px) clamp(16px, 4vw, 26px) clamp(14px, 3.4vw, 22px)", display: "flex", flexDirection: "column", gap: "clamp(9px, 2.2vw, 14px)" }}>
                <div style={{ position: "relative", flex: 1 }}><BookImage src="/picture/flip_book/IMG_3023.jpg" alt="Amsterdam afternoon" /></div>
                <div style={{ position: "relative", flex: 1 }}><BookImage src="/picture/flip_book/IMG_0354.jpg" alt="By the water" /></div>
              </div>
              <div style={{ position: "absolute", inset: 0, background: "rgba(30,28,23,0.35)", pointerEvents: "none", opacity: (turn * 0.9).toFixed(3) }} />
            </div>
          </div>

          {/* center gutter shadow */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 46, transform: "translateX(-50%)", background: "linear-gradient(to right, rgba(30,28,23,0) 0%, rgba(30,28,23,0.10) 45%, rgba(30,28,23,0.14) 50%, rgba(30,28,23,0.10) 55%, rgba(30,28,23,0) 100%)", pointerEvents: "none", zIndex: 3, transition: "opacity 0.4s ease", opacity: open > 0.55 ? 1 : 0 }} />

          {/* BOOK SPINE (gáy sách) — the bound left edge, standing out to show thickness */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: 16,
              aspectRatio: "3 / 40",
              height: "100%",
              transformOrigin: "right center",
              transform: "translateX(-16px) rotateY(62deg)",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              borderRadius: "4px 0 0 4px",
              background:
                "linear-gradient(to right, #3d1322 0%, #521a2e 45%, #6a253d 100%)",
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.35)",
              zIndex: 7,
              pointerEvents: "none",
              transition: "opacity 0.4s ease",
              opacity: open < 0.06 ? 1 : 0,
            }}
          >
            {/* horizontal binding ribs on the spine */}
            {[18, 38, 62, 82].map((top) => (
              <div
                key={top}
                style={{
                  position: "absolute",
                  left: 2,
                  right: 2,
                  top: `${top}%`,
                  height: 1,
                  background: "rgba(240,234,216,0.22)",
                }}
              />
            ))}
          </div>

          {/* FRONT COVER */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "50%",
              aspectRatio: "3 / 4",
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
              zIndex: 8,
              transform: `rotateY(${(-176 * open).toFixed(2)}deg)`,
              pointerEvents: opened ? "none" : "auto",
              cursor: opened ? "default" : "pointer",
            }}
            onClick={() => open < 0.02 && goSpread1()}
          >
            <div style={{ position: "absolute", inset: 0, background: "#5E1F35", borderRadius: "0 5px 5px 0", overflow: "hidden", boxShadow: open < 0.06 ? "0 34px 70px rgba(30,28,23,0.34), -6px 10px 22px rgba(30,28,23,0.18)" : "0 30px 60px rgba(30,28,23,0.28)" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 22, background: "linear-gradient(to right, rgba(0,0,0,0.42), rgba(0,0,0,0))" }} />
              <div style={{ position: "absolute", inset: 0, padding: "clamp(24px, 5.6vw, 40px) clamp(20px, 4.8vw, 34px)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div className="font-marcellus" style={{ fontSize: "clamp(8px, 1.4vw, 9px)", letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(240,234,216,0.7)" }}>VUUR KAT· edition n°1</div>
                <svg viewBox="0 0 210 130" style={{ width: "100%", height: "auto" }} fill="none" stroke="#F0EAD8" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <filter id="owPencilBook" x="-15%" y="-15%" width="130%" height="130%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={3} seed={9} result="n" />
                      <feDisplacementMap in="SourceGraphic" in2="n" scale={2.1} xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                  </defs>
                  <g filter="url(#owPencilBook)">
                    <g strokeWidth="1.5" opacity="0.95">
                      <path d="M18 124 L18 48 L33 31 L48 48 L48 124 Z" />
                      <path d="M52 124 L52 40 L67 22 L82 40 L82 124 Z" />
                      <path d="M86 124 L86 55 L101 36 L116 55 L116 124 Z" />
                      <path d="M120 124 L120 44 L135 27 L150 44 L150 124 Z" />
                      <path d="M154 124 L154 59 L169 42 L184 59 L184 124 Z" />
                    </g>
                    <g strokeWidth="0.9" opacity="0.5">
                      <path d="M19 122 L19 50 L33 33 L47 50 L47 122" />
                      <path d="M53 122 L53 42 L67 24 L81 42 L81 122" />
                      <path d="M121 122 L121 46 L135 29 L149 46 L149 122" />
                    </g>
                    <g strokeWidth="1.1" opacity="0.8">
                      <path d="M26 64 h13 M26 86 h13 M26 106 h13" />
                      <path d="M60 56 h13 M60 78 h13 M60 100 h13" />
                      <path d="M94 70 h13 M94 92 h13" />
                      <path d="M128 60 h13 M128 82 h13 M128 104 h13" />
                      <path d="M162 74 h13 M162 96 h13" />
                    </g>
                    <g strokeWidth="1.2" opacity="0.85">
                      <path d="M33 25 v-9 M33 16 h8 M41 16 v4" />
                      <path d="M6 124 h198" />
                    </g>
                    <g strokeWidth="0.7" opacity="0.35">
                      <path d="M10 128 h192 M14 131 h182" />
                    </g>
                  </g>
                </svg>
                <div>
                  <div className="text-stroke font-italiana" style={{ fontSize: "clamp(30px, 6.4vw, 42px)", lineHeight: 1, letterSpacing: "0.02em", color: "#F0EAD8" }}>Amsterdam</div>
                  <div className="font-marcellus" style={{ fontSize: "clamp(11px, 2vw, 13px)", letterSpacing: "0.08em", color: "rgba(240,234,216,0.75)", marginTop: 10 }}>two days, one hook, no plan</div>
                </div>
              </div>
            </div>
          </div>

          <button type="button" onClick={prevPage} style={{ ...navBase, left: "max(6px, -22px)", ...hide(open < 0.995) }}>‹</button>
          <button
            type="button"
            onClick={nextPage}
            aria-label={!opened ? "Open the book" : "Next page"}
            className={!opened ? "ow-book-nudge ow-book-pulse" : undefined}
            style={
              !opened
                ? { ...navBase, right: "max(6px, -26px)", width: "clamp(50px, 8.4vw, 58px)", height: "clamp(50px, 8.4vw, 58px)", fontSize: 28, background: "#5C5A2E", color: "#F0EAD8", border: "1px solid #5C5A2E", boxShadow: "0 10px 26px rgba(92,90,46,0.45)", transition: "none" }
                : { ...navBase, right: "max(6px, -22px)", ...hide(turn > 0.5) }
            }
          >
            ›
          </button>

          {/* "tap to open" hint — only while the book is closed */}
          <div
            aria-hidden
            className={open < 0.02 ? "ow-hint-float font-marcellus" : "font-marcellus"}
            style={{
              position: "absolute",
              right: -6,
              top: "calc(50% + 46px)",
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              textAlign: "center",
              transition: "opacity 0.4s ease",
              opacity: open < 0.02 ? 1 : 0,
              pointerEvents: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" />
              <path d="M6 11l6-6 6 6" />
            </svg>
            <span>Tap to open</span>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "min(100%, 680px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "opacity 0.4s ease",
          ...(opened ? { opacity: 1 } : { opacity: 0, pointerEvents: "none", height: 0, overflow: "hidden" }),
        }}
        className="font-marcellus"
      >
        <span style={{ fontSize: "clamp(11px, 2.4vw, 13px)", letterSpacing: "0.06em", color: "rgba(30,28,23,0.45)" }}>
          {turn < 0.5 ? "Amsterdam, chapter one · 02 — 03" : "Amsterdam, chapter one · 04 — 05"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="button" onClick={goSpread1} style={dot(turn < 0.5)} />
          <button type="button" onClick={goSpread2} style={dot(turn >= 0.5)} />
        </div>
      </div>
    </div>
  );
}

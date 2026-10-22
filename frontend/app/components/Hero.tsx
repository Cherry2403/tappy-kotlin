"use client";

import { useEffect } from "react";
import Image from "next/image";
import BookImage from "./BookImage";

const BG = ["#2A2A23", "#3B3A2C", "#4A4834", "#5E1F35"];
const MCAPS = [
  "Hold it to your phone.",
  "Story of the land.",
  "Story of your own.",
  "The best gift for you, friends, family.",
];

/**
 * Ported 1:1 from the design HTML's `updateHero()` — a single scroll listener
 * that writes transforms straight to the DOM by id every frame (no React state).
 */
function useHeroScroll() {
  useEffect(() => {
    let lastAct = -1;
    const $ = (id: string) => document.getElementById(id);
    const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const updateHero = () => {
      const wrapper = $("hero-wrapper");
      const sticky = $("hero-sticky");
      const stage = $("hero-stage");
      const inner = $("stage-inner");
      if (!wrapper || !sticky || !stage || !inner) return;

      const scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = clamp(-wrapper.getBoundingClientRect().top / scrollable, 0, 1);

      // fit the fixed 980x780 stage into whatever space it has
      const narrow = window.innerWidth < 1024;
      const room = stage.clientHeight - (narrow ? 118 : 0);
      const fit = Math.min(stage.clientWidth / 1020, room / 810);
      inner.style.transform = `translate(-50%, -50%) translateY(${narrow ? 59 : 0}px) scale(${fit.toFixed(4)})`;

      const t1 = ease(seg(p, 0.02, 0.22)); // magnet travels in
      const t2 = seg(p, 0.26, 0.5); // land story scrolls
      const t3 = seg(p, 0.52, 0.76); // book turns
      const t4 = ease(seg(p, 0.79, 0.94)); // crowd arrives
      const act = p < 0.24 ? 0 : p < 0.51 ? 1 : p < 0.78 ? 2 : 3;

      sticky.style.backgroundColor = BG[act];

      // copy steps + rail
      for (let i = 0; i < 4; i++) {
        const el = $(`hs-${i}`);
        if (el) el.classList.toggle("on", i === act);
        const bar = document.querySelectorAll("#hero-rail i")[i] as HTMLElement | undefined;
        if (bar) bar.style.width = `${clamp(p * 4 - i, 0, 1) * 100}%`;
      }
      if (act !== lastAct) {
        const cap = $("hero-caption-mobile");
        if (cap) cap.textContent = MCAPS[act];
        lastAct = act;
      }
      const note = $("stage-note");
      if (note) {
        note.textContent = p > 0.97 ? "keep scrolling" : "scroll";
        note.style.opacity = p > 0.02 && p < 0.95 ? "0" : "0.9";
      }

      // phone
      const phone = $("phone-holder");
      if (phone) {
        const x = lerp(0, -268, t4);
        const sc = lerp(0.82, 0.6, t4);
        const rot = lerp(0, -4, t4);
        phone.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      }

      // magnet: flies in, taps, parks, then travels to the crowd
      const mag = $("magnet");
      if (mag) {
        let mx = lerp(430, 236, t1);
        let my = lerp(210, -6, t1);
        let mr = lerp(14, -3, t1);
        let ms = lerp(1.06, 0.94, t1);
        const nudge = t1 > 0.93 ? Math.sin(((Date.now() % 1600) / 1600) * Math.PI * 2) * 4 : 0;
        const park = seg(p, 0.24, 0.34);
        mx = lerp(mx, 352, park);
        my = lerp(my, -300, park);
        ms = lerp(ms, 0.52, park);
        mr = lerp(mr, 8, park);
        mx = lerp(mx, 300, t4);
        my = lerp(my, 172, t4);
        ms = lerp(ms, 0.92, t4);
        mr = lerp(mr, -7, t4);
        mag.style.transform = `translate(${(mx + nudge).toFixed(1)}px, ${my.toFixed(1)}px) rotate(${mr.toFixed(2)}deg) scale(${ms.toFixed(3)})`;
        mag.style.opacity = String(lerp(1, 0.75, park * (1 - t4)));
      }
      const ring = $("tap-ring");
      if (ring) ring.classList.toggle("on", t1 > 0.8 && p < 0.3);

      // screen wakes, then scrolls
      const sleep = $("screen-sleep");
      if (sleep) {
        sleep.style.transition = "opacity 0.45s ease";
        sleep.style.opacity = t1 > 0.9 ? "0" : "1";
      }
      const hint = $("sleep-hint");
      if (hint) hint.style.opacity = t1 > 0.35 ? "0" : "1";
      const col = $("screen-scroll");
      if (col) {
        const max = Math.max(0, col.scrollHeight - 874);
        col.style.transform = `translateY(${(-ease(t2) * max).toFixed(1)}px)`;
      }

      // book: cover then three leaves
      const f = t3 * 3.15;
      for (let i = 0; i < 4; i++) {
        const pg = $(`bpg${i}`);
        if (!pg) continue;
        const turned = clamp(f - i, 0, 1);
        pg.style.transform = `rotateY(${(-178 * turned).toFixed(1)}deg)`;
        pg.style.zIndex = String(turned > 0.5 ? i : 40 - i);
      }
      const spine = $("book-spine");
      if (spine) spine.style.opacity = String(clamp(f, 0, 1) * 0.9);
      const bl = $("book-label");
      if (bl) bl.textContent = ["COVER", "01 / 03", "02 / 03", "03 / 03"][clamp(Math.floor(f + 0.15), 0, 3)];
      document.querySelectorAll(".bdot").forEach((d, i) => {
        const el = d as HTMLElement;
        const on = i === clamp(Math.floor(f + 0.15), 0, 3);
        el.style.width = on ? "22px" : "10px";
        el.style.background = on ? "#5C5A2E" : "rgba(30,28,23,0.22)";
      });

      // family photo
      const family = $("family-photo");
      if (family) family.classList.toggle("on", t4 > 0.1);
    };

    const onScroll = () => updateHero();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const timers = [60, 300, 900, 2000].map((d) => setTimeout(updateHero, d));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      timers.forEach(clearTimeout);
    };
  }, []);
}

export default function Hero() {
  useHeroScroll();

  return (
    <section className="hero-wrapper" id="hero-wrapper">
      <div className="hero-sticky" id="hero-sticky" style={{ background: "#2A2A23" }}>
        {/* left column — desktop step copy + progress rail */}
        <div className="hero-copy">
          <div
            className="font-italiana"
            style={{
              position: "absolute",
              left: "max(3rem, calc((100vw - 90rem) / 2 + 4rem))",
              top: "calc(50% - 168px)",
              fontWeight: 700,
              color: "#84B7DB",
              fontSize: "clamp(20px, 2.4vw, 30px)",
              letterSpacing: "0.02em",
            }}
          >
            TAPPY
          </div>
          <div className="hero-step on" id="hs-0">
            <h1>Hold it to your phone.</h1>
          </div>
          <div className="hero-step" id="hs-1">
            <h1>Story of the land.</h1>
          </div>
          <div className="hero-step" id="hs-2">
            <h1>Story of your own.</h1>
          </div>
          <div className="hero-step" id="hs-3">
            <h1>The best gift for you, friends, family.</h1>
          </div>
          <div className="hero-rail" id="hero-rail">
            <span><i /></span>
            <span><i /></span>
            <span><i /></span>
            <span><i /></span>
          </div>
        </div>

        {/* right column — the animated stage */}
        <div className="hero-stage" id="hero-stage">
          <div
            className="font-italiana lg:hidden"
            style={{
              position: "absolute",
              top: 20,
              left: 0,
              right: 0,
              textAlign: "center",
              fontWeight: 700,
              color: "#84B7DB",
              fontSize: "clamp(20px, 6vw, 30px)",
              letterSpacing: "0.02em",
              zIndex: 5,
            }}
          >
            TAPPY
          </div>
          <div className="hero-mobile-caption" id="hero-caption-mobile">
            Hold it to the phone.
          </div>

          <div id="stage-inner">
            <div
              className="tap-ring"
              id="tap-ring"
              style={{ position: "absolute", left: 490, top: 390, width: 0, height: 0, zIndex: 2 }}
            >
              <i />
              <i />
              <i />
            </div>

            {/* PHONE */}
            <div
              id="phone-holder"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) scale(0.82)",
                transformOrigin: "center center",
                zIndex: 3,
              }}
            >
              <div style={{ position: "relative", width: 402, height: 874, overflow: "hidden", background: "#14130F", borderRadius: 54 }}>
                <div id="screen-scroll" style={{ position: "absolute", left: 0, top: 0, width: 402, willChange: "transform" }}>
                  {/* place photo */}
                  <div style={{ position: "relative", height: 430, overflow: "hidden" }}>
                    <Image
                      src="/picture/real_house.jpg"
                      alt="Amsterdam house view"
                      width={402}
                      height={430}
                      quality={75}
                      preload
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(30,28,23,0.62) 0%, rgba(30,28,23,0.05) 38%, rgba(30,28,23,0.96) 100%)" }} />
                    <div style={{ position: "absolute", top: 58, left: 22, right: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="font-marcellus" style={{ fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(240,234,216,0.8)" }}>VuurKat</span>
                    </div>
                    <div style={{ position: "absolute", left: 24, right: 24, bottom: 28, color: "#F0EAD8" }}>
                      <div className="font-marcellus" style={{ fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(240,234,216,0.7)", marginBottom: 10 }}>Story of the land</div>
                      <div className="text-stroke font-italiana" style={{ fontSize: 52, lineHeight: 0.98, letterSpacing: "0.01em" }}>AMS CANAL HOUSE</div>
                      <div className="font-marcellus" style={{ fontSize: 12, letterSpacing: "0.1em", color: "rgba(240,234,216,0.7)", marginTop: 10 }}>AMSTERDAM · SINCE 1600</div>
                    </div>
                  </div>

                  {/* land story beats */}
                  <div style={{ background: "#FFFFFF", color: "#1E1C17", padding: "34px 24px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
                    {[
                      ["01", "Tax by width", "Long ago, tax was based on how wide the front of the house was. So people built the front skinny, and made the house long in the back instead."],
                      ["02", "House leans forward", "Staircases are far Houses lean on purpose so furniture pulled up by rope swings away from the wall, and rain drips off the front instead of soaking it. They also lean from age: wood poles in the mud rot and sink unevenly, and old wood and brick sag after centuries.too steep for furniture. Sofas and beds still go up on a pulley and in through the window."],
                    ].map(([n, h, b], i) => (
                      <div key={n} style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: 14, alignItems: "start", borderTop: i === 1 ? "1px solid rgba(92,90,46,0.22)" : undefined, paddingTop: i === 1 ? 24 : undefined }}>
                        <div className="font-marcellus" style={{ fontSize: 12, letterSpacing: "0.12em", color: "#5C5A2E", paddingTop: 6 }}>{n}</div>
                        <div>
                          <div className="text-stroke-thin font-italiana" style={{ fontSize: 27, lineHeight: 1.15, marginBottom: 8 }}>{h}</div>
                          <div className="font-montserrat" style={{ fontSize: 13.5, lineHeight: 1.75, color: "rgba(30,28,23,0.7)" }}>{b}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* in-phone book preview */}
                  <div style={{ background: "#FFFFFF", padding: "8px 24px 60px" }}>
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
                      <div>
                        <div className="font-marcellus" style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#5C5A2E", marginBottom: 8 }}>Story of you</div>
                        <div className="text-stroke font-italiana" style={{ fontSize: 40, lineHeight: 1, color: "#1E1C17" }}>Your book</div>
                      </div>
                      <div id="book-label" className="font-marcellus" style={{ fontSize: 12, letterSpacing: "0.14em", color: "rgba(30,28,23,0.5)", paddingBottom: 6 }}>COVER</div>
                    </div>

                    <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4.1", perspective: "1800px" }}>
                      <div style={{ position: "absolute", inset: 0, borderRadius: 4, background: "rgba(92,90,46,0.16)", boxShadow: "0 18px 40px rgba(30,28,23,0.14)" }} />

                      <div className="bpage" id="bpg3" style={bpage}>
                        <div style={{ position: "absolute", inset: 0, padding: "26px 24px", display: "flex", flexDirection: "column" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                            <div className="font-italiana" style={{ fontSize: 62, lineHeight: 0.8, color: "rgba(92,90,46,0.5)" }}>03</div>
                            <div className="font-montserrat" style={{ fontSize: 11, lineHeight: 1.7, color: "rgba(30,28,23,0.6)", paddingTop: 6 }}>two hours later,<br />same street</div>
                          </div>
                          <div style={{ position: "relative", flex: 1, marginTop: 16 }}>
                            <div style={{ position: "absolute", top: 0, left: 0, width: "62%", height: "58%" }}><BookImage src="/picture/flip_book/IMG_3169.JPG" alt="Amsterdam street" /></div>
                            <div style={{ position: "absolute", bottom: 0, right: 0, width: "58%", height: "52%", boxShadow: "-8px -8px 0 #FFFFFF" }}><BookImage src="/picture/flip_book/IMG_4001.JPG" alt="The hook again" /></div>
                          </div>
                          <div className="font-marcellus" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(30,28,23,0.4)", marginTop: 16 }}>This city is so pretty</div>
                        </div>
                      </div>

                      <div className="bpage" id="bpg2" style={bpage}>
                        <BookImage src="/picture/flip_book/IMG_3060.jpg" alt="The morning we found it" rounded={false} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(30,28,23,0.78) 0%, rgba(30,28,23,0) 45%)" }} />
                        <div style={{ position: "absolute", left: 24, right: 24, bottom: 26, color: "#F0EAD8" }}>
                          <div className="text-stroke-thin font-italiana" style={{ fontSize: 30, lineHeight: 1.05 }}>The morning<br />we found it</div>
                          <div className="font-montserrat" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,234,216,0.75)", marginTop: 12 }}>Jul 27 · 08:14</div>
                        </div>
                      </div>

                      <div className="bpage" id="bpg1" style={bpage}>
                        <div style={{ position: "absolute", inset: 13, border: "1px solid rgba(92,90,46,0.4)", borderRadius: 14 }} />
                        <div style={{ position: "absolute", inset: "32px 30px", display: "flex", flexDirection: "column" }}>
                          <div className="font-marcellus" style={{ display: "flex", justifyContent: "flex-end", fontSize: 12, letterSpacing: "0.12em", color: "rgba(30,28,23,0.5)" }}>2 JULY 2026</div>
                          <div style={{ margin: "auto 0" }}>
                            <div className="text-stroke font-italiana" style={{ fontSize: 38, lineHeight: 1.05 }}>Dear future<br />me,</div>
                            <div style={{ width: 36, height: 1, background: "rgba(92,90,46,0.6)", margin: "18px 0" }} />
                            <div className="font-montserrat" style={{ fontSize: 13, lineHeight: 1.85, color: "rgba(30,28,23,0.75)" }}>We came here with no plan and stayed by the water until it got dark. Your mother swears the hook above us was for hauling sofas up the front of the house. She was right.</div>
                          </div>
                          <div className="font-marcellus" style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(30,28,23,0.4)" }}>AMSTERDAM · page one</div>
                        </div>
                      </div>

                      <div className="bpage" id="bpg0" style={{ ...bpage, background: "#5E1F35" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: "linear-gradient(to right, rgba(0,0,0,0.35), rgba(0,0,0,0))" }} />
                        <div style={{ position: "absolute", inset: 0, padding: "32px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#F0EAD8" }}>
                          <div className="font-marcellus" style={{ fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(240,234,216,0.7)" }}>VuurKat · edition n°1</div>
                          <svg viewBox="0 0 210 130" style={{ width: "100%", height: "auto" }} fill="none" stroke="#F0EAD8" strokeLinecap="round" strokeLinejoin="round">
                            <g strokeWidth="1.5" opacity="0.95">
                              <path d="M18 124 L18 48 L33 31 L48 48 L48 124 Z" />
                              <path d="M52 124 L52 40 L67 22 L82 40 L82 124 Z" />
                              <path d="M86 124 L86 55 L101 36 L116 55 L116 124 Z" />
                              <path d="M120 124 L120 44 L135 27 L150 44 L150 124 Z" />
                              <path d="M154 124 L154 59 L169 42 L184 59 L184 124 Z" />
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
                          </svg>
                          <div>
                            <div className="text-stroke font-italiana" style={{ fontSize: 38, lineHeight: 1, letterSpacing: "0.02em" }}>Amsterdam</div>
                            <div className="font-marcellus" style={{ fontSize: 11, letterSpacing: "0.08em", color: "rgba(240,234,216,0.75)", marginTop: 8 }}>two days, one hook, no plan</div>
                          </div>
                        </div>
                      </div>

                      <div id="book-spine" style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 26, zIndex: 30, pointerEvents: "none", opacity: 0, background: "linear-gradient(to right, rgba(30,28,23,0.3) 0%, rgba(30,28,23,0.12) 42%, rgba(30,28,23,0) 100%)" }} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
                      <div style={{ display: "flex", gap: 7 }}>
                        <span className="bdot" style={{ display: "block", height: 3, width: 22, borderRadius: 4, background: "#5C5A2E" }} />
                        <span className="bdot" style={{ display: "block", height: 3, width: 10, borderRadius: 4, background: "rgba(30,28,23,0.22)" }} />
                        <span className="bdot" style={{ display: "block", height: 3, width: 10, borderRadius: 4, background: "rgba(30,28,23,0.22)" }} />
                        <span className="bdot" style={{ display: "block", height: 3, width: 10, borderRadius: 4, background: "rgba(30,28,23,0.22)" }} />
                      </div>
                      <div className="font-marcellus" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(30,28,23,0.42)" }}>eight pages, yours</div>
                    </div>
                  </div>
                </div>

                {/* sleep overlay */}
                <div id="screen-sleep" style={{ position: "absolute", inset: 0, background: "#14130F", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
                  <div className="font-italiana" style={{ fontSize: 74, color: "rgba(240,234,216,0.9)", lineHeight: 1 }}>21:40</div>
                  <div className="font-marcellus" style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(240,234,216,0.4)" }}>Saturday 27 July</div>
                  <div id="sleep-hint" className="font-montserrat" style={{ position: "absolute", bottom: 74, left: 0, right: 0, textAlign: "center", fontSize: 12, letterSpacing: "0.14em", color: "rgba(240,234,216,0.35)" }}>bring the souvenir closer</div>
                </div>
              </div>
            </div>

            {/* MAGNET */}
            <div id="magnet" style={{ position: "absolute", left: "50%", top: "50%", width: 236, margin: "-118px 0 0 -118px", zIndex: 6, willChange: "transform" }}>
              <img src="/picture/house.png" alt="Amsterdam magnet" style={{ width: "100%", display: "block", filter: "drop-shadow(0 22px 34px rgba(0,0,0,0.45))" }} />
            </div>

            {/* FAMILY PHOTO */}
            <div id="crowd" style={{ position: "absolute", left: 470, top: 118, width: 520, height: 560, zIndex: 4 }}>
              <div
                className="face"
                id="family-photo"
                style={{ left: 0, top: 0, width: "100%", height: "100%" }}
              >
                <img
                  src="/picture/family.png"
                  alt="Family enjoying their Tappy souvenir together"
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />
              </div>
            </div>

            <div className="stage-note" id="stage-note">scroll</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const bpage: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: 4,
  overflow: "hidden",
  background: "#FFFFFF",
  transformOrigin: "left center",
  backfaceVisibility: "hidden",
  boxShadow: "0 10px 26px rgba(30,28,23,0.14)",
};

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  const confettiRef = useRef(null);

  useEffect(() => {
    const colors = ["#10b981","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#ec4899","#fff"];
    const shapes = ["circle", "rect"];
    const container = confettiRef.current;
    if (!container) return;

    const spawn = () => {
      const el = document.createElement("div");
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size  = 6 + Math.random() * 8;
      el.style.cssText = `
        position:absolute;
        left:${Math.random() * 100}%;
        top:-20px;
        width:${size}px;
        height:${size}px;
        background:${color};
        border-radius:${shape === "circle" ? "50%" : "2px"};
        opacity:0;
        animation: confettiFall ${2 + Math.random() * 3}s linear ${Math.random() * 1.5}s forwards;
      `;
      container.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    };

    for (let i = 0; i < 80; i++) spawn();
    let count = 0;
    const trickle = setInterval(() => {
      spawn();
      count++;
      if (count > 60) clearInterval(trickle);
    }, 200);

    return () => clearInterval(trickle);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes cardIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes checkPop {
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes rotateBorder {
          to { filter: hue-rotate(360deg); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; width: 40%; }
          50%       { opacity: 1;   width: 70%; }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.8); opacity: 0.4; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbFloat {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(20px, 30px) scale(1.1); }
        }

        .ty-card {
          animation: cardIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
          transform: translateY(40px) scale(0.95);
        }
        .ty-card::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          height: 3px;
          background: linear-gradient(90deg, transparent, #10b981, #3b82f6, transparent);
          border-radius: 0 0 4px 4px;
          animation: shimmer 2s ease-in-out infinite;
        }
        .ty-check-wrap {
          animation: checkPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both;
          opacity: 0;
          transform: scale(0);
        }
        .ty-check-bg {
          animation: rotateBorder 3s linear infinite;
        }
        .ty-badge     { animation: fadeUp 0.5s ease 0.7s both; }
        .ty-heading   { animation: fadeUp 0.5s ease 0.9s both; }
        .ty-subtitle  { animation: fadeUp 0.5s ease 1.0s both; }
        .ty-info-row  { animation: fadeUp 0.5s ease 1.1s both; }
        .ty-divider   { animation: fadeUp 0.5s ease 1.2s both; }
        .ty-btn-wrap  { animation: fadeUp 0.5s ease 1.3s both; }

        .ty-info-card {
          transition: border-color 0.3s, transform 0.3s;
        }
        .ty-info-card:hover {
          border-color: rgba(16,185,129,0.4) !important;
          transform: translateY(-2px);
        }
        .ty-btn {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ty-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 40px rgba(16,185,129,0.5) !important;
        }
        .ty-btn:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>

      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          minHeight: "100vh",
          width: "100vw",
          background: "#080812",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "24px",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 0,
            background: `
              radial-gradient(ellipse at 20% 50%, #0d2b4e 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, #1a0d3d 0%, transparent 55%),
              radial-gradient(ellipse at 60% 80%, #0b2d1f 0%, transparent 50%),
              #080812
            `,
          }}
        />

        {/* Orbs */}
        {[
          { size: 300, color: "rgba(59,130,246,0.12)",  top: "-80px", left: "-80px",  duration: "8s"  },
          { size: 200, color: "rgba(16,185,129,0.1)",   bottom: "-60px", right: "-60px", duration: "6s" },
          { size: 150, color: "rgba(139,92,246,0.08)",  top: "40%", left: "60%", duration: "10s" },
        ].map((orb, i) => (
          <div key={i} style={{
            position: "fixed",
            width: orb.size, height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            filter: "blur(60px)",
            top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
            animation: `orbFloat ${orb.duration} ease-in-out infinite alternate`,
            pointerEvents: "none", zIndex: 0,
          }} />
        ))}

        {/* Confetti container */}
        <div ref={confettiRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }} />

        {/* Card */}
        <div
          className="ty-card"
          style={{
            position: "relative", zIndex: 10,
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 32,
            padding: "56px 48px",
            maxWidth: 520, width: "100%",
            textAlign: "center",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Checkmark */}
          <div className="ty-check-wrap" style={{ width: 96, height: 96, margin: "0 auto 32px" }}>
            <div
              className="ty-check-bg"
              style={{
                width: "100%", height: "100%", borderRadius: "50%",
                background: "conic-gradient(from 0deg, #10b981, #3b82f6, #10b981)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 32px rgba(16,185,129,0.4)",
              }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "#0a0a1a",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36,
              }}>
                ✓
              </div>
            </div>
          </div>

          {/* Badge */}
          <div
            className="ty-badge"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 100, padding: "6px 16px", marginBottom: 24,
              fontSize: 13, color: "#10b981", fontWeight: 500, letterSpacing: "0.5px",
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#10b981",
              animation: "pulseDot 1.5s ease infinite",
            }} />
            Booking Confirmed
          </div>

          {/* Heading */}
          <h1
            className="ty-heading"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 38px)",
              fontWeight: 900, color: "#fff",
              lineHeight: 1.2, marginBottom: 16,
            }}
          >
            You're{" "}
            <span style={{
              background: "linear-gradient(135deg, #10b981, #3b82f6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              All Set!
            </span>{" "}
            🎫
          </h1>

          {/* Subtitle */}
          <p
            className="ty-subtitle"
            style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}
          >
            Your booking has been confirmed successfully.<br />
            A confirmation email is on its way to you.
          </p>

          {/* Info cards */}
          <div
            className="ty-info-row"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}
          >
            {[
              { icon: "📧", label: "Confirmation", value: "Sent to email" },
              { icon: "🎟️", label: "Status",       value: "Active"        },
              { icon: "✅", label: "Payment",       value: "Verified"     },
              { icon: "📅", label: "Reminder",      value: "Set for event" },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="ty-info-card"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16, padding: "16px 12px",
                  cursor: "default",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            className="ty-divider"
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}
          >
            <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>We can't wait to see you there</span>
            <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Button */}
          <div className="ty-btn-wrap">
            <Link
              to="/home"
              className="ty-btn"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, fontWeight: 600,
                padding: "14px 36px", borderRadius: 100,
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(16,185,129,0.35)",
              }}
            >
              ⬅ Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYou;

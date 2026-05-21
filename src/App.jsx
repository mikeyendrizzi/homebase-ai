import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are HomeBase AI, a friendly and knowledgeable mortgage education assistant. You help first-time homebuyers and anyone curious about mortgages understand the homebuying process in clear, plain English.

You ONLY answer questions related to:
- Mortgages (types, terms, rates, payments)
- The homebuying process
- Credit scores and how they affect loans
- Down payments and closing costs
- Loan types (FHA, VA, conventional, USDA, jumbo)
- Debt-to-income ratio (DTI)
- Pre-approval and pre-qualification
- Refinancing basics
- Common mortgage terms and definitions
- General steps to buying a home

IMPORTANT RULES:
- You are an EDUCATION tool, not a financial advisor. Never tell someone which specific loan to take or make personalized financial recommendations.
- Always suggest they speak with a licensed loan officer for personalized advice.
- Keep answers concise, friendly, and in plain English — no jargon without explanation.
- Use bullet points or numbered lists when explaining steps or multiple things.
- If asked something outside your scope, politely redirect.
- Be warm and encouraging — buying a home is stressful, and people need confidence.
- Start responses naturally, don't say "Great question!" or similar filler phrases.`;

const SUGGESTED_QUESTIONS = [
  { icon: "✅", text: "What's the difference between pre-approval and pre-qualification?" },
  { icon: "💰", text: "How much do I need for a down payment?" },
  { icon: "📊", text: "What credit score do I need to buy a house?" },
  { icon: "📐", text: "What is DTI and why does it matter?" },
  { icon: "🏦", text: "What's the difference between FHA and conventional loans?" },
  { icon: "📋", text: "What are closing costs?" },
];

export default function HomeBaseAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [started, setStarted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startChat = () => {
    setStarted(true);
    setTimeout(() => setChatVisible(true), 50);
    setTimeout(() => {
      setMessages([{
        role: "assistant",
        content: "Hey! I'm HomeBase AI — your mortgage education assistant. Ask me anything about buying a home, loan types, credit scores, down payments, or the mortgage process. I'm here to make it all feel simple. 🏡",
      }]);
    }, 300);
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    if (!started) startChat();
    setInput("");
    setShowSuggestions(false);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, couldn't get a response. Try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f3ee", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Outfit', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d8cfc6; border-radius: 4px; }

        .msg-in { animation: fadeUp 0.3s ease forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-fade { transition: opacity 0.8s ease, transform 0.8s ease; }
        .hero-fade.visible { opacity: 1 !important; transform: translateY(0) !important; }

        .chat-fade { transition: opacity 0.5s ease; }
        .chat-fade.visible { opacity: 1 !important; }

        .suggestion-btn {
          background: #fff;
          border: 1px solid #ece5dc;
          color: #6b5f56;
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 12.5px;
          cursor: pointer;
          transition: all 0.22s;
          text-align: left;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          line-height: 1.45;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .suggestion-btn:hover {
          border-color: #c4a882;
          color: #2c2420;
          background: #fdfaf7;
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .cta-btn {
          background: #fff;
          border: 1.5px solid #e0d5c8;
          color: #7a6f66;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 7px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .cta-btn:hover {
          border-color: #c4a882;
          color: #2c2420;
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }

        .send-btn {
          background: #2c2420;
          border: none;
          border-radius: 10px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) { background: #3e3430; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.22; cursor: not-allowed; }

        .dot-pulse { display: flex; gap: 5px; align-items: center; padding: 3px 0; }
        .dot-pulse span {
          width: 6px; height: 6px; background: #c4a882; border-radius: 50%;
          animation: dp 1.2s infinite;
        }
        .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
        .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dp {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }

        textarea {
          resize: none; outline: none; border: none;
          background: transparent;
          color: #2c2420;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          font-weight: 400;
          width: 100%;
          line-height: 1.6;
        }
        textarea::placeholder { color: #c4b8a8; }

        .input-wrap:focus-within {
          border-color: #c4a882 !important;
          box-shadow: 0 0 0 3px rgba(196,168,130,0.12), 0 2px 8px rgba(0,0,0,0.06) !important;
        }

        .start-btn {
          background: #2c2420;
          color: #f7f3ee;
          border: none;
          border-radius: 14px;
          padding: 14px 32px;
          font-size: 15px;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 14px rgba(44,36,32,0.2);
        }
        .start-btn:hover { background: #3e3430; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(44,36,32,0.25); }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fff;
          border: 1px solid #ece5dc;
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 11.5px;
          color: #9a8878;
          font-weight: 400;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
      `}</style>

      {/* Warm background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #ede0cf 0%, transparent 65%)", top: -150, right: -150, opacity: 0.55 }} />
        <div style={{ position: "absolute", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, #e4d8c8 0%, transparent 65%)", bottom: -100, left: -100, opacity: 0.45 }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #f0e8dc 0%, transparent 65%)", top: "40%", left: "30%", opacity: 0.3 }} />
      </div>

      {/* Nav */}
      <div style={{ width: "100%", maxWidth: 720, padding: "24px 28px 0", zIndex: 2, position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#2c2420", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏡</div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 600, color: "#2c2420", letterSpacing: "-0.2px" }}>HomeBase AI</div>
        </div>
        <div className="pill">
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#7cb87a" }} />
          Online
        </div>
      </div>

      {/* Hero Section */}
      {!started && (
        <div
          className={`hero-fade ${heroVisible ? "visible" : ""}`}
          style={{ opacity: 0, transform: "translateY(20px)", width: "100%", maxWidth: 720, padding: "60px 28px 40px", zIndex: 1, position: "relative", textAlign: "center" }}
        >
          <div style={{ display: "inline-block", background: "#fff", border: "1px solid #ece5dc", borderRadius: 20, padding: "6px 16px", fontSize: 12, color: "#c4a882", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            Free · No signup required
          </div>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 40, fontWeight: 600, color: "#2c2420", lineHeight: 1.2, letterSpacing: "-0.5px", marginBottom: 16 }}>
            Your home buying journey,<br /><em style={{ fontWeight: 400, color: "#9a7a5a" }}>simplified.</em>
          </h1>
          <p style={{ fontSize: 15, color: "#9a8878", fontWeight: 400, lineHeight: 1.7, maxWidth: 420, margin: "0 auto 36px", letterSpacing: "0.01em" }}>
            Ask anything about mortgages, loans, and the homebuying process — in plain English, anytime.
          </p>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            {["⚡ Instant answers", "🔒 Education only", "🏡 First-time friendly"].map((tag, i) => (
              <div key={i} className="pill">{tag}</div>
            ))}
          </div>

          <button className="start-btn" onClick={startChat}>Start asking questions →</button>

          {/* Preview questions */}
          <div style={{ marginTop: 48 }}>
            <div style={{ fontSize: 10.5, color: "#c4b8a8", marginBottom: 14, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Popular questions
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 560, margin: "0 auto" }}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} className="suggestion-btn" onClick={() => { startChat(); setTimeout(() => sendMessage(q.text), 400); }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{q.icon}</span>
                  <span>{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Section */}
      {started && (
        <div
          className={`chat-fade ${chatVisible ? "visible" : ""}`}
          style={{ opacity: 0, width: "100%", maxWidth: 720, display: "flex", flexDirection: "column", flex: 1 }}
        >
          {/* Disclaimer */}
          <div style={{ padding: "14px 28px 0", zIndex: 1, position: "relative" }}>
            <div style={{ fontSize: 11, color: "#c4b8a8", lineHeight: 1.6 }}>
              📋 For educational purposes only — not financial advice. Always consult a licensed loan officer for personalized guidance.
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, padding: "20px 28px",
            display: "flex", flexDirection: "column", gap: 16,
            overflowY: "auto", minHeight: 0,
            maxHeight: "calc(100vh - 240px)",
            zIndex: 1, position: "relative",
          }}>
            {messages.map((msg, i) => (
              <div key={i} className="msg-in" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: "#2c2420", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginTop: 2 }}>🏡</div>
                )}
                <div style={{
                  maxWidth: "76%",
                  background: msg.role === "user" ? "#2c2420" : "#fff",
                  border: msg.role === "user" ? "none" : "1px solid #ece5dc",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "12px 16px",
                  color: msg.role === "user" ? "#f7f3ee" : "#4a3f38",
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  boxShadow: msg.role === "user" ? "0 2px 8px rgba(44,36,32,0.15)" : "0 1px 4px rgba(0,0,0,0.05)",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg-in" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: "#2c2420", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🏡</div>
                <div style={{ background: "#fff", border: "1px solid #ece5dc", borderRadius: "16px 16px 16px 4px", padding: "13px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div className="dot-pulse"><span /><span /><span /></div>
                </div>
              </div>
            )}

            {showSuggestions && messages.length === 1 && (
              <div className="msg-in" style={{ marginTop: 4 }}>
                <div style={{ fontSize: 10.5, color: "#c4b8a8", marginBottom: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase" }}>Common questions</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} className="suggestion-btn" onClick={() => sendMessage(q.text)}>
                      <span style={{ fontSize: 15, flexShrink: 0 }}>{q.icon}</span>
                      <span>{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Talk to loan officer CTA */}
          <div style={{ padding: "0 28px 12px", zIndex: 1, position: "relative", display: "flex", justifyContent: "center" }}>
            <button className="cta-btn">
              <span>📞</span>
              <span>Talk to a licensed loan officer</span>
            </button>
          </div>

          {/* Input */}
          <div style={{ padding: "0 28px 28px", zIndex: 1, position: "relative" }}>
            <div className="input-wrap" style={{
              background: "#fff",
              border: "1.5px solid #ece5dc",
              borderRadius: 14,
              padding: "12px 12px 12px 18px",
              display: "flex", alignItems: "flex-end", gap: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={handleKey}
                placeholder="Ask anything about mortgages..."
                style={{ maxHeight: 120 }}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="#f7f3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#f7f3ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div style={{ textAlign: "center", fontSize: 10.5, color: "#d4c8b8", marginTop: 10, letterSpacing: "0.06em" }}>
              Powered by Claude · HomeBase AI
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

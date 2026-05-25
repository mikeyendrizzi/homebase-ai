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
- Keep answers concise, friendly, and in plain English no jargon without explanation.
- Use bullet points or numbered lists when explaining steps or multiple things.
- If asked something outside your scope, politely redirect.
- Be warm and encouraging buying a home is stressful, and people need confidence.
- Start responses naturally, do not say Great question or similar filler phrases.`;

const SUGGESTED_QUESTIONS = [
  { icon: "↗", text: "Pre-approval vs pre-qualification?" },
  { icon: "↗", text: "How much do I need for a down payment?" },
  { icon: "↗", text: "What credit score do I need?" },
  { icon: "↗", text: "What is DTI and why does it matter?" },
  { icon: "↗", text: "FHA vs conventional loans?" },
  { icon: "↗", text: "What are closing costs?" },
];

export default function HomeBaseAI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [started, setStarted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "" });
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => setHeroVisible(true), 100); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const startChat = () => {
    setStarted(true);
    setTimeout(() => setChatVisible(true), 50);
    setTimeout(() => {
      setMessages([{ role: "assistant", content: "Hi, I'm HomeBase AI. Ask me anything about mortgages, home loans, or the buying process — I'll explain it clearly." }]);
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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleLeadSubmit = () => {
    if (!leadData.name || !leadData.email) return;
    setLeadSubmitted(true);
    setTimeout(() => { setShowLeadForm(false); setLeadSubmitted(false); setLeadData({ name: "", email: "", phone: "" }); }, 2500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif", position: "relative" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0px; }

        .msg-in { animation: fadeUp 0.25s ease forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .hero-fade { transition: opacity 0.9s ease, transform 0.9s ease; }
        .hero-fade.visible { opacity: 1 !important; transform: translateY(0) !important; }
        .chat-fade { transition: opacity 0.4s ease; }
        .chat-fade.visible { opacity: 1 !important; }

        .sq-btn {
          background: transparent;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 13px;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          font-weight: 400;
          color: #1d1d1f;
          transition: all 0.15s;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.1px;
        }
        .sq-btn:hover { background: #f5f5f7; border-color: rgba(0,0,0,0.15); }

        .primary-btn {
          background: #1d1d1f;
          color: #fff;
          border: none;
          border-radius: 980px;
          padding: 12px 28px;
          font-size: 15px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.2px;
        }
        .primary-btn:hover { background: #3a3a3c; transform: scale(1.02); }

        .ghost-btn {
          background: transparent;
          color: #1d1d1f;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 980px;
          padding: 11px 24px;
          font-size: 14px;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.1px;
        }
        .ghost-btn:hover { background: #f5f5f7; }

        .send-btn {
          background: #1d1d1f;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) { background: #3a3a3c; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.2; cursor: not-allowed; }

        .dot-pulse { display: flex; gap: 4px; align-items: center; }
        .dot-pulse span { width: 5px; height: 5px; background: #aeaeb2; border-radius: 50%; animation: dp 1.2s infinite; }
        .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
        .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dp { 0%,80%,100% { opacity:0.3; transform:scale(0.8); } 40% { opacity:1; transform:scale(1); } }

        textarea {
          resize: none; outline: none; border: none;
          background: transparent;
          color: #1d1d1f;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
          font-size: 15px;
          font-weight: 400;
          width: 100%;
          line-height: 1.5;
          letter-spacing: -0.2px;
        }
        textarea::placeholder { color: #aeaeb2; }

        .input-wrap { transition: box-shadow 0.2s; }
        .input-wrap:focus-within { box-shadow: 0 0 0 4px rgba(0,125,250,0.15) !important; border-color: #0071e3 !important; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: flex-end; justify-content: center; z-index: 100; padding: 0; backdrop-filter: blur(8px); animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box { background: #fff; border-radius: 20px 20px 0 0; padding: 32px 28px 40px; width: 100%; max-width: 540px; box-shadow: 0 -8px 40px rgba(0,0,0,0.12); animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .modal-handle { width: 36px; height: 4px; background: #d1d1d6; border-radius: 2px; margin: 0 auto 24px; }
        .modal-input { width: 100%; border: 1px solid #d1d1d6; border-radius: 10px; padding: 13px 16px; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif; font-size: 15px; color: #1d1d1f; outline: none; transition: border-color 0.15s, box-shadow 0.15s; background: #fff; letter-spacing: -0.2px; }
        .modal-input:focus { border-color: #0071e3; box-shadow: 0 0 0 3px rgba(0,113,227,0.15); }
        .modal-input::placeholder { color: #aeaeb2; }
        .modal-submit { width: 100%; background: #1d1d1f; color: #fff; border: none; border-radius: 12px; padding: 14px; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.15s; margin-top: 8px; letter-spacing: -0.2px; }
        .modal-submit:hover { background: #3a3a3c; }
        .modal-submit:disabled { opacity: 0.3; cursor: not-allowed; }
        .modal-cancel { width: 100%; background: #f5f5f7; border: none; color: #1d1d1f; border-radius: 12px; padding: 14px; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif; font-size: 15px; font-weight: 400; cursor: pointer; transition: all 0.15s; margin-top: 8px; }
        .modal-cancel:hover { background: #e8e8ed; }

        .tag { display: inline-flex; align-items: center; background: #f5f5f7; border-radius: 980px; padding: 5px 12px; font-size: 12px; color: #6e6e73; font-weight: 400; letter-spacing: -0.1px; }
      `}</style>

      {/* Lead Capture Sheet */}
      {showLeadForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLeadForm(false)}>
          <div className="modal-box">
            <div className="modal-handle" />
            {leadSubmitted ? (
              <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.5px", marginBottom: 8 }}>You're all set</div>
                <div style={{ fontSize: 14, color: "#6e6e73", lineHeight: 1.6 }}>We'll be in touch shortly to help you get started.</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 22, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.5px", marginBottom: 6 }}>Get Pre-Qualified</div>
                <div style={{ fontSize: 14, color: "#6e6e73", marginBottom: 24, lineHeight: 1.5 }}>Enter your info below and a loan officer will reach out to help you get started.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <input className="modal-input" placeholder="Full name" value={leadData.name} onChange={(e) => setLeadData({ ...leadData, name: e.target.value })} />
                  <input className="modal-input" placeholder="Email address" type="email" value={leadData.email} onChange={(e) => setLeadData({ ...leadData, email: e.target.value })} />
                  <input className="modal-input" placeholder="Phone number (optional)" type="tel" value={leadData.phone} onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })} />
                </div>
                <button className="modal-submit" onClick={handleLeadSubmit} disabled={!leadData.name || !leadData.email}>Continue</button>
                <button className="modal-cancel" onClick={() => setShowLeadForm(false)}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Loan Officer Sheet */}
      {showLoanModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLoanModal(false)}>
          <div className="modal-box">
            <div className="modal-handle" />
            <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 20px" }}>🏦</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.5px", marginBottom: 10 }}>Partner Feature</div>
              <div style={{ fontSize: 14, color: "#6e6e73", lineHeight: 1.6, maxWidth: 300, margin: "0 auto 20px" }}>
                Direct loan officer access is available when HomeBase AI is deployed through a partnered mortgage brokerage.
              </div>
              <div style={{ background: "#f5f5f7", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#6e6e73", lineHeight: 1.6 }}>
                Are you a mortgage broker or lender?{" "}
                <span style={{ color: "#0071e3", cursor: "pointer", fontWeight: 500 }} onClick={() => { setShowLoanModal(false); setShowLeadForm(true); }}>
                  Contact us →
                </span>
              </div>
            </div>
            <button className="modal-cancel" onClick={() => setShowLoanModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Nav */}
      <div style={{ width: "100%", maxWidth: 680, padding: "20px 24px 0", position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}><img src="/logo.svg" style={{width:"100%",height:"100%",objectFit:"contain"}} alt="HomeBase AI"/></div>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.3px" }}>HomeBase AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34c759" }} />
          <span style={{ fontSize: 12, color: "#6e6e73", letterSpacing: "-0.1px" }}>Online</span>
        </div>
      </div>

      {/* Hero */}
      {!started && (
        <div className={`hero-fade ${heroVisible ? "visible" : ""}`} style={{ opacity: 0, transform: "translateY(16px)", width: "100%", maxWidth: 680, padding: "80px 24px 48px", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 20 }}>
            <span className="tag">Free · No signup required</span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 18 }}>
            Understand your<br />mortgage.<br /><span style={{ color: "#6e6e73", fontWeight: 400 }}>Simply.</span>
          </h1>
          <p style={{ fontSize: 17, color: "#6e6e73", lineHeight: 1.6, maxWidth: 440, marginBottom: 36, letterSpacing: "-0.2px" }}>
            Ask anything about home loans, rates, and the buying process — get clear answers instantly, 24/7.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 56 }}>
            <button className="primary-btn" onClick={startChat}>Get started</button>
            <button className="ghost-btn" onClick={() => setShowLeadForm(true)}>Get pre-qualified</button>
          </div>

          <div style={{ borderTop: "1px solid #f5f5f7", paddingTop: 32 }}>
            <div style={{ fontSize: 11, color: "#aeaeb2", marginBottom: 16, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Common questions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} className="sq-btn" onClick={() => { startChat(); setTimeout(() => sendMessage(q.text), 400); }}>
                  <span style={{ fontSize: 11, color: "#aeaeb2", fontWeight: 500, letterSpacing: "0.02em" }}>{q.icon}</span>
                  <span style={{ letterSpacing: "-0.1px" }}>{q.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat */}
      {started && (
        <div className={`chat-fade ${chatVisible ? "visible" : ""}`} style={{ opacity: 0, width: "100%", maxWidth: 680, display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ padding: "12px 24px 0" }}>
            <div style={{ fontSize: 11, color: "#aeaeb2", letterSpacing: "-0.1px" }}>
              For educational purposes only — not financial advice.
            </div>
          </div>

          <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14, overflowY: "auto", minHeight: 0, maxHeight: "calc(100vh - 260px)" }}>
            {messages.map((msg, i) => (
              <div key={i} className="msg-in" style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}><img src="/logo.svg" style={{width:"100%",height:"100%",objectFit:"contain"}} alt="HomeBase AI"/></div>
                )}
                <div style={{
                  maxWidth: "78%",
                  background: msg.role === "user" ? "#1d1d1f" : "#f5f5f7",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "11px 15px",
                  color: msg.role === "user" ? "#fff" : "#1d1d1f",
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  letterSpacing: "-0.1px",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg-in" style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}><img src="/logo.svg" style={{width:"100%",height:"100%",objectFit:"contain"}} alt="HomeBase AI"/></div>
                <div style={{ background: "#f5f5f7", borderRadius: "18px 18px 18px 4px", padding: "13px 15px" }}>
                  <div className="dot-pulse"><span /><span /><span /></div>
                </div>
              </div>
            )}

            {showSuggestions && messages.length === 1 && (
              <div className="msg-in" style={{ marginTop: 6 }}>
                <div style={{ fontSize: 11, color: "#aeaeb2", marginBottom: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Common questions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} className="sq-btn" onClick={() => sendMessage(q.text)}>
                      <span style={{ fontSize: 11, color: "#aeaeb2" }}>{q.icon}</span>
                      <span>{q.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Buttons */}
          <div style={{ padding: "0 24px 10px", display: "flex", gap: 8, justifyContent: "center" }}>
            <button className="primary-btn" style={{ fontSize: 13, padding: "9px 20px" }} onClick={() => setShowLeadForm(true)}>
              Get Pre-Qualified
            </button>
            <button className="ghost-btn" style={{ fontSize: 13, padding: "8px 20px" }} onClick={() => setShowLoanModal(true)}>
              Talk to a Loan Officer
            </button>
          </div>

          {/* Input */}
          <div style={{ padding: "0 24px 28px" }}>
            <div className="input-wrap" style={{ background: "#fff", border: "1px solid #d1d1d6", borderRadius: 14, padding: "11px 11px 11px 16px", display: "flex", alignItems: "flex-end", gap: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
                onKeyDown={handleKey}
                placeholder="Ask anything about mortgages..."
                style={{ maxHeight: 120 }}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "#d1d1d6", marginTop: 8, letterSpacing: "-0.1px" }}>
              Powered by Claude · HomeBase AI
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

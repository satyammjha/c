import React, { useState } from "react";
import { BackgroundBeams } from "../ui/background-beams";
import { Phone, Brain, MessageCircle, FileText, Users, Mic, Volume2 } from "lucide-react";

export default function ZiaVoiceWaitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch('http://localhost:5000/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else if (response.status === 400) {
        setStatus("already-subscribed");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen">
      <section className="h-[40rem] w-full relative flex flex-col items-center justify-center antialiased bg-black shadow-[0px_0px_60px_rgba(139,69,255,0.3)]">
        <div className="max-w-4xl mx-auto p-4 relative z-10">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
              Meet Zia
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 text-center font-medium mb-2">
              Your AI Voice Resume Coach
            </p>
            <p className="text-lg text-neutral-400 text-center">
              Just call and get personalized feedback in Hindi/English
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6 order-2 md:order-1">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3 text-white">
                  <FileText className="w-5 h-5 text-neutral-400" />
                  <span className="text-lg">Smart Resume Analysis</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Phone className="w-5 h-5 text-neutral-400" />
                  <span className="text-lg">Voice-Based Feedback</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <MessageCircle className="w-5 h-5 text-neutral-400" />
                  <span className="text-lg">Natural Hinglish Conversation</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Users className="w-5 h-5 text-neutral-400" />
                  <span className="text-lg">WhatsApp Follow-ups</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 md:border-l md:border-neutral-700 md:pl-8 order-1 md:order-2">
              <div className="flex items-center gap-4">
                <Brain className="w-7 h-7 text-neutral-400" />
                <div>
                  <h2 className="text-xl font-semibold text-white">AI-Powered Analysis</h2>
                  <p className="text-neutral-400">Deep insights on skills, layout & relevance</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Volume2 className="w-7 h-7 text-neutral-400" />
                <div>
                  <h2 className="text-xl font-semibold text-white">Voice First Experience</h2>
                  <p className="text-neutral-400">Friendly AI that speaks your language</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mic className="w-7 h-7 text-neutral-400" />
                <div>
                  <h2 className="text-xl font-semibold text-white">Contextual Memory</h2>
                  <p className="text-neutral-400">Remembers your conversation flow</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/50 rounded-2xl p-6 mb-8 border border-neutral-800">
            <h3 className="text-2xl font-bold text-center text-white mb-4">How Zia Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <p className="text-white font-medium">Upload Resume</p>
                <p className="text-neutral-400 text-sm">Share your resume for AI analysis</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <p className="text-white font-medium">Call Zia</p>
                <p className="text-neutral-400 text-sm">Get personalized voice feedback</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <p className="text-white font-medium">Improve & Apply</p>
                <p className="text-neutral-400 text-sm">Get WhatsApp summary & take action</p>
              </div>
            </div>
          </div>

          <div onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email for early access to Zia"
              placeholder="your.email@example.com"
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-400 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
            <button
              onClick={handleSubmit}
              disabled={status === "submitting"}
              className="bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
              aria-label="Join Zia's waitlist"
            >
              <Phone className="w-5 h-5" />
              {status === "submitting" ? "Joining..." : "Talk to Zia Soon"}
            </button>
          </div>

          {status === "success" && (
            <div className="text-center mb-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
              <p className="text-white">🎉 You're on the list! Zia will be in touch soon!</p>
            </div>
          )}

          {status === "already-subscribed" && (
            <div className="text-center mb-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
              <p className="text-white">👍 You're already on Zia's waitlist!</p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center mb-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg">
              <p className="text-white">⚠️ Failed to join waitlist. Please try again.</p>
            </div>
          )}

          <div className="text-center text-neutral-400 text-sm">
            <p>🇮🇳 Built for Indian job seekers • Speaks Hindi & English • Completely Free</p>
          </div>
        </div>

        <BackgroundBeams />
      </section>
    </div>
  );
}
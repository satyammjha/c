import React from "react";
import { BackgroundBeams } from "../components/ui/background-beams";
import { Rocket } from "lucide-react";

export default function Waitlist() {
  return (
    <div className="h-[40rem] w-full relative flex flex-col items-center justify-center antialiased bg-black shadow-[0px_0px_60px_rgba(0,255,255,0.2)]">
      <div className="max-w-2xl mx-auto p-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 drop-shadow-lg mb-6">
          Meet Your 24/7 Job Agent
        </h1>

        <p className="text-lg text-gray-300 max-w-3xl mx-auto text-center mb-8">
          The AI that applies while you sleep. Never miss a perfect opportunity with your{" "}
          <span className="font-semibold text-emerald-400">relentless digital job hunter</span> working round-the-clock.
        </p>

        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="careers@yourdreamcompany.com"
            className="flex-1 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder:text-gray-400 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
          />
          <button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.05] shadow-lg">
            <Rocket className="w-5 h-5 animate-pulse" />
            First in Line
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-6 opacity-90">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400 drop-shadow-md">10K+</div>
            <div className="text-sm text-gray-400">Early Signups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400 drop-shadow-md">24/7</div>
            <div className="text-sm text-gray-400">Application Monitoring</div>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500 mt-8">
          Be among the first to deploy your personal job agent. We never store or share your data.
        </p>
      </div>

      <BackgroundBeams className="from-cyan-900/30 via-emerald-700/20 to-gray-900/30" />
    </div>
  );
}

import React from "react";
import { BackgroundBeams } from "../components/ui/background-beams";
import { Rocket, Zap, ShieldCheck, Globe, Briefcase, UserCheck, ChartAreaIcon } from "lucide-react";

export default function JobAgentWaitlist() {
  return (
    <section className="h-[40rem] w-full relative flex flex-col items-center justify-center antialiased bg-black shadow-[0px_0px_60px_rgba(0,255,255,0.2)]">
      <div className="max-w-4xl mx-auto p-4 relative z-10">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 mb-4">
            JobHunter AI
          </h1>
          <p className="text-xl md:text-2xl text-cyan-200 text-center font-medium">
            24/7 AI Career Partner
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="space-y-6 order-2 md:order-1">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3 text-emerald-400">
                <Briefcase className="w-6 h-6" />
                <span className="text-lg">Automated Job Applications</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-400">
                <ChartAreaIcon className="w-6 h-6" />
                <span className="text-lg">Market Insights Engine</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-400">
                <UserCheck className="w-6 h-6" />
                <span className="text-lg">Smart Match Technology</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:border-l md:border-emerald-400/20 md:pl-8 order-1 md:order-2">
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-emerald-400" />
              <div>
                <h2 className="text-xl font-semibold text-cyan-300">Instant Matching</h2>
                <p className="text-gray-400">AI-powered job profile alignment</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Globe className="w-8 h-8 text-emerald-400" />
              <div>
                <h2 className="text-xl font-semibold text-cyan-300">Global Reach</h2>
                <p className="text-gray-400">45+ countries supported</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <div>
                <h2 className="text-xl font-semibold text-cyan-300">Secure</h2>
                <p className="text-gray-400">Enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mb-8">
          <input
            type="email"
            aria-label="Email for early access"
            placeholder="career@yourfuture.com"
            className="flex-1 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder:text-gray-400 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            aria-label="Get early access"
          >
            <Rocket className="w-5 h-5 animate-pulse" />
            Join Waitlist
          </button>
        </div>

        <footer className="mt-8 border-t border-emerald-400/20 pt-6">
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div>
              <div className="text-xl font-bold text-emerald-400">15K+</div>
              <div className="text-sm text-gray-400">Users</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">2M+</div>
              <div className="text-sm text-gray-400">Applications</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">86%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500 max-w-xl mx-auto">
            Trusted by professionals worldwide. GDPR compliant & secure.
          </p>
        </footer>
      </div>

      <BackgroundBeams className="from-cyan-900/30 via-emerald-700/20 to-gray-900/30" />
    </section>
  );
}
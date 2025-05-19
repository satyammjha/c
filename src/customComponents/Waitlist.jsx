import React from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { BackgroundBeams } from "../components/ui/background-beams";
import { Rocket, Zap, ShieldCheck, Globe, Briefcase, UserCheck, ChartAreaIcon } from "lucide-react";

export default function JobAgentWaitlist() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");

    try {
      const response = await axios.post('http://localhost:5000/newsletter/subscribe', {
        email: email
      });

      toast.success(response.data.message || "🎉 You're on the list! We'll notify you about career tech advancements");
      e.target.reset();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.info(error.response.data.message || "👍 You're already subscribed to our updates!");
        } else {
          toast.error(error.response.data.message || '⚠️ Failed to subscribe. Please try again.');
        }
      } else {
        toast.error('🚨 Network error - please check your connection');
      }
    }
  };

  return (
    <section className="h-[40rem] w-full relative flex flex-col items-center justify-center antialiased bg-black shadow-[0px_0px_60px_rgba(0,255,255,0.2)]">
      <div className="max-w-4xl mx-auto p-4 relative z-10">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 mb-4">
            Future Career Technology
          </h1>
          <p className="text-xl md:text-2xl text-cyan-200 text-center font-medium">
            First access to AI-powered job search innovations
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="space-y-6 order-2 md:order-1">
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3 text-emerald-400">
                <Briefcase className="w-6 h-6" />
                <span className="text-lg">Next-Gen Application Automation</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-400">
                <ChartAreaIcon className="w-6 h-6" />
                <span className="text-lg">Real-time Market Intelligence</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-400">
                <UserCheck className="w-6 h-6" />
                <span className="text-lg">Smart Career Matching</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:border-l md:border-emerald-400/20 md:pl-8 order-1 md:order-2">
            <div className="flex items-center gap-4">
              <Zap className="w-8 h-8 text-emerald-400" />
              <div>
                <h2 className="text-xl font-semibold text-cyan-300">Pioneering AI</h2>
                <p className="text-gray-400">Developing next-gen job search automation</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Globe className="w-8 h-8 text-emerald-400" />
              <div>
                <h2 className="text-xl font-semibold text-cyan-300">Global Vision</h2>
                <p className="text-gray-400">Building worldwide career solutions</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <div>
                <h2 className="text-xl font-semibold text-cyan-300">Privacy First</h2>
                <p className="text-gray-400">Enterprise-grade data security</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mb-8">
          <input
            type="email"
            name="email"
            required
            aria-label="Email for early access"
            placeholder="yourname@careerpath.com"
            className="flex-1 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder:text-gray-400 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            aria-label="Get early access"
          >
            <Rocket className="w-5 h-5 animate-pulse" />
            Get Early Access
          </button>
        </form>
      </div>

      <BackgroundBeams className="from-cyan-900/30 via-emerald-700/20 to-gray-900/30" />
    </section>
  );
}
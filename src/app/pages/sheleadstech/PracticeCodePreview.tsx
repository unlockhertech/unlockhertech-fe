import { useState } from "react";
import {
  HiLightBulb,
  HiCheckCircle,
  HiCpuChip,
  HiUsers,
} from "react-icons/hi2";
import { SAMPLE_CODE } from "./practicesData";

export function PracticeCodePreview() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(SAMPLE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="py-16 bg-white border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Interactive Code Card */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 font-mono text-xs sm:text-sm">
              {/* Header bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-800 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <span className="ml-2 text-gray-400 text-xs font-sans">two-pointers-pattern.ts</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs font-sans font-semibold text-gray-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>

              {/* Code Body */}
              <div className="p-6 overflow-x-auto text-gray-200 leading-relaxed">
                <pre>{SAMPLE_CODE}</pre>
              </div>

              {/* Footer Tag bar */}
              <div className="px-5 py-3 bg-neutral-950/80 border-t border-white/5 flex flex-wrap items-center gap-3 font-sans text-xs">
                <span className="text-brand-green font-bold flex items-center gap-1">
                  <HiCheckCircle className="w-4 h-4" /> Solved Together Live
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300">Level: Easy / Medium</span>
                <span className="text-gray-400">|</span>
                <span className="text-brand-yellow">Two Pointers</span>
              </div>
            </div>
          </div>

          {/* Right: How we teach */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/20 text-brand-coral text-xs font-bold uppercase tracking-wider mb-4">
              <HiLightBulb className="w-4 h-4" /> Pattern-First Learning
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-5 leading-tight">
              Master Patterns, <br />
              <span className="text-brand-coral">Not Just Solutions</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Memorizing thousands of LeetCode problems doesn&apos;t work. In our sessions, we focus on identifying the <strong>core mental models</strong> so you can solve novel problems on the spot during technical interviews.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-blue-50 text-brand-blue shrink-0 mt-0.5">
                  <HiCpuChip className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Dissect Time & Space Trade-offs</h3>
                  <p className="text-gray-500 text-xs">Learn how to articulate Big-O bounds confidently to interviewers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-xl bg-pink-50 text-brand-coral shrink-0 mt-0.5">
                  <HiUsers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Pair Programming Dynamics</h3>
                  <p className="text-gray-500 text-xs">Collaborate with peers, practice thinking out loud, and overcome interview anxiety.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

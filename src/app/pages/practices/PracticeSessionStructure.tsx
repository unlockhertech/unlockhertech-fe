
export function PracticeSessionStructure() {
  return (
    <section className="py-20 bg-white border-y border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
            Session Structure
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            How a Typical 70-Minute Practice Runs
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Every session is structured to maximize active coding time and mutual support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-stone-50 rounded-3xl p-8 border border-gray-200/80 relative">
            <div className="w-10 h-10 rounded-2xl bg-brand-coral text-white font-extrabold flex items-center justify-center mb-6 text-base">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Problem Deconstruction</h3>
            <p className="text-xs uppercase font-bold text-brand-coral tracking-wider mb-3">15 Minutes</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              We break down the problem statement, clarify edge cases, identify input constraints, and map out brute-force vs optimal algorithmic patterns together.
            </p>
          </div>

          <div className="bg-stone-50 rounded-3xl p-8 border border-gray-200/80 relative">
            <div className="w-10 h-10 rounded-2xl bg-brand-blue text-white font-extrabold flex items-center justify-center mb-6 text-base">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborative Live Coding</h3>
            <p className="text-xs uppercase font-bold text-brand-blue tracking-wider mb-3">35 Minutes</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              We write clean, commented code together in real time, testing edge cases, debugging solutions, and discussing trade-offs as a group.
            </p>
          </div>

          <div className="bg-stone-50 rounded-3xl p-8 border border-gray-200/80 relative">
            <div className="w-10 h-10 rounded-2xl bg-brand-green text-white font-extrabold flex items-center justify-center mb-6 text-base">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Debrief & Optimization</h3>
            <p className="text-xs uppercase font-bold text-brand-green tracking-wider mb-3">20 Minutes</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              We analyze time/space complexity, explore alternative optimizations, and share practical technical interview takeaways.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

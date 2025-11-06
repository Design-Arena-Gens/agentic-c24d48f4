export function Hero(): JSX.Element {
  return (
    <section className="mb-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-iris/15 via-transparent to-neon/10 p-10 text-white shadow-glow">
      <div className="flex flex-col gap-4">
        <span className="w-fit rounded-full border border-neon/30 bg-neon/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-neon">
          Sparse Mixture-of-Experts
        </span>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Architecting a truly sparse large language model that fires only the neurons demanded by the task.
        </h1>
        <p className="max-w-3xl text-lg text-white/70">
          This interactive architecture maps token routing, expert capacity allocation, and per-neuron activations
          within a sparse transformer core. Explore how structured gating yields high-capacity reasoning without
          dense compute costs.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Routing depth",
            value: "Hierarchical top-k",
            hint: "Layered routers cascade towards specialised experts."
          },
          {
            label: "Neuron budget",
            value: "Adaptive capacity",
            hint: "Experts enforce quotas to remain sparse under load."
          },
          {
            label: "Supervision",
            value: "Distillation + token-level load balancing",
            hint: "Sparse regularisers keep the activation frontier sharp."
          },
          {
            label: "Hardware profile",
            value: "Tensor parallel + dynamic batching",
            hint: "Designed for VLIW and GPU dispatch with low variance."
          }
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
            <p className="text-xs text-white/60">{item.hint}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

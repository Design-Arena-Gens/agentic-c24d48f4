const PHASES = [
  {
    name: "Token Sketch",
    detail: "Prompt tokens flow into a lightweight gating transformer that predicts a sparse route sketch.",
    tech: "Routing transformer, low-rank SwiGLU, load-aware logits."
  },
  {
    name: "Expert Dispatch",
    detail: "Top-k experts receive batched tokens. Each expert performs non-linear transformations within its shard.",
    tech: "Mixture-of-experts feed-forward, tensor parallel, activation checkpointing."
  },
  {
    name: "Sparse Merge",
    detail: "Activated neurons are concatenated and projected through block-sparse matrices into the dense stream.",
    tech: "Segmented gather, block-sparse GEMM, unified projection head."
  },
  {
    name: "Feedback & Training",
    detail: "Routing gradients flow back only across active branches, guided by load balancing and sparsity penalties.",
    tech: "Load balancing loss, auxiliary distillation, straight-through estimators."
  }
] as const;

export function Pipeline(): JSX.Element {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-10">
      <header className="mb-6">
        <h2 className="text-3xl font-semibold text-white">Execution Pipeline</h2>
        <p className="mt-2 text-sm text-white/70">
          Runtime path showing how sparse computation keeps the parameter budget high while compute stays bounded.
        </p>
      </header>
      <ol className="grid gap-4 md:grid-cols-2">
        {PHASES.map((phase, index) => (
          <li
            key={phase.name}
            className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-black/20 via-transparent to-white/5 p-6"
          >
            <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-iris text-lg font-semibold text-white shadow-glow">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold text-white">{phase.name}</h3>
            <p className="mt-2 text-sm text-white/70">{phase.detail}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-neon">{phase.tech}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

const MODULES = [
  {
    title: "Hierarchical Token Router",
    description:
      "Sparse LLM begins by splitting tokens across a two-level router stack. The first router filters obvious routes (e.g. numeric vs. natural language), while the second stage enforces top-k gating using load-aware dispatch.",
    bullets: [
      "Multi-head gating nets produce coarse specialisation logits.",
      "Budget constraints prune long-tail activations to maintain target sparsity.",
      "Entropy regularisation keeps routing diversity high."
    ]
  },
  {
    title: "Expert Islands",
    description:
      "Each expert capsule is a compact feed-forward island with its own parameter budget. Experts never share weights, but they share interface norms to stay swappable under routing noise.",
    bullets: [
      "Local key-value memories support in-expert recurrence.",
      "Sub-graph parallelism lets experts run on separate GPU lanes.",
      "Capacity-aware batching prevents overload and token drops."
    ]
  },
  {
    title: "Sparse Projection Head",
    description:
      "Activated experts merge through a sparse projection head that only materialises the union of fired neurons. This keeps downstream attention layers dense while intermediate layers stay sparse.",
    bullets: [
      "Per-expert linear projections use block-sparse matrices.",
      "Outputs are stitched with learned gating masks.",
      "Gradients propagate only across the active subgraph."
    ]
  }
] as const;

export function Blueprint(): JSX.Element {
  return (
    <section className="flex flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-10">
      <header>
        <h2 className="text-3xl font-semibold text-white">Blueprint</h2>
        <p className="mt-2 text-sm text-white/70">
          A sparse LLM is not merely a dense model with pruning—it is architected so that sparsity is a first-class
          citizen in routing, execution, and gradient flow.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {MODULES.map((module) => (
          <article
            key={module.title}
            className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-iris/10 via-transparent to-neon/10 p-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-white">{module.title}</h3>
              <p className="mt-3 text-sm text-white/65">{module.description}</p>
            </div>
            <ul className="space-y-2 text-sm text-white/65">
              {module.bullets.map((bullet) => (
                <li key={bullet}>• {bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

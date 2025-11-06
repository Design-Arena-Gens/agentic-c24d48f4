/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-array-index-key */
"use client";
import { Fragment, useMemo } from "react";
import { useSparseStore } from "@/lib/store";
import type { SparseExpert, SparseNeuron } from "@/lib/sparseModel";

const ROLE_COLORS: Record<SparseNeuron["role"], string> = {
  semantic: "bg-emerald-400/80",
  syntactic: "bg-iris/70",
  "world-model": "bg-ember/70",
  routing: "bg-neon/70"
};

function ActivationBadge({ value }: { value: number }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-neon">
      {(value * 100).toFixed(1)}%
    </span>
  );
}

function SectionHeader({ title, hint }: { title: string; hint: string }) {
  return (
    <header className="flex items-baseline justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-xs uppercase tracking-[0.28em] text-white/50">{hint}</p>
      </div>
    </header>
  );
}

function ExpertCard({ expert }: { expert: SparseExpert }) {
  const neuronSlices = expert.neurons.slice(0, 12);
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/40 transition hover:border-neon/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Expert</p>
          <h4 className="text-lg font-semibold text-white">{expert.id}</h4>
        </div>
        <ActivationBadge value={expert.activeNeurons / Math.max(1, expert.neurons.length)} />
      </div>
      <p className="text-sm text-white/70">{expert.specialization}</p>
      <div className="grid grid-cols-6 gap-2">
        {neuronSlices.map((neuron) => (
          <span
            key={neuron.id}
            className={`block h-6 rounded-lg ${ROLE_COLORS[neuron.role]} ${
              neuron.fired ? "opacity-100" : "opacity-30"
            }`}
            title={`${neuron.id} — ${(neuron.activation * 100).toFixed(1)}%`}
            style={{
              boxShadow: neuron.fired ? "0 0 12px rgba(107, 243, 255, 0.5)" : undefined
            }}
          />
        ))}
      </div>
      <footer className="flex items-center justify-between text-xs text-white/60">
        <span>Capacity {expert.capacity}</span>
        <span>Load {expert.load.toFixed(2)}</span>
      </footer>
    </article>
  );
}

function TokenRouteRow({
  token,
  experts,
  sparsity,
  dropped
}: {
  token: string;
  experts: string[];
  sparsity: number;
  dropped: boolean;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr_90px] items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
        {token}
      </span>
      <div className="flex flex-wrap gap-2">
        {experts.map((expert, index) => (
          <span key={index} className="rounded-full bg-iris/20 px-3 py-1 text-xs text-neon">
            {expert}
          </span>
        ))}
        {dropped && (
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-200">
            dropped
          </span>
        )}
      </div>
      <span className="text-right text-xs text-white/60">sparsity {(sparsity * 100).toFixed(1)}%</span>
    </div>
  );
}

export function SparseExplorer(): JSX.Element {
  const snapshot = useSparseStore((state) => state.snapshot);

  const stats = useMemo(
    () => [
      {
        label: "Global activation",
        value: `${(snapshot.activationRate * 100).toFixed(1)}%`,
        hint: "Percent of neurons firing globally."
      },
      {
        label: "Expert utilisation",
        value: `${(snapshot.expertUtilisation * 100).toFixed(1)}%`,
        hint: "Average fill-rate relative to reserved capacity."
      },
      {
        label: "Inactive tokens",
        value: `${snapshot.droppedTokens}`,
        hint: "Tokens gated out to enforce budget."
      }
    ],
    [snapshot]
  );

  return (
    <section className="mt-12 flex flex-col gap-10">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-transparent to-white/5 p-5"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
            <p className="text-xs text-white/70">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr,3fr]">
        <div className="flex flex-col gap-4">
          <SectionHeader title="Token Routing" hint="ROUTER → EXPERTS" />
          <div className="flex flex-col gap-2">
            {snapshot.routes.map((route) => (
              <TokenRouteRow
                key={route.id}
                token={route.token}
                experts={route.experts}
                sparsity={route.sparsity}
                dropped={route.dropped}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <SectionHeader title="Expert Capsules" hint="SPECIALISED NEURONS" />
          <div className="grid gap-4 md:grid-cols-2">
            {snapshot.experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <SectionHeader title="Firing Distribution" hint="SPARSITY ENFORCEMENT" />
        <div className="mt-4 grid gap-6 md:grid-cols-[2fr,3fr]">
          <div className="flex flex-col gap-3">
            <p className="text-sm text-white/70">
              This synthetic layer enforces sparsity by constraining activation budgets per expert. Tokens compete
              for paths through the router, generating mixture routes. Only the neurons with the highest projected
              utility spike, leaving the majority idle.
            </p>
            <ul className="space-y-2 text-sm text-white/65">
              <li>• Deterministic gating derived from token semantics and expert capacity.</li>
              <li>• Load-aware routing penalises experts nearing capacity to maintain balance.</li>
              <li>• Neuron roles diversify the representation while keeping activations sparse.</li>
            </ul>
          </div>
          <div className="grid gap-3">
            {snapshot.experts.map((expert) => (
              <Fragment key={expert.id}>
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span className="font-semibold text-white">{expert.id}</span>
                  <span>
                    {expert.activeNeurons}/{expert.neurons.length} fired
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-iris to-neon transition-[width]"
                    style={{
                      width: `${(expert.activeNeurons / Math.max(1, expert.neurons.length)) * 100}%`
                    }}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

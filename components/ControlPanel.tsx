/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-array-index-key */
"use client";
import { useMemo } from "react";
import type { SparseConfig } from "@/lib/sparseModel";
import { LAYER_KIND_LABELS, useSparseStore } from "@/lib/store";

interface ControlDescriptor {
  key: "expertCount" | "neuronsPerExpert" | "topK" | "targetSparsity";
  label: string;
  min: number;
  max: number;
  step: number;
  format: (value: number) => string;
}

const CONTROLS: ControlDescriptor[] = [
  {
    key: "expertCount",
    label: "Experts",
    min: 4,
    max: 16,
    step: 1,
    format: (value) => `${value}`
  },
  {
    key: "neuronsPerExpert",
    label: "Neurons / Expert",
    min: 32,
    max: 160,
    step: 8,
    format: (value) => `${value}`
  },
  {
    key: "topK",
    label: "Top-k Paths",
    min: 1,
    max: 4,
    step: 1,
    format: (value) => `k=${value}`
  },
  {
    key: "targetSparsity",
    label: "Target Sparsity",
    min: 0.04,
    max: 0.25,
    step: 0.01,
    format: (value) => `${Math.round(value * 100)}%`
  }
];

export function ControlPanel(): JSX.Element {
  const config = useSparseStore((state) => state.config);
  const updateConfig = useSparseStore((state) => state.updateConfig);
  const setPrompt = useSparseStore((state) => state.setPrompt);
  const prompt = useSparseStore((state) => state.prompt);

  const highlights = useMemo(
    () => [
      {
        label: "Activation rate",
        value: `${Math.round(config.targetSparsity * 100)}%`,
        hint: "Fraction of global neurons allowed to fire."
      },
      {
        label: "Routing depth",
        value: `Top-${config.topK}`,
        hint: "Number of expert paths per token."
      },
      {
        label: "Total neurons",
        value: `${config.expertCount * config.neuronsPerExpert}`,
        hint: "Model width exposed to this layer."
      }
    ],
    [config]
  );

  return (
    <section className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-lg">
      <div className="grid gap-6 p-6 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-4">
          <header>
            <h2 className="text-xl font-semibold text-white">Sparse Routing Controls</h2>
            <p className="text-sm text-white/70">
              Tune the router to enforce hard sparsity while maintaining coverage across expert domains.
            </p>
          </header>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LAYER_KIND_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => updateConfig({ layerKind: key as SparseConfig["layerKind"] })}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  config.layerKind === key
                    ? "border-neon bg-neon/20 text-neon"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-neon/40 hover:text-neon"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-6">
            {CONTROLS.map((control) => (
              <div key={control.key}>
                <div className="mb-2 flex items-center justify-between text-sm text-white/75">
                  <span>{control.label}</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 font-medium text-white">
                    {control.format(config[control.key] as number)}
                  </span>
                </div>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={config[control.key] as number}
                  onChange={(event) => {
                    const raw =
                      control.key === "targetSparsity"
                        ? Number.parseFloat(event.target.value)
                        : Number.parseInt(event.target.value, 10);
                    updateConfig({ [control.key]: raw } as Partial<SparseConfig>);
                  }}
                  className="w-full accent-iris"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm text-white/70" htmlFor="prompt">
              Routing prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-glow focus:outline-none focus:ring-2 focus:ring-iris/60"
            />
          </div>
        </div>
        <aside className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-br from-iris/20 via-transparent to-neon/10 p-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-neon">
              Layer Kind
            </h3>
            <p className="mt-2 text-lg font-semibold text-white">
              {LAYER_KIND_LABELS[config.layerKind]}
            </p>
            <p className="text-xs text-white/70">
              Router-type decides the attention budget and gating heuristics used to enforce sparsity.
            </p>
          </div>
          <div className="grid gap-3">
            {highlights.map((highlight) => (
              <div key={highlight.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">{highlight.label}</p>
                <p className="mt-1 text-lg font-semibold text-white">{highlight.value}</p>
                <p className="text-xs text-white/60">{highlight.hint}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

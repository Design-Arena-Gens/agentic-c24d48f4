import { Hero } from "./(sections)/Hero";
import { Blueprint } from "./(sections)/Blueprint";
import { Pipeline } from "./(sections)/Pipeline";
import { ControlPanel } from "@/components/ControlPanel";
import { SparseExplorer } from "@/components/SparseExplorer";

export default function Page(): JSX.Element {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Hero />
      <ControlPanel />
      <SparseExplorer />
      <Blueprint />
      <Pipeline />
    </main>
  );
}

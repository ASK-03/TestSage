import Navigation from "@/components/navigation";
import Functionality from "./functionality";

export default function Page() {
  return (
    <main className="w-full min-h-screen bg-secondary-background text-primary">
      <Navigation isHero={false} />
      <Functionality />
    </main>
  );
}

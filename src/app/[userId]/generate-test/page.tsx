import Navigation from "@/components/navigation";
import Functionality from "./functionality";

type Props = {
  params: {
    userId: string;
  };
};

export default function Page({ params }: Props) {
  return (
    <main className="w-full bg-secondary-background text-primary">
      <Functionality userId={params.userId} />
    </main>
  );
}

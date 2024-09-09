import Navigation from "@/components/navigation";
import React from "react";

type Props = {
  params: {
    userId: string;
  };
  children: React.ReactNode;
};

const layout = ({ params, children }: Props) => {
  return (
    <div>
      <Navigation userId={params.userId} isHero={false} />
      {children}
    </div>
  );
};

export default layout;

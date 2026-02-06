import { SmoothCursor } from "@/components/shadcnui/smooth-cursor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MY EXPERIENCE",
  description: "my experience in software development and related fields over the years and the projects I have worked on and the skills I have acquired",
};

const page = () => {
  return (
    <section className="grid h-[90dvh] place-items-center">
      <SmoothCursor />
      <div className=""></div>
    </section>
  );
};

export default page;

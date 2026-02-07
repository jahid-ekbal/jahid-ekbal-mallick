import { Pointer } from "@/components/shadcnui/pointer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MY EXPERIENCE",
  description: "my experience in software development and related fields over the years and the projects I have worked on and the skills I have acquired",
};

const page = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <Pointer />
      <div className=""></div>
    </section>
  );
};

export default page;

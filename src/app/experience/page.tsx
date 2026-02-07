
import { IconCloud } from "@/components/shadcnui/icon-cloud";
import { Pointer } from "@/components/shadcnui/pointer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MY EXPERIENCE",
  description: "my experience in software development and related fields over the years and the projects I have worked on and the skills I have acquired",
};

const page = () => {
  return (
    <section className="">
      <Pointer/>
      
      <div className="relative flex size-full items-center justify-center overflow-hidden">
      <IconCloud />
    </div>
      
    </section>
  );
};

export default page;

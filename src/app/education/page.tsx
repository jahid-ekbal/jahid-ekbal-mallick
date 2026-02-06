import { SmoothCursor } from "@/components/shadcnui/smooth-cursor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MY EDUCATION",
  description: "my education details in software development and related fields",
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

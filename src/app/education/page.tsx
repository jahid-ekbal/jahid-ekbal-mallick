import { Pointer } from "@/components/shadcnui/pointer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MY EDUCATION",
  description: "my education details in software development and related fields",
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

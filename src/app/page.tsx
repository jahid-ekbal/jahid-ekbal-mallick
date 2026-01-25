import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Starter Fullstack",
  description: "Production grade Fullstack Next.js starter template",
};

const page = () => {
  return (
    <section className="grid h-[90dvh] place-items-center">
      <div className=""></div>
    </section>
  );
};

export default page;

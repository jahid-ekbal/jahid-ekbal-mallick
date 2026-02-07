import { Pointer } from "@/components/shadcnui/pointer";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/shadcnui/terminal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABOUT ME - JAHID EKBAL MALLICK",
  description: "About Me section of JAHID EKBAL MALLICK Portfolio Website",
};

const page = () => {
  return (
    <section className="grid h-[90dvh] place-items-center">
      {/* <SmoothCursor /> */}

      <Pointer />

      {/* <div className="place-items-center">  <div className="">

          <MorphingText className=" " texts={["My Portfolio Website", " About me section"]} />

        </div>
      
       </div> */}


      <div className="">
        <Terminal>
  <TypingAnimation>bun i jahidekbalmallick@gmail.com compose mail 📧</TypingAnimation>
  <AnimatedSpan>✔ Verifying your email address.</AnimatedSpan>
  <AnimatedSpan>✔ Validating Your all information.</AnimatedSpan>
  <TypingAnimation>Success! We have successfully verified your information.</TypingAnimation>
</Terminal>
      </div>
    </section>
  );
};

export default page;

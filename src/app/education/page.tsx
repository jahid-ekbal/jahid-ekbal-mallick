import { Pointer } from "@/components/shadcnui/pointer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MY EDUCATION",
  description: "my education details in software development and related fields",
};

const page = () => {
  return (
    <section className="">
      <Pointer />
      
      {/* <div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
  <Antigravity
    count={300}
    magnetRadius={10}
    ringRadius={10}
    waveSpeed={0.4}
    waveAmplitude={1}
    particleSize={2}
    lerpSpeed={0.1}
    color="#FF9FFC"
    autoAnimate={false}
    particleVariance={1}
    rotationSpeed={0}
    depthFactor={1}
    pulseSpeed={3}
    particleShape="capsule"
    fieldStrength={10}
  />
</div> */}

    </section>
  );
};

export default page;

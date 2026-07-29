import { AboutSection } from "@/components/AboutSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Jahid Ekbal Mallick",
  description:
    "Self-taught software and systems engineer passionate about full-stack web applications, desktop optimization, IoT automation, and building scalable tech products.",
};

const AboutPage = () => {
  return <AboutSection />;
};

export default AboutPage;

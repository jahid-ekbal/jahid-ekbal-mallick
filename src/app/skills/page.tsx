import { SkillsSection } from "@/components/SkillsSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | Jahid Ekbal Mallick",
  description:
    "Technical stack and programming languages used by Jahid Ekbal Mallick.",
};

const SkillsPage = () => {
  return <SkillsSection />;
};

export default SkillsPage;

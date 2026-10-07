import Section from "@/components/Section";
import { InView } from "@/components/shadcnui/in-view";
import type { SkillGroup } from "@/components/profile";

const riseVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const riseViewOptions = {
  margin: "0px 0px -10% 0px",
  amount: 0.12,
  once: true,
} as const;

const SkillsSection = ({ skills }: { skills: SkillGroup[] }) => {
  if (skills.length === 0) return null;

  return (
    <Section title={"Skills and tools"}>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, gi) => (
          <InView
            key={group.category}
            className="inview-rise"
            variants={riseVariants}
            transition={{ duration: 0.7, ease: "easeOut", delay: gi * 0.06 }}
            viewOptions={riseViewOptions}>
            <h3 className="text-foreground mb-3 text-base font-medium">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border-border text-muted-foreground rounded-full border px-3 py-1.5 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </InView>
        ))}
      </div>
    </Section>
  );
};

export default SkillsSection;

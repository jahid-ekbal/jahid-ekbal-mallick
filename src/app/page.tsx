import { AvatarCircles } from "@/components/shadcnui/avatar-circles";
import { Dock, DockIcon } from "@/components/shadcnui/dock";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/shadcnui/input-group";
import { Pointer } from "@/components/shadcnui/pointer";
import { SparklesText } from "@/components/shadcnui/sparkles-text";
import { WordRotate } from "@/components/shadcnui/word-rotate";
import { Home, SearchIcon, Settings } from "lucide-react";

import { SmoothCursor } from "@/components/shadcnui/smooth-cursor";
import { SparklesText } from "@/components/shadcnui/sparkles-text";
import { WordRotate } from "@/components/shadcnui/word-rotate";
import { Home, Settings } from "lucide-react";

;

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JAHID EKBAL MALLICK",
  description: "JAHID EKBAL MALLICK Portfolio Website",
};

const page = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center ">

   <Pointer />


      <div className="flex flex-col items-center gap-4 text-center">

        <AvatarCircles className=""
  
  avatarUrls={[
    {
      imageUrl: "https://avatars.githubusercontent.com/u/168970202?s=400&u=1e985c26e71ba7fd5f594bb330333e516e123bc9&v=4",
      profileUrl: "https://github.com/jahid-ekbal",
    },
  ]}
/>

        <SparklesText className="text-6xl font-bold">JAHID EKBAL MALLICK is a </SparklesText>

          <WordRotate className="text-4xl font-bold" words={["Full Stack Developer", "Web Pentester"]} />


          <Dock className="mx-20">
  <DockIcon>
    <Home/>
  </DockIcon>
  <DockIcon>
    <Settings/>
  </DockIcon>
  <DockIcon>
   
  </DockIcon>
</Dock>

        </div>

      

   
    </section>
  );
};

export default page;

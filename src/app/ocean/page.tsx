import OceanScene from "@/components/ocean/OceanScene";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ocean | Jahid Ekbal Mallick",
  description:
    "Immersive 3D underwater experience with animated colorful fish.",
};

const OceanPage = () => {
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <OceanScene />
    </div>
  );
};

export default OceanPage;

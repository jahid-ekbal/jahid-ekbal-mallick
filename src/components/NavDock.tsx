import { HomeIcon, SettingsIcon } from "lucide-react";
import { AnimatedThemeToggler } from "./shadcnui/animated-theme-toggler";
import { Dock, DockIcon } from "./shadcnui/dock";

const NavDock = () => {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <Dock>
        <DockIcon>
          <HomeIcon />
        </DockIcon>
        <DockIcon>
          <SettingsIcon />
        </DockIcon>
        <DockIcon>
          <AnimatedThemeToggler />
        </DockIcon>
      </Dock>
    </div>
  );
};

export default NavDock;

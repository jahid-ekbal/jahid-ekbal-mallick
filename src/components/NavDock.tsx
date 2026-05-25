import { LayersIcon } from "lucide-react";
import AnimatedEmailButton from "./Buttons/AnimatedEmailButton";
import GithubIcon from "./icons/GithubIcon";
import NavSetting from "./NavSetting";
import { AnimatedThemeToggler } from "./shadcnui/animated-theme-toggler";
import { Dock, DockIcon } from "./shadcnui/dock";

const NavDock = () => {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <Dock>
        <DockIcon>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer">
            <LayersIcon />
          </a>
        </DockIcon>
        <DockIcon>
          <a
            href="https://github.com/jahid-ekbal"
            target="_blank"
            rel="noopener noreferrer">
            <GithubIcon className="h-6 w-6" />
          </a>
        </DockIcon>
        <DockIcon>
          <AnimatedEmailButton />
        </DockIcon>
        <DockIcon>
          <NavSetting />
        </DockIcon>
        <DockIcon>
          <AnimatedThemeToggler />
        </DockIcon>
      </Dock>
    </div>
  );
};

export default NavDock;

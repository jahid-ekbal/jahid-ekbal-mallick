import Link from "next/link";

const DesktopNav = () => {
  return (
    <nav className="flex gap-4">
      <Link href={"/home"}>Home</Link>
      <Link href={"/projects"}>Projects</Link>
      <Link href={"/skills"}>Skills</Link>
      <Link href={"/tweet"}>Tweet</Link>
      <Link href={"/about"}>About</Link>
      <Link href={"/contact"}>Contact</Link>
    </nav>
  );
};

export default DesktopNav;

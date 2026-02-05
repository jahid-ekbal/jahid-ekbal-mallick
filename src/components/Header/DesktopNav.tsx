import Link from "next/link";

const DesktopNav = () => {
  return (
    <nav className="flex gap-4">
      <Link href={"/"}>Home</Link>
      <Link href={"/education"}>Education</Link>
      <Link href={"/experience"}>Experience</Link>
      <Link href={"/certificates"}>Certificates</Link>
      <Link href={"/about-me"}>About Me</Link>
    </nav>
  );
};

export default DesktopNav;

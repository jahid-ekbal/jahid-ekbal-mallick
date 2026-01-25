import Link from "next/link";

const DesktopNav = () => {
  return (
    <nav className="flex gap-4">
      <Link href={"/"}>Home</Link>
      <Link href={"/"}>Education</Link>
      <Link href={"/"}>Experience</Link>
      <Link href={"/"}>Certificates</Link>
      <Link href={"/"}>About Me</Link>
    </nav>
  );
};

export default DesktopNav;

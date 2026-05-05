import NavDock from "../NavDock";

const Header = () => {
  return (
    <header
      className=""
      aria-label="">
      <NavDock />
      {/* <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href={"/"}>
          <h1
            className="text-2xl font-semibold"
            aria-label="App Name">
            JAHID EKBAL MALLICK
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <ResponsiveToggleNav>
            <MobileNav />
            <DesktopNav />
          </ResponsiveToggleNav>

          <AnimatedThemeToggler />
        </div>
      </div> */}
    </header>
  );
};

export default Header;

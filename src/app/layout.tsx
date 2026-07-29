import ThemeProvider from "@/components/Providers/ThemeProvider";
import Sidebar from "@/components/Layout/Sidebar";
import { geistMono, geistSans, interHeading } from "@/lib/fonts";
import { LayoutProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import "./globals.css";

const RootLayout = ({ children }: LayoutProps) => {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        interHeading.variable,
      )}
      suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          enableSystem={false}>
          <div className="flex min-h-dvh">
            <Sidebar />
            <main className="ml-64 flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

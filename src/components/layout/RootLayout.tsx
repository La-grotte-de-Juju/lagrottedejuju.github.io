import type { ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import StartupNavbar from "@/components/layout/StartupNavbar";

interface RootLayoutProps {
  children: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <StartupNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default RootLayout;

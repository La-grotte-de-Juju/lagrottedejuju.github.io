"use client";

import RootLayout from "@/components/layout/RootLayout";
import LoadingScreen from "@/components/layout/LoadingScreen";
import PageTransition from "@/components/animation/PageTransition";
import { usePathname } from "next/navigation";
import { DevNotification } from "@/components/ui/dev-notification";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const loading = false;

  return (
    <body className="antialiased" suppressHydrationWarning>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <RootLayout>
            <PageTransition key={pathname}>
              <main className="flex-grow">{children}</main>
            </PageTransition>
          </RootLayout>
          <DevNotification />
        </>
      )}
    </body>
  );
}

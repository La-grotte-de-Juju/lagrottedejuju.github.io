"use client";

import { useEffect } from "react";
import RootLayout from "@/components/layout/RootLayout";
import LoadingScreen from "@/components/layout/LoadingScreen";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <body className="antialiased" suppressHydrationWarning>
      <LoadingScreen />
      <RootLayout>{children}</RootLayout>
    </body>
  );
}

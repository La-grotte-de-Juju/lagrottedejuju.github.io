"use client";

import RootLayout from "@/components/layout/RootLayout";
import LoadingScreen from "@/components/layout/LoadingScreen";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="antialiased" suppressHydrationWarning>
      <LoadingScreen />
      <RootLayout>{children}</RootLayout>
    </body>
  );
}

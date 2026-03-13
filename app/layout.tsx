import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bible Atlas",
  description: "An interactive 3D map of Bible geography and events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

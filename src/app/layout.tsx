import type { Metadata } from "next";
import "./globals.css";
// CesiumJS requires its own stylesheet for the map viewer UI
import "cesium/Build/Cesium/Widgets/widgets.css";

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

import type { Metadata } from "next";
import "./globals.css";
import { MusicPlayerProvider } from "@/components/MusicPlayer";

export const metadata: Metadata = {
  title: "Dedicate a Song - Women's History Month",
  description: "A public digital pin board where people dedicate songs from the Women's History Month playlist to women who inspire them.",
  openGraph: {
    title: "Dedicate a Song - Women's History Month",
    description: "A public digital pin board where people dedicate songs from the Women's History Month playlist to women who inspire them.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MusicPlayerProvider>
          {children}
        </MusicPlayerProvider>
      </body>
    </html>
  );
}

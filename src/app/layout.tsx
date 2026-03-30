import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../components/Providers";
import DomainSyncer from "../components/DomainSyncer";

export const metadata: Metadata = {
  title: "Designly",
  description: "Design your story. Showcase your work with designly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900;1,8..144,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <DomainSyncer />
          {children}
        </Providers>
      </body>
    </html>
  );
}

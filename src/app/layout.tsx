import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { ResourceProvider } from "@/providers/ResourceProvider";
import { ThemeProvider } from "next-themes";
import { SiteHeader } from "@/components/custom/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repo Base",
  description:
    "Turn your favorite repository into a knowledge base and get ai powered insights",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const resourceId = (await cookies()).get("resourceId")?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ResourceProvider resourceId={resourceId}>
            {children}
          </ResourceProvider>
          <SiteHeader />
        </ThemeProvider>
      </body>
    </html>
  );
}

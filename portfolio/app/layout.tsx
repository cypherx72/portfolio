import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tavonga Chitambira — Full-Stack Engineer",
  description: "Full-stack engineer building real-time distributed systems. Currently architecting SyncBoard, a horizontally-scaled multiplayer incident management platform.",
  keywords: ["full-stack engineer", "Next.js", "TypeScript", "distributed systems", "Socket.io"],
  openGraph: {
    title: "Tavonga Chitambira — Full-Stack Engineer",
    description: "Full-stack engineer building real-time distributed systems.",
    url: "https://tavongachitambira.vercel.app/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tavonga Chitambira — Full-Stack Engineer",
    description: "Full-stack engineer building real-time distributed systems.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="flex flex-col min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

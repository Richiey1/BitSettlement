import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { ThemeProvider } from "./components/providers/theme-provider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "StacksFund — Community Funding & Governance on Bitcoin L2",
    template: "%s | StacksFund",
  },
  description:
    "Fund projects, vote on proposals, and track milestones transparently on the Stacks L2 blockchain, secured by Bitcoin. Community-driven on-chain governance.",
  keywords: ["Stacks", "Bitcoin", "crowdfunding", "DAO", "governance", "voting", "milestones", "blockchain", "L2", "DeFi"],
  authors: [{ name: "StacksFund Protocol" }],
  creator: "StacksFund",
  openGraph: {
    title: "StacksFund — Community Funding & Governance",
    description: "Fund the future, govern together. On-chain crowdfunding and DAO governance on Bitcoin L2.",
    type: "website",
    siteName: "StacksFund",
    images: [{ url: "/logo.svg", width: 64, height: 64, alt: "StacksFund Growth Logo" }],
  },
  twitter: {
    card: "summary",
    title: "StacksFund — Fund & Govern on Bitcoin L2",
    description: "Community-powered crowdfunding, transparent voting, milestone-based fund release on Stacks.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
    shortcut: "/favicon.svg",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#052e16" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

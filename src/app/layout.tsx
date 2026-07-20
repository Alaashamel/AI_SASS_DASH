import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SkipToContent } from "@/components/skip-to-content";

export const metadata: Metadata = {
  title: "NeuralFlow AI - Intelligent Automation Platform",
  description:
    "Enterprise AI platform for intelligent document processing, analytics, and conversational AI. Automate workflows with cutting-edge AI models.",
  keywords: ["AI", "SaaS", "dashboard", "automation", "machine learning"],
  authors: [{ name: "NeuralFlow" }],
  openGraph: {
    title: "NeuralFlow AI - Intelligent Automation Platform",
    description: "Enterprise AI platform for intelligent automation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SkipToContent />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

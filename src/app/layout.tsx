import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://daydream.waddleph.com'),
  title: "Daydream by Waddle PH | Financial Goal & Affordability Tracker",
  description: "Calculate how long it takes to afford your dream items with Daydream. This simple personal finance and savings tracker was built and powered by Waddle PH IT Solutions.",
  keywords: [
    "Daydream",
    "Waddle PH",
    "affordability calculator",
    "financial goal tracker",
    "savings planner Philippines",
    "budget calculator",
  ],
  authors: [{ name: "Waddle PH IT Solutions", url: "https://waddleph.com" }],
  creator: "Waddle PH",
  publisher: "Waddle PH",
  openGraph: {
    title: "Daydream by Waddle PH | Can You Afford It?",
    description: "Input your income and expenses to see exactly when you can reach your next big goal. A product by Waddle PH.",
    url: "https://daydream.waddleph.com", // update with your actual domain when deployed
    siteName: "Daydream by Waddle PH",
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: "/waddle_banner.svg", // Path relative to public folder (or absolute URL)
        width: 1200,
        height: 630,
        alt: "Daydream by Waddle PH Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daydream by Waddle PH",
    description: "Track your monthly savings and calculate when you can afford your dream purchases.",
    images: ["/waddle_banner.svg"], // Image for Twitter card
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
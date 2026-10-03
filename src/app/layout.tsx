import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Sora } from "next/font/google";
import "./globals.css";
import { PortfolioCursor } from "@/components/portfolio-cursor";

const geistSans = localFont({
  src: "./fonts/geist-sans.woff2",
  variable: "--font-geist-sans",
  display: "swap",
  weight: "100 900",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#0a090b",
};

export const metadata: Metadata = {
  title: "Arhaan Shaikh | Cybersecurity Portfolio",
  description:
    "Arhaan Shaikh's cybersecurity portfolio — documenting hands-on learning, VAPT, web application security, and real-world experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${sora.variable}`}>
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `try {
              var saved = localStorage.getItem("portfolio-theme");
              if (saved === "iron-man" || saved === "spider-man" || saved === "thor" || saved === "doctor-doom") {
                document.documentElement.dataset.theme = saved;
              } else {
                document.documentElement.dataset.theme = "iron-man";
              }
            } catch (e) {
              document.documentElement.dataset.theme = "iron-man";
            }`,
          }}
        />
        {children}
        <PortfolioCursor />
      </body>
    </html>
  );
}

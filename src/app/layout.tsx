import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ErrorAlert from "@/app/components/erroralert/erroralert.tsx";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
    title: "DDW",
    description: "The best online betting game!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <div className='bg-gradient-to-t from-transparent to-black to-80% w-screen h-screen'>
          <ErrorAlert/>
        {children}
      </div>
      </body>
    </html>
  );
}

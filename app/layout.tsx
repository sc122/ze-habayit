import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "זה הבית — שאל את החבר שלך",
  description: "שאלון איסוף צרכים — שאל כאילו יש לך חבר שיודע הכל על סעד",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} dark h-full`}>
      <body className="min-h-full font-heebo antialiased">{children}</body>
    </html>
  );
}

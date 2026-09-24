import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Helena & Gabriel | Nosso casamento",
  description: "Você está convidado para celebrar o casamento de Helena e Gabriel.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}

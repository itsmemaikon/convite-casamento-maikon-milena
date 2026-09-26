import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Milena & Maikon | Nosso casamento",
  description: "Você está convidado para celebrar o casamento de Milena e Maikon.",
  icons: {
    icon: "./favicon.svg",
    shortcut: "./favicon.svg",
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

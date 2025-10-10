import "~/styles/globals.css";

import { type Metadata } from "next";
import { Fira_Code, Press_Start_2P } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Treasure Hunters",
  applicationName: "Treasure Hunters",
  description: "Acompanhe a pontuação dos jogadores em Treasure Hunters!",
  authors: [
    { name: "Thiago Ausechi", url: "https://github.com/thiagoausechi" },
    { name: "Lucas Facina", url: "https://github.com/lucasfacina" },
  ],
  keywords: ["Treasure Hunters", "Game", "Leaderboard"],
  appleWebApp: {
    title: "Treasure Hunters",
    statusBarStyle: "black-translucent",
  },
};

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

const pressStart2P = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start-2p",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${firaCode.variable} ${pressStart2P.variable}`}
    >
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}

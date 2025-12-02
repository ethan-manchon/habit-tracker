import "./globals.css";
import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Providers} from "./providers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Routines - Transforme tes habitudes",
  description: "Crée, suis et améliore tes routines quotidiennes",
};

export default function RootLayout(props: any) {
  const { children, modal } = props as { children: React.ReactNode; modal?: React.ReactNode };
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        {modal}
      </body>
    </html>
  );
}

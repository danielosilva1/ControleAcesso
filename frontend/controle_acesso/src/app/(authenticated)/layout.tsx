import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/page";

const inter  = Inter({ subsets: ["latin"] });

export const matadata: Metadata = {
    title: "Controle de Acesso",
    description: "Página inicial do site de controle de acesso"
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br">
            <body className={inter.className}>
                <Header></Header>
                { children }
            </body>
        </html>
    )
}
import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Home() {
    return (
        <>
            <Head>
                <title>trailRunners</title>
                <meta
                    name="Fully fledged trail analysis program"
                    content="Created by the RuntimeTerror team."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <main>
                    <div>Hello</div>
                </main>
                <footer>
                    <p>Made with ❤️by RuntimeTerror</p>
                </footer>
            </div>
        </>
    );
}

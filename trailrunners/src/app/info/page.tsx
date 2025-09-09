import Image from "next/image";
import Link from "next/link";


export default function Info() {
  return (
        <div className="flex flex-col justify-between h-screen">
            <header className="header flex flex-row justify-between items-center px-10 py-4">
                <Image
                        src="/logo.svg"
                        width={290}
                        height={70}
                        alt="Trail Runners"
                    />

                <div className="nav_links flex flex-row gap-10 text-lg font-medium uppercase">
                    <Link href="/" className="headerLink">Trail Summary</Link>
                    <Link href="/info" className="headerLink activeLink">Info</Link>

                </div>
            </header>

            <main className="flex flex-col px-10 py-5 h-full">
                
                
                
                <footer className="p-2 py-3 flex flex-wrap items-center justify-center">
                    <p>Made with ❤️ by Runtime Terrors</p>
                </footer>
            </main>
        </div>
    );
}
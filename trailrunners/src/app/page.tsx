import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col justify-between h-screen">
            <main className="flex flex-col p-5 h-full">
                <div className="w-full">
                    <nav className="flex mb-5 justify-between items-center">
                        <Image
                            src="/logo.svg"
                            width={303}
                            height={83}
                            alt="TrailRunners"
                        />
                        <div className="border border-secondary px-6 py-2 rounded-xl bg-primary">
                            Select trail
                        </div>
                    </nav>
                </div>
                <div className="gap-5 flex flex-grow justify-between">
                    <div className="nested_components">
                        <div className="sections">
                            <p>Trail Elevation Visualiser</p>
                            <div className="container">
                                <p>This is where the chart goes</p>
                            </div>
                        </div>
                        <div className="sections">
                            <p>Trail Analysis</p>
                            <div className="container">
                                <p>This is where the analysis goes</p>
                            </div>
                        </div>
                    </div>
                    <div className="sections">
                        <p>Trail Overview</p>
                        <div className="container">
                            <p>This is where the map goes</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="p-2 flex flex-wrap items-center justify-center">
                <p>Made with ❤️ by Runtime Terrors</p>
            </footer>
        </div>
    );
}

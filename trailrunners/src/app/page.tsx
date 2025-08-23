import Image from "next/image";
import FileSelector from "@/components/fileSelector";

export default function Home() {
    return (
        <div className="flex flex-col justify-between h-screen">
            <main className="flex flex-col p-10 h-full">
                <div className="w-full">
                    <nav className="flex mb-5 justify-between items-center">
                        <Image
                            src="/logo.svg"
                            width={303}
                            height={83}
                            alt="Trail Runners"
                        />
                        <FileSelector />
                    </nav>
                </div>
                <div className="components">
                    <div className="nested_components">
                        <div className="sections">
                            <h1>Trail Elevation Visualiser</h1>
                            <div className="container">
                                <p>This is where the chart goes</p>
                            </div>
                        </div>
                        <div className="sections">
                            <h1>Trail Analysis</h1>
                            <div className="analysis_container">
                                <p>This is where the analysis goes</p>
                            </div>
                        </div>
                    </div>
                    <div className="sections">
                        <h1>Trail Overview</h1>
                        <div className="container">
                            <p>This is where the map goes</p>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="p-2 py-3 flex flex-wrap items-center justify-center">
                <p>Made with ❤️ by Runtime Terrors</p>
            </footer>
        </div>
    );
}

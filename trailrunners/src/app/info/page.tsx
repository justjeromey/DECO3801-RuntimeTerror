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
                {/* About Section */}
                <div className="max-w-4xl mx-auto w-full">
                    <h2 className="text-3xl font-bold mb-8">About Rolling Hills</h2>
                    
                    <div className="space-y-8">
                        <section className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">What is Rolling Hills?</h3>
                            <p className="text-gray-700">
                                Rolling Hills is an interactive trail visualisation tool designed to help 
                                runners and hikers better understand their routes. By uploading GPS data, 
                                users can analyse elevation profiles and plan their trails more effectively.
                            </p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Interactive elevation profile visualisation</li>
                                    <li>Real-time distance tracking</li>
                                    <li>Dynamic map integration</li>
                                    <li>Elevation gain/loss analysis</li>
                                </ul>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h3 className="text-xl font-semibold mb-4">How to Use</h3>
                                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                                    <li>Upload your GPS track file</li>
                                    <li>View your trail on the interactive map</li>
                                    <li>Explore the elevation profile</li>
                                    <li>Click points to see detailed information</li>
                                </ol>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-semibold mb-4">Tips for Best Results</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                                <div>
                                    <h4 className="font-medium mb-2">📁 File Format</h4>
                                    <p>Upload GPX files for best compatibility</p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">🎯 Accuracy</h4>
                                    <p>Ensure your GPS data is clean and continuous</p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">📱 Device</h4>
                                    <p>Works best on desktop for detailed analysis</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <footer className="p-2 py-3 flex flex-wrap items-center justify-center">
                    <p>Made with ❤️ by Runtime Terrors</p>
                </footer>
            </main>
        </div>
    );
}
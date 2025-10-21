"use client";

import Link from "next/link";
import { ChevronRightIcon, ChevronLeftIcon} from "@heroicons/react/24/outline";
import { useEffect, useState, useCallback } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";

export default function Info() {
    const features = [
        { id: 1, title: 'Interactive Elevation Profile', icon: '⛰️', text: 'Visualize your trail’s elevation changes in a detailed, interactive graph.' },
        { id: 2, title: 'Real-time Distance Tracking', icon: '⏱️', text: 'Monitor your progress and remaining distance as you move along the route.' },
        { id: 3, title: 'Dynamic Map Integration', icon: '🗺️', text: 'View your route on an integrated map that highlights key points and terrain.' },
        { id: 4, title: 'Elevation Gain/Loss Analysis', icon: '📈', text: 'Get detailed data on your total elevation gain and loss for better training.' },
    ];

     const [currentFeature, setCurrentFeature] = useState(0);

    const nextFeature = useCallback(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
    }, [features.length]);

    const prevFeature = () => {
        setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextFeature();
        }, 7500); 

        return () => clearInterval(interval);
    }, [nextFeature]);
    
    
  return (
        <div className="flex flex-col justify-between">
            <Header activePath="/about" />

            <main className="flex flex-col px-0 h-full flex-1">

                {/* About TrailRunners */}
                <section className="w-full bg-colour-primary py-55">
                    <div className="max-w-4xl mx-auto px-6 text-center text-white">
                        <h2 className="text-4xl font-bold mb-6">
                            What is <span className="italic text-green-400">TrailRunners</span>?
                        </h2>
                        <p className="text-lg text-gray-300 ">
                            TrailRunners is an interactive trail visualisation tool designed to help runners and hikers better understand their routes. 
                            By uploading GPS data, users can analyse elevation profiles and plan their trails more effectively.
                        </p>
                    </div>
                </section>
  
                <section className="flex flex-wrap justify-center items-stretch">

                    {/* Key Features of TrailRunners */}
                    <div className="flex-1 min-w-[320px] md:max-w-[40%] bg-green-400 text-black py-15 px-10 flex flex-col gap-5 justify-center items-center">
                        <h3 className="text-2xl font-bold mb-4 text-center">Key Features</h3>

                        <div className="flex gap-5 items-center justify-center w-full">
                        <button onClick={prevFeature} className="p-2 mr-4 rounded-full bg-black/10 hover:bg-black/20 transition-colors">
                            <ChevronLeftIcon className="w-6 h-6 text-black" />
                        </button>

                        <div className="text-center">
                            <div className="text-5xl mb-4">{features[currentFeature].icon}</div>
                            <h4 className="font-semibold text-l mb-2">{features[currentFeature].title}</h4>
                            <p className="px-4">{features[currentFeature].text}</p>
                        </div>

                        <button onClick={nextFeature} className="p-2 ml-4 rounded-full bg-black/10 hover:bg-black/20 transition-colors">
                            <ChevronRightIcon className="w-6 h-6 text-black" />
                        </button>
                        </div>

                        <div className="flex mt-4 space-x-2">
                        {features.map((_, index) => (
                            <div
                            key={index}
                            className={`h-2 w-2 rounded-full ${index === currentFeature ? 'bg-black' : 'bg-black/30'}`}
                            ></div>
                        ))}
                        </div>
                    </div>

                    {/* Tips for TrailRunners */}
                    <div className="flex-1 min-w-[320px] md:max-w-[60%] bg-white p-15 text-black flex flex-col">
                        <h3 className="text-2xl font-bold mb-4 text-black text-center">
                        Tips for Best Results
                        </h3>

                        <div className="flex flex-col md:flex-row gap-6 flex-1">
                        <div className="flex-1 rounded-lg shadow-md p-6 bg-gray-100 text-center flex flex-col justify-center">
                            <h4 className="font-bold mb-2">📁 File Format</h4>
                            <p>Upload GPX files for best compatibility</p>
                        </div>

                        <div className="flex-1 rounded-lg shadow-md p-6 bg-gray-100 text-center flex flex-col justify-center">
                            <h4 className="font-bold mb-2">🎯 Accuracy</h4>
                            <p>Ensure your GPS data is clean and continuous</p>
                        </div>

                        <div className="flex-1 rounded-lg shadow-md p-6 bg-gray-100 text-center flex flex-col justify-center">
                            <h4 className="font-bold mb-2">📱 Device</h4>
                            <p>Works best on desktop for detailed analysis</p>
                        </div>
                        </div>
                    </div>
                </section>

                {/* How to Use TrailRunners */}
                <section className="w-full bg-colour-primary py-20">
                    <div className="p-6 text-center text-white">
                        <h2 className="text-4xl font-bold mb-6">
                            How to Use <span className="italic text-green-400">TrailRunners</span>
                        </h2>
                        
                        <div className="p-6 text-center text-white w-full text-center justify-center w-full">

                            <div className="space-y-8 gap-20 flex flex-col">
                                {/* Step 1 */}
                                <div className="flex flex-col gap-6"> 
                                    <div className="flex items-center gap-6 justify-center flex-col">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-400 text-black font-bold text-xl shrink-0">
                                        1
                                        </div>
                                        <h3 className="text-xl uppercase font-bold">Prepare your .GPX File</h3>
                                    </div>

                                    <div className="px-18">
                                        <p>
                                            Find or record a GPX file of an existing trail, using your preferred GPS device or app. 
                                            Ensure the file is clean and contains accurate elevation data for the best results.
                                        </p>

                                        <br />

                                        <p>
                                            TrailRunners has recommended apps for recording GPX files, for more information and 
                                            tips please visit the link below:
                                        </p>
    
                                        <br />
                                        
                                        <Link 
                                            href="/gpx_generate" 
                                            className="bg-green-400 text-black font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-green-500"
                                        >
                                            GPX Generation
                                        </Link>                                        
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex flex-col gap-6"> 
                                    <div className="flex items-center gap-6 justify-center flex-col">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-400 text-black font-bold text-xl shrink-0">
                                        2
                                        </div>
                                        <h3 className="text-xl uppercase font-bold">Upload your .GPX File for Analysis</h3>
                                    </div>

                                    <div className="px-18">
                                        <p>
                                            Access the Trail Summary page and use the upload feature to select your GPX file. 
                                            Once uploaded, the tool will process the data and generate an interactive elevation 
                                            profile along with a map of your trail.
                                        </p>

                                        <br />

                                        <p>
                                            You can access the summary page by clicking the link below:
                                        </p>
    
                                        <br />
                                        
                                        <Link 
                                            href="/" 
                                            className="bg-green-400 text-black font-semibold py-2 px-6 rounded-lg transition-colors hover:bg-green-500"
                                        >
                                            Trail Summary
                                        </Link>                                        
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex flex-col gap-6"> 
                                    <div className="flex items-center gap-6 justify-center flex-col">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-400 text-black font-bold text-xl shrink-0">
                                        3
                                        </div>
                                        <h3 className="text-xl uppercase font-bold">Upload your .LAZ File for Refinement</h3>
                                    </div>

                                    <div className="px-18">
                                        <p>
                                            If you have a .LAZ file containing LiDAR data for your trail area, you can upload it to enhance
                                            the elevation profile accuracy. The tool will integrate the LiDAR data with your GPX file to 
                                            provide a more detailed analysis of elevation changes along your route.
                                        </p>

                                        <br />

                                        <p>
                                            This data can be found through online data LiDAR repositories like QSpatial. Be sure you select
                                            a LiDAR file which is contains the area in which your GPX was recorded.
                                        </p>                                 
                                    </div>
                                </div>
                               
                                {/* Step 4 */}
                                <div className="flex flex-col gap-6"> 
                                    <div className="flex items-center gap-6 justify-center flex-col">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-400 text-black font-bold text-xl shrink-0">
                                        4
                                        </div>
                                        <h3 className="text-xl uppercase font-bold">Explore the Elevation Profile</h3>
                                    </div>

                                    <div className="px-18">
                                        <p>
                                            Interact with the elevation profile to see detailed information about different segments of your trail. 
                                            Click on points along the profile to view elevation, distance, and other relevant data.
                                        </p>

                                        <br />          

                                        <p>
                                            And done! You can now use TrailRunners to analyze and visualize your trails effectively.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
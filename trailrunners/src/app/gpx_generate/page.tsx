"use client";
import Image from "next/image";
import Header from "../../components/header";
import GNSSButton from "../../components/gnssButton";
import Footer from "../../components/footer";

export default function Generate() {
  return (
        <div className="flex flex-col justify-between">
            <Header activePath="/gpx_generate" />

            <main className="flex flex-col px-0 h-full flex-1">

                <section className="w-full bg-colour-primary py-20">
                    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 text-center text-white gap-12">
                        <h2 className="text-4xl font-bold mb-6 text-green-400">
                        How to Generate GPX Files
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
                            {/* Strava */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-400 text-black font-bold text-xl">
                                <Image
                                    src="/strava_svg.svg"
                                    alt="Strava"
                                    width={60}
                                    height={60}
                                    priority
                                />
                                </div>
                                <h3 className="text-xl uppercase font-bold text-center">
                                Strava (Desktop)
                                </h3>
                            </div>

                            {/* GNSS */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-400 text-black font-bold text-xl">
                                <Image
                                    src="/gnss_svg.svg"
                                    alt="GNSS Logger"
                                    width={60}
                                    height={60}
                                />
                                </div>
                                <h3 className="text-xl uppercase font-bold text-center">
                                GNSS Logger (Android)
                                </h3>
                            </div>

                            {/* Open GPX */}
                            <div className="flex flex-col items-center gap-6">
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-400 text-black font-bold text-xl">
                                <Image
                                    src="/open_gpx_svg.svg"
                                    alt="Open GPX Tracker"
                                    width={60}
                                    height={60}
                                />
                                </div>
                                <h3 className="text-xl uppercase font-bold text-center">
                                Open GPX Tracker (Apple)
                                </h3>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Strava (Desktop) */}
                <section className="w-full py-20 bg-white">

                    <div className="w-full px-20 text-gray-800 flex flex-col gap-6 align-center justify-center text-center">
                        <div className="flex flex-row items-center gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                className="h-16 w-16 text-green-600 fill-current"
                            >
                                <path d="M6.731 0 2 9.125h2.788L6.73 5.497l1.93 3.628h2.766zm4.694 9.125 -1.372 2.756L8.66 9.125H6.547L10.053 16l3.484 -6.875z"></path>

                            </svg>
                            <h3 className="text-3xl font-bold text-green-600">Strava (Desktop)</h3>
                        </div>

                        <ol className="list-decimal list-inside space-y-3 text-lg mt-6">
                            <li>Log into Strava</li>
                            <li>Select an activity</li>
                            <li>Open the activity&apos;s overview</li>
                            <li>
                                Scroll down to the map area and click the{" "}
                                <span className="font-semibold text-green-600">&quot;GPX&quot;</span> button
                            </li>

                            <Image
                                src="/Strava-Gif.gif"
                                width={1000}
                                height={500}
                                alt="Strava Download GPX"
                                className="gifStyle max-w-full h-auto"
                                unoptimized
                            />

                            <li>Your GPX file will be downloaded automatically and will be ready for use</li>
                        </ol>
                    </div>
                </section>

                {/* GNSS Logger (Android) */}
                <section className="w-full py-20 bg-colour-primary">
                    <div className="w-full px-20 text-white">
                        <div className="flex flex-row items-center gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                                className="h-16 w-16 text-green-400 fill-current"
                            >
                                <path d="M0 0 C12.54 0 25.08 0 38 0 C38 14.85 38 29.7 38 45 C40.97 45.33 43.94 45.66 47 46 C75.92397063 51.13494764 102.35489728 65.37810421 124 85 C124.54301758 85.49097168 125.08603516 85.98194336 125.64550781 86.48779297 C149.11828065 108.02890862 165.95048346 139.51085524 171 171 C171 173.31 171 175.62 171 178 C185.85 178 200.7 178 216 178 C216 190.54 216 203.08 216 216 C201.15 216 186.3 216 171 216 C171 218.64 171 221.28 171 224 C170.65209961 226.36669922 170.65209961 226.36669922 170.15234375 228.3046875 C169.96317383 229.04348145 169.77400391 229.78227539 169.57910156 230.54345703 C169.36737305 231.31286621 169.15564453 232.08227539 168.9375 232.875 C168.60250488 234.10839111 168.60250488 234.10839111 168.26074219 235.36669922 C156.78493376 276.21901589 131.30966957 310.3493587 94.21533203 331.19018555 C84.9935841 336.25288201 75.6788039 340.2641791 65.75 343.6875 C64.94167725 343.97310791 64.13335449 344.25871582 63.30053711 344.55297852 C54.84645143 347.36825912 47.06679756 348.3999769 38 350 C37.67 364.19 37.34 378.38 37 393 C25.12 393 13.24 393 1 393 C0.67 378.81 0.34 364.62 0 350 C-6.6 348.68 -13.2 347.36 -20 346 C-42.74092798 339.70251225 -63.15148742 329.6068075 -81 314 C-81.5048291 313.56075195 -82.0096582 313.12150391 -82.52978516 312.66894531 C-90.12793174 306.01070592 -96.91282735 299.10422395 -103 291 C-103.60199219 290.20207031 -104.20398438 289.40414063 -104.82421875 288.58203125 C-119.51048305 268.35128964 -133 241.42645282 -133 216 C-147.85 216 -162.7 216 -178 216 C-178 203.46 -178 190.92 -178 178 C-163.15 178 -148.3 178 -133 178 C-133 175.69 -133 173.38 -133 171 C-132.55620906 168.36481904 -132.06356398 165.83908343 -131.4375 163.25 C-131.26114014 162.51974609 -131.08478027 161.78949219 -130.90307617 161.03710938 C-124.06259817 134.00762111 -110.46224634 109.89927283 -91 90 C-90.26265625 89.21238281 -89.5253125 88.42476563 -88.765625 87.61328125 C-67.27721262 65.14455809 -35.64300448 49.54171392 -5 45 C-3.35 45 -1.7 45 0 45 C0 30.15 0 15.3 0 0 Z M-74.68359375 114.8671875 C-95.064098 138.33179301 -105.22337739 166.03060291 -105.125 196.9375 C-105.12886719 198.14857422 -105.13273437 199.35964844 -105.13671875 200.60742188 C-105.10784017 227.27679484 -96.38860924 253.47097304 -79 274 C-78.13559123 275.08400453 -77.27371095 276.17002903 -76.4140625 277.2578125 C-58.34780639 299.7899582 -29.75860459 316.80762488 -0.87890625 320.6171875 C5.54309255 321.24500564 11.99166431 321.14474222 18.4375 321.125 C19.69626953 321.12886719 20.95503906 321.13273438 22.25195312 321.13671875 C32.75070059 321.12576544 42.3705452 320.57581586 52.4375 317.5 C53.292229 317.23936768 54.14695801 316.97873535 55.02758789 316.71020508 C86.72189872 306.61864342 113.40578598 285.37949491 129.10302734 255.93066406 C133.73094203 246.8892236 137.33729441 237.8196074 140 228 C140.391875 226.783125 140.78375 225.56625 141.1875 224.3125 C143.36701152 215.42679921 143.18260419 206.22142311 143.1875 197.125 C143.19974609 195.93519531 143.21199219 194.74539062 143.22460938 193.51953125 C143.27889882 160.40296896 128.81906181 131.5947975 106.25 107.9375 C82.16796727 84.70876764 49.65434656 72.55936994 16.33569336 72.69750977 C-19.18163501 73.46366062 -50.63769302 89.17622514 -74.68359375 114.8671875 Z " transform="translate(237,59)"/>
                                <path d="M0 0 C17.12814984 14.59064616 26.88808197 33.0310008 28.94287109 55.53369141 C30.32176852 75.38198471 23.74815192 94.93314 10.75390625 110.10546875 C10.09003906 110.84152344 9.42617188 111.57757813 8.7421875 112.3359375 C8.15050781 113.02042969 7.55882812 113.70492187 6.94921875 114.41015625 C-6.21281452 128.694751 -25.44891214 136.30328961 -44.546875 137.55078125 C-66.56521924 138.17206636 -85.89744748 130.67024923 -101.98046875 115.578125 C-112.60366305 105.11892513 -118.84406459 93.577171 -123.2578125 79.3359375 C-123.5053125 78.58054687 -123.7528125 77.82515625 -124.0078125 77.046875 C-128.92225523 59.36853242 -124.3236078 38.14269149 -115.6953125 22.50390625 C-111.61776601 15.75518925 -106.77657508 9.95118194 -101.2578125 4.3359375 C-100.64421875 3.70945313 -100.030625 3.08296875 -99.3984375 2.4375 C-72.32405036 -23.13275452 -28.46841238 -22.72942209 0 0 Z " transform="translate(304.2578125,195.6640625)"/>
                                <path d="M0 0 C6.27 0 12.54 0 19 0 C19 24.09 19 48.18 19 73 C7.12 74.485 7.12 74.485 -5 76 C-38.15398999 83.05859142 -66.10425258 101.22485215 -84.82666016 129.65673828 C-98.19295449 150.56325131 -104.20367445 172.22060946 -104.125 196.9375 C-104.12886719 198.14857422 -104.13273437 199.35964844 -104.13671875 200.60742188 C-104.10782114 227.29436743 -95.37564412 253.44659546 -78 274 C-77.15845768 275.07186966 -76.32003092 276.14619109 -75.484375 277.22265625 C-68.94287707 285.49490785 -61.57705446 291.90098906 -53 298 C-51.67935547 298.95132813 -51.67935547 298.95132813 -50.33203125 299.921875 C-28.63331071 314.58953725 -7.26074181 318.81160485 19 321 C19 344.76 19 368.52 19 393 C13.06 393 7.12 393 1 393 C0.67 378.81 0.34 364.62 0 350 C-6.6 348.68 -13.2 347.36 -20 346 C-42.74092798 339.70251225 -63.15148742 329.6068075 -81 314 C-81.5048291 313.56075195 -82.0096582 313.12150391 -82.52978516 312.66894531 C-90.12793174 306.01070592 -96.91282735 299.10422395 -103 291 C-103.60199219 290.20207031 -104.20398438 289.40414063 -104.82421875 288.58203125 C-119.51048305 268.35128964 -133 241.42645282 -133 216 C-147.85 216 -162.7 216 -178 216 C-178 203.46 -178 190.92 -178 178 C-163.15 178 -148.3 178 -133 178 C-133 175.69 -133 173.38 -133 171 C-132.55620906 168.36481904 -132.06356398 165.83908343 -131.4375 163.25 C-131.26114014 162.51974609 -131.08478027 161.78949219 -130.90307617 161.03710938 C-124.06259817 134.00762111 -110.46224634 109.89927283 -91 90 C-90.26265625 89.21238281 -89.5253125 88.42476563 -88.765625 87.61328125 C-67.27721262 65.14455809 -35.64300448 49.54171392 -5 45 C-3.35 45 -1.7 45 0 45 C0 30.15 0 15.3 0 0 Z " transform="translate(237,59)"/>
                                <path d="M0 0 C21.68238632 0 39.87084035 8.46541887 55.6875 23.1875 C70.83465025 38.96692694 77.58730207 59.6021704 77.48974609 81.20849609 C76.87295755 98.81534936 68.65645943 116.07604207 57 129 C56.40832031 129.68449219 55.81664062 130.36898437 55.20703125 131.07421875 C43.05745753 144.26000345 24.78351184 152.53279703 7 154 C4.69 154 2.38 154 0 154 C0 103.18 0 52.36 0 0 Z " transform="translate(256,179)"/>

                            </svg>
                            <h3 className="text-3xl font-bold text-green-400">GNSS Logger (Android)</h3>
                        </div>

                        <ol className="list-decimal text-lg text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
                            <li>
                                Download and open Open GNSS Logger.
                                <br />
                                Ensure{" "}
                                <span className="italic">
                                Location, GNSS Location, Measurements, Fused Location, NetworkLocation
                                </span>{" "}
                                settings are active.

                                <Image
                                src="/GNSSTurnOn.gif"
                                width={250}
                                height={250}
                                alt="GNSS Turn On Action"
                                className="gifStyle max-w-full h-auto"
                            />
                            </li>

                            <li>Open the &quot;Log&quot; Section and click &quot;Start Log&quot;

                                <br />
                                <br />  
                                <br />
                                
                                <Image
                                src="/GNSSStartLog.gif"
                                width={250}
                                height={250}
                                alt="GNSS Start Log Action"
                                className="gifStyle max-w-full h-auto"
                                unoptimized
                                />
                            </li>
                            
                            <li>
                                Run your trail and when complete, click &quot;Stop &amp; Send&quot;. 
                                And choose a mode to download your GPX data - it should be a .txt file inside of a .zip folder.
                                
                                <Image
                                    src="/GNSSStop.gif"
                                    width={250}
                                    height={250}
                                    alt="GNSS Stop Log Action"
                                    className="gifStyle max-w-full h-auto"
                                    unoptimized
                                />
                            </li>

                            <div className="flex gap-20 flex-col">
                                <li>
                                    Extract the .zip file and click the button below to upload your .txt file to be turned into a .gpx file.
                                    into a .gpx file. Your .gpx file will automatically be downloaded to your device after
                                    processing.
                                </li>

                                <GNSSButton />
                            </div>
                            
                        </ol>
                    </div>
                </section>

                {/* GPX Tracker (Apple) */}
                
            
                <section className="w-full bg-green-600 py-20 text-white">
                    <div className="w-full px-20">
                        
                        <div className="flex flex-row items-center gap-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 450 450"
                                className="h-16 w-16 text-white fill-current"
                            >
                                <g transform="translate(0,450) scale(0.1,-0.1)"> 
                                    <path d="M3525 3643 c-264 -59 -938 -334 -1756 -719 -727 -341 -1247 -621
                                    -1378 -741 -39 -35 -44 -44 -35 -60 31 -51 229 -111 624 -188 567 -111 741
                                    -155 785 -199 44 -44 91 -213 190 -686 104 -500 177 -710 246 -710 48 0 138
                                    142 313 490 162 321 371 780 511 1120 13 30 46 111 75 180 227 545 430 1094
                                    489 1327 22 85 29 162 17 181 -7 12 -42 14 -81 5z"/>
                                </g>
                            </svg>

                            <h3 className="text-3xl font-bold text-white">Open GPX Tracker (Apple)</h3>
                        </div>

                        <ol className="list-decimal text-lg text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
                            <li>
                                Open the app, click &quot;Start Tracking&quot; and run your trail.             

                                <Image
                                src="/OGPX1.gif"
                                width={250}
                                height={250}
                                alt="Open GPX Open"
                                className="gifStyle max-w-full h-auto"
                                />
                            </li>

                            <li>
                                When complete, click &quot;Save&quot; and give your .GPX file a name.

                                <Image
                                src="/OGPX2.gif"
                                width={250}
                                height={250}
                                alt="Open GPX Start"
                                className="gifStyle max-w-full h-auto"
                                />
                            </li>

                            <li>
                                Open your GPX files in the top left and select a file and click &quot;Share&quot;.

                                <Image
                                src="/OGPX3.gif"
                                width={250}
                                height={250}
                                alt="Open GPX Open Files"
                                className="gifStyle max-w-full h-auto"
                                />
                            </li>

                            <li>
                                Choose a mode to download your GPX file.

                                <Image
                                src="/OGPX4.gif"
                                width={250}
                                height={250}
                                alt="Open GPX Download and Share File"
                                className="gifStyle max-w-full h-auto"
                                />
                            </li>
                        </ol>
                    </div>
                </section>

                <section className="w-full bg-colour-primary py-20">
                    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 text-center text-white">
                        <h2 className="text-4xl font-bold mb-6 text-green-400">
                            Advanced Collection Methods
                        </h2>

                        <div>
                            For more advanced GPX data collection, use dedicated GPS devices like the Garmin GPSMAP 67i. 
                            
                            <br/> <br/>

                            These devices offer higher precision data and more consistent data for trail running. 
                            After running a trail, these devices allow for the easy exportation of GPX files which can be directly uploaded to TrailRunners.

                            <br/> <br/>

                            In addition, LiDAR datasets from organisations like QSpatial, allow for more refined analysis of trails. You can use these LiDAR datasets
                            in conjunction with your GPX files on TrailRunners, by finding LiDAR datasets that contain the location where your GPX data was collected
                            from.
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
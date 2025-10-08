"use client";

import { useEffect, useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Upload } from "lucide-react"; 

interface FileSelectorProps {
    setTrailData: (data: unknown) => void;
    selected: string;
    setSelected: (name: string) => void;
    firstUse: boolean;
}

export default function FileSelector({ setTrailData, selected, setSelected, firstUse }: FileSelectorProps) {
    const acceptedFileTypes = ".gpx";
    const [trails, setTrails] = useState<Array<string>>([]);
    const [toggled, setToggle] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const dropdown = useRef<HTMLDivElement>(null);

    // Fetch default trails on component load
    useEffect(() => {
        // Grab default trails on load
        async function fetchTrails() {
            try {
                // Attempt to fetch default trails
                const promise = fetch("/api/fileReader").then(async res => {
                    if (!res.ok) {
                        throw new Error("Fetch failed");
                    }
                    return res.json();
                });

                const files = await toast.promise(promise, {
                    pending: "Fetching trails...",
                    success: "Trails successfully fetched",
                    error: "Failed to retrieve default trails",
                });

                if (files) {
                    setTrails(files);
                }
            
            } catch (error) {
                console.error(error);
                return;
            }
        }

        fetchTrails();
    }, []);

    // Toggles the dropdown menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
                setToggle(false);
            }
        }

        if (toggled) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggled]);

    // Loads the selected file and sends file to parser
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setSelected(file.name);
        setToggle(false); 

        // Send request to parser
        try {
            if (pending) {
                return;
            }

            setPending(true);
            
            const promise = fetch("/api/parser", { method: "POST", body: formData }).then(async res => {
                if (!res.ok) { 
                    throw new Error("Upload failed");
                }
                return res.json();
            });
            
            const result = await toast.promise(promise, {
                pending: "Uploading file...",
                success: "File uploaded.",
                error: "Failed to upload selected file",
            });

            if (result) {
                setTrailData(result);
            }

        } catch (error) {
            console.error(`File upload failed ${error}`);
        } finally {
            setPending(false);
        }
    };

    // Handles trail selection, sends request to parser
    const handleSelection = async (trail: string) => {
        setSelected(trail);
        setToggle(false);

        // Send request to parser
        try {
            if (pending) {
                return;
            }

            setPending(true);
            
            // Fetch selected trail
            const promise = fetch("/api/parser", {
                method: "POST",
                body: (() => { const f = new FormData(); f.append("fileName", trail); return f; })(),
            }).then(async res => {
                if (!res.ok) throw new Error("Parsing failed");
                return res.json();
            });
            
            // Toast promise for user feedback
            const result = await toast.promise(promise, {
                pending: "Parsing selected trail...",
                success: "Trail parsed.",
                error: "Failed to parse selected trail",
            });

            if (result) {
                setTrailData(result);
            }
        } catch (error) {
            console.error(`Selected file parsing failed ${error}`);
        } finally {
            setPending(false);
        }
    };

    return (
        <div ref={dropdown} className={`relative z-10 ${firstUse ? "mt-4" : ""}`}>
            {/* Toggle button */}
            <button
                type="button"
                className={`${firstUse ? "flex items-center justify-center bg-green-400 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg gap-2 text-lg cursor-pointer" : `fileSelector ${toggled ? "rounded-t-lg" : "rounded-lg"} hover:brightness-125`}`}
                onClick={() => setToggle(!toggled)}
            >
                {firstUse && <Upload className="w-6 h-6" />}
                {selected || (firstUse ? "Upload Trail" : "Select Trail")}
            </button>

            <div
                className={`absolute top-full left-0 border w-full max-h-64 p-2 gap-2 flex flex-col bg-accent-2 border-secondary 
                    rounded-b-lg overflow-y-auto shadow-lg z-20 ${toggled ? "block" : "hidden"}`}
            >
                {/* Upload option */}
                <input
                    type="file"
                    id="file-upload-label"
                    accept={acceptedFileTypes}
                    className="hidden"
                    onChange={handleUpload}
                />
                <label
                    className="file_select_button cursor-pointer italic text-center"
                    htmlFor="file-upload-label"
                >
                    Upload .gpx file
                </label>

                {/* Existing trails */}
                {trails.map((trail, idx) => (
                    <button key={idx} type="button" className="file_select_button" onClick={() => handleSelection(trail)}>
                        {trail}
                    </button>
                ))}
            </div>

            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="dark"
                transition={Bounce}
                toastClassName="burnt_toast"
                style= {{ 
                    position: "fixed",
                    top: "15vh",
                    left: "50%",
                    transform: "translateX(-50%)",
                    minWidth: "250px",
                }}
            />
        </div>
    );
}

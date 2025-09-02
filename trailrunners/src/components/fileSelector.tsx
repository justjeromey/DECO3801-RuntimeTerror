"use client";

import { useEffect, useRef, useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function FileSelector({ setTrailData }) {
    const acceptedFileTypes = ".gpx";
    const [trails, setTrails] = useState<Array<string>>([]);
    const [toggled, setToggle] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>("");
    const [uploadedFile, setUploadedFile] = useState<string>("");

    useEffect(() => {
        // Grab default trails on load
        async function fetchTrails() {
            try {
                const res = await toast.promise(fetch("/api/fileReader"), {
                    pending: "Fetching trails",
                    success: "Trails successfully fetched",
                    error: "Failed to retrieve default trails",
                });
                const files = await res.json();
                if (files) {
                    setTrails(files);
                }
            } catch (error) {
                return;
            }
        }

        fetchTrails();
    }, []);

    // Toggles the dropdown menu
    function handleDropdown() {
        setToggle(!toggled);
    }

    // Loads the selected file and sends file to parser
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];
        const formData = new FormData();
        if (!file) return;
        formData.append("file", file);

        setSelected(file.name);
        setToggle(!toggled);
        // Send request to parser
        try {
            const res = await toast.promise(
                fetch("/api/parser", {
                    method: "POST",
                    body: formData,
                }),
                {
                    pending: "Uploading file...",
                    success: "File uploaded.",
                    error: "Failed to upload selected file",
                },
            );
            // Get json data and pass to parent
            const result = await res.json();
            setTrailData(result);
        } catch (error) {
            console.error(`File upload failed ${error}`);
        }
    };

    // Handles trail selection, sends request to parser
    const handleSelection = async (trail: string) => {
        const formData = new FormData();
        formData.append("fileName", trail);
        setSelected(trail);
        setToggle(!toggled);
        // Send request to parser
        try {
            const res = await toast.promise(
                fetch("/api/parser", {
                    method: "POST",
                    body: formData,
                }),
                {
                    pending: "Parsing selected trail...",
                    success: "Trail parsed.",
                    error: "Failed to parse selected trail",
                },
            );
            // Get json data and pass to parent
            const result = await res.json();
            setTrailData(result);
        } catch (error) {
            console.error(`Selected file parsing failed ${error}`);
        }
    };

    return (
        <div className="min-w-50 relative z-1000">
            <button
                type="button"
                className={`fileSelector ${toggled ? `rounded-t-lg` : `rounded-lg`} hover:brightness-125`}
                onClick={handleDropdown}
            >
                {selected === "" ? "Select a trail" : selected}
            </button>
            <div
                className={`border w-full max-h-[50vh] p-1 gap-2 flex flex-col bg-accent-2 border-secondary rounded-b-lg overflow-scroll ${toggled ? `absolute` : `hidden`}`}
            >
                <input
                    type="file"
                    id="file-upload-label"
                    accept={acceptedFileTypes}
                    className="hidden"
                    onChange={handleUpload}
                />
                <label
                    className="text-center italic file_select_button"
                    htmlFor="file-upload-label"
                >
                    Upload .gpx file
                </label>
                {trails.map((trail: string, key: number) => (
                    <button
                        key={key}
                        type="button"
                        className="file_select_button"
                        onClick={() => handleSelection(trail)}
                    >
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
            />
        </div>
    );
}

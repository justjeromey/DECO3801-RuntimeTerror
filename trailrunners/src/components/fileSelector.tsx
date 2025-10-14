"use client";

import { SetStateAction, useEffect, useRef, useState, Dispatch } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Upload } from "lucide-react";
import Image from "next/image";

interface FileSelectorConfig {
    acceptedFileTypes: string;
    uploadEndpoint: string;
    fetchEndpoint?: string;
    uploadMessages?: {
        pending: string;
        success: string;
        error: string;
    };
    fetchMessages?: {
        pending: string;
        success: string;
        error: string;
    };
    selectionMessages?: {
        pending: string;
        success: string;
        error: string;
    };
    firstUseUploadText?: string;
    selectItemText?: string;
}

interface FileSelectorProps {
    onDataLoaded: (data: unknown) => void;
    selected: string;
    onSelectionChange: (name: string) => void;
    config: FileSelectorConfig;
    firstUse?: boolean;
    className?: string;
    defaultItems?: string[];
    setFileItem?: Dispatch<SetStateAction<FileItem | null>>;
    formDataHelper?: (formData: FormData) => void;
}

export interface FileItem {
    fileType: string;
    fileName?: string
    file?: File;
}

const defaultConfig: Partial<FileSelectorConfig> = {
    uploadMessages: {
        pending: "Uploading file...",
        success: "File uploaded.",
        error: "Failed to upload selected file",
    },
    fetchMessages: {
        pending: "Fetching items...",
        success: "Items successfully fetched",
        error: "Failed to retrieve items",
    },
    selectionMessages: {
        pending: "Processing selection...",
        success: "Selection processed.",
        error: "Failed to process selection",
    },
    firstUseUploadText: "Upload file",
    selectItemText: "Select item",
};

export default function FileSelector({
    onDataLoaded,
    selected,
    onSelectionChange,
    firstUse = false,
    config,
    className = "",
    defaultItems = [],
    setFileItem,
    formDataHelper,
}: FileSelectorProps) {
    const mergedConfig = { ...defaultConfig, ...config };
    const [items, setItems] = useState<Array<string>>(defaultItems);
    const [toggled, setToggle] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);
    const dropdown = useRef<HTMLDivElement>(null);

    // Fetch default items on component load
    useEffect(() => {
        if (!config.fetchEndpoint) {
            return;
        }

        async function fetchItems() {
            try {
                const promise = fetch(config.fetchEndpoint!).then(async (res) => {
                    if (!res.ok) {
                        throw new Error("Fetch failed");
                    }
                    return res.json();
                });

                const files = await toast.promise(promise, mergedConfig.fetchMessages!);

                if (files) {
                    setItems(files);
                }
            } catch (error) {
                console.error(error);
                return;
            }
        }

        fetchItems();
    }, [config.fetchEndpoint]);

    // Toggles the dropdown menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdown.current &&
                !dropdown.current.contains(event.target as Node)
            ) {
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

    // Loads the selected file and sends file to endpoint
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        if (formDataHelper) {
            formDataHelper(formData);
        }

        onSelectionChange(file.name);
        setToggle(false);
        setFileItem && setFileItem({fileType: config.acceptedFileTypes, fileName: file.name, file: file});

        try {
            if (pending) {
                return;
            }

            setPending(true);

            const promise = fetch(config.uploadEndpoint, {
                method: "POST",
                body: formData,
            }).then(async (res) => {
                if (!res.ok) {
                    throw new Error("Upload failed");
                }
                return res.json();
            });

            const result = await toast.promise(promise, mergedConfig.uploadMessages!);

            if (result) {
                onDataLoaded(result);
            }
        } catch (error) {
            console.error(`File upload failed ${error}`);
        } finally {
            setPending(false);
        }
    };

    // Handles item selection, sends request to endpoint
    const handleSelection = async (item: string) => {
        onSelectionChange(item);
        setToggle(false);

        try {
            if (pending) {
                return;
            }

            setPending(true);
            setFileItem && setFileItem({fileType: config.acceptedFileTypes, fileName: item});

            const formData = new FormData();
            formData.append("fileName", item);

            if (formDataHelper) {
                formDataHelper(formData);
            }

            const promise = fetch(config.uploadEndpoint, {
                method: "POST",
                body: formData,
            }).then(async (res) => {
                if (!res.ok) throw new Error("Processing failed");
                return res.json();
            });

            const result = await toast.promise(promise, mergedConfig.selectionMessages!);

            if (result) {
                onDataLoaded(result);
            }
        } catch (error) {
            console.error(`Selected item processing failed ${error}`);
        } finally {
            setPending(false);
        }
    };

    return (
        <div ref={dropdown} className={`relative z-10 ${firstUse ? "mt-4" : ""} ${className}`}>
            {/* Toggle button */}
            <button
                type="button"
                className={`${
                    firstUse
                        ? "flex items-center justify-center bg-green-400 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg gap-2 text-lg cursor-pointer"
                        : `fileSelector ${toggled ? "rounded-t-lg" : "rounded-lg"} hover:brightness-125`
                }`}
                onClick={() => setToggle(!toggled)}
            >
                {firstUse && <Upload className="w-6 h-6" />}

                <div className="flex">
                    <p>
                        {selected || (firstUse ? mergedConfig.firstUseUploadText : mergedConfig.selectItemText)}
                    </p>
                    {firstUse ? (
                        ""
                    ) : (
                        <Image
                            src="/DropDownMenu.svg"
                            alt="Drop down icon"
                            width={24}
                            height={24}
                            className={`inline-block ml-3 mt-0.5 ${toggled ? "rotate-180" : ""} transition`}
                        />
                    )}
                </div>
            </button>

            <div
                className={`absolute top-full left-0 border w-full max-h-64 p-2 gap-2 flex flex-col bg-accent-2 border-secondary 
                    rounded-b-lg overflow-y-auto shadow-lg z-20 ${toggled ? "block" : "hidden"}`}
            >
                {/* Upload option */}
                <input
                    type="file"
                    id="file-upload-label"
                    accept={config.acceptedFileTypes}
                    className="hidden"
                    onChange={handleUpload}
                />
                <label className="file_select_button cursor-pointer italic text-center animate-pulse" htmlFor="file-upload-label">
                    Upload {config.acceptedFileTypes} file
                </label>

                {/* Existing items */}
                {items.map((item, idx) => (
                    <button key={idx} type="button" className="file_select_button" onClick={() => handleSelection(item)}>
                        {item}
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
                style={{
                    position: "fixed",
                    top: "15vh",
                    left: "50%",
                    transform: "translateX(-50%)",
                    minWidth: "250px",
                    zIndex: 10000,
                }}
            />
        </div>
    );
}

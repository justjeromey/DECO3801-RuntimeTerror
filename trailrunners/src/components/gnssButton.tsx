"use client";
import { useState } from "react";
import { Upload, XCircle, CheckCircle, Loader2 } from "lucide-react";

async function onFileSelect(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/gnssConverter", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error("Conversion failed");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.txt$/i, ".gpx");
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

export default function GNSSButton() {
    const [status, setStatus] = useState<
        "idle" | "uploading" | "success" | "error"
    >("idle");

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
        setStatus("uploading");
        await onFileSelect(file);
        setStatus("success");
        } catch (err) {
        setStatus("error");
        }
    };

    return (
        <div className="flex justify-center">
        <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-50 h-50 rounded-lg cursor-pointer 
            transition-all duration-200
            ${
                status === "idle"
                ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : ""
            }
            ${
                status === "uploading"
                ? "bg-blue-500 text-white cursor-wait"
                : ""
            }
            ${
                status === "success"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : ""
            }
            ${
                status === "error"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : ""
            }
            `}
        >
            {status === "idle" && (
            <div className="flex flex-col items-center p-4 gap-3">
                <Upload />
                <span className="text-sm font-semibold text-center">
                Upload .txt File
                </span>
            </div>
            )}

            {status === "uploading" && (
            <div className="flex flex-col items-center p-4 gap-3">
                <Loader2 className="animate-spin" />
                <span className="text-sm font-semibold text-center">
                Converting...
                </span>
            </div>
            )}

            {status === "success" && (
            <div className="flex flex-col items-center p-4 gap-3">
                <CheckCircle />
                <span className="text-sm font-semibold text-center">
                Success! <br /> Click again to convert another file.
                </span>
            </div>
            )}

            {status === "error" && (
            <div className="flex flex-col items-center p-4 gap-3">
                <XCircle />
                <span className="text-sm font-semibold text-center">
                Failed. <br /> Try again and upload a valid .txt file.
                </span>
            </div>
            )}
        </label>

        <input
            id="file-upload"
            type="file"
            accept=".txt"
            className="hidden"
            onChange={handleChange}
        />
        </div>
    );
}
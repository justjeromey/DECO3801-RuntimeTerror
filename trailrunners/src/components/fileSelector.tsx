"use client";

import { useEffect, useState } from "react";

export default function FileSelector() {
    // Todo
    // - Add trail loading logic
    // - Add loading status
    // - Add file uploads

    const [trails, setTrails] = useState<Array<string>>([]);
    const [toggled, setToggle] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>("");

    useEffect(() => {
        // Grab default trails on load
        async function fetchTrails() {
            try {
                const res = await fetch("/api/fileReader");
                const files = await res.json();
                if (files) {
                    setTrails(files);
                }
            } catch (error) {
                console.log("File fetching failed.");
            }
        };

        fetchTrails();
    }, []);

    function handleDropdown() {
        setToggle(!toggled);
    }

    // Handles trail selection, sends request to render charts
    function handleSelection(trail: string) {
        setSelected(trail);
        setToggle(!toggled);
    }

    return (
        <div className="min-w-50 relative">
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
                {trails.map((trail: string, key: number) => (
                    <button
                        key={key}
                        type="button"
                        className="py-2 bg-accent-2 hover:brightness-125"
                        onClick={() => handleSelection(trail)}
                    >
                        {trail}
                    </button>
                ))}
            </div>
        </div>
    );
}

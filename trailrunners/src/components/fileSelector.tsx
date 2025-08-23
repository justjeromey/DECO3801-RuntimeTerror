"use client";

import { useState } from "react";

export default function FileSelector() {
    // Trail array
    let dummy: string[] = [];
    for (let i = 0; i < 20; i++) {
        dummy.push("trail " + i);
    }
    const [trails, setTrails] = useState<Array<string>>(dummy);
    const [toggled, setToggle] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>("");

    // This would fetch server dir for GPX files
    function handleClick() {
        setToggle(!toggled);
        console.log("hello");
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
                onClick={handleClick}
            >
                {selected === "" ? "Select a trail" : selected}
            </button>
            <div
                className={`border w-full max-h-[50vh] p-1 gap-2 flex flex-col bg-accent-2 border-secondary rounded-b-lg overflow-scroll ${toggled ? `absolute` : `hidden`}`}
            >
                {trails.map((trail:string, key:number) => (
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

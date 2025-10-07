"use client";
import React from "react";
import Image from "next/image";

interface HeaderProps {
    activePath: string;
}

const Header: React.FC<HeaderProps> = ({ activePath }) => {
    const navItems = [
        { href: "/", label: "Trail Summary" },
        { href: "/gpx_generate", label: "GPX Generate" },
        { href: "/about", label: "About" },
    ];

    return (
        <header className="header sticky top-0 z-50 flex flex-row justify-between items-center px-10 py-4 bg-white shadow-md">
        <Image
            src="/logo.svg"
            width={290}
            height={70}
            alt="TrailRunners"
            style={{ display: "block", width: 290, height: 70 }}
            priority
        />

        <div className="nav_links flex flex-row gap-10 text-lg font-medium uppercase">
            {navItems.map((item) => (
            <a
                key={item.href}
                href={item.href}
                className={`headerLink ${
                activePath === item.href
                    ? "activeLink text-green-600 font-bold"
                    : "text-gray-600 hover:text-green-500 transition-colors"
                }`}
            >
                {item.label}
            </a>
            ))}
        </div>
        </header>
    );
};

export default Header;
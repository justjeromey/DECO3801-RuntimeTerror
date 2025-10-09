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
        <header className="header">
        <a href="/">
        <Image
            src="/logo.svg"
            width={290}
            height={70}
            alt="TrailRunners"
            style={{ display: "block", width: 290, height: 70 }}
            priority
        />
        </a>

        <div className="nav_links flex flex-row items-center gap-2 font-medium uppercase">
            {navItems.map((item) => (
            <a
                key={item.href}
                href={item.href}
                className={`headerLink ${
                activePath === item.href
                    ? "activeLink text-green-600 font-bold"
                    : "text-gray-600 hover:text-green-500 transition-all"
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

"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; 

interface HeaderProps {
    activePath: string;
}

const Header: React.FC<HeaderProps> = ({ activePath }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { href: "/", label: "Trail Summary" },
        { href: "/gpx_generate", label: "GPX Generate" },
        { href: "/about", label: "About" },
    ];

    return (
        <header className="header">
            <a href="/" className="flex items-center">
                <Image
                    src="/logo.svg"
                    width={290}
                    height={70}
                    alt="TrailRunners"
                    className="block"
                    priority
                />
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex flex-row items-center gap-4 font-medium uppercase">
                {navItems.map((item) => (
                <a
                    key={item.href}
                    href={item.href}
                    className={`headerLink ${
                    activePath === item.href
                        ? "activeLink text-white font-bold inset-shadow-xs inset-shadow-white/4 transition-all border border-secondary ease-initial rounded-full bg-background"
                        : "text-gray-400 hover:text-white transition-all"
                    }`}
                >
                    {item.label}
                </a>
                ))}
            </nav>

            {/* Hamburger menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-400 hover:text-white cursor-pointer transition-colors">
                {menuOpen ? (
                    <XMarkIcon className="h-7 w-7" />
                ) : (
                    <Bars3Icon className="h-7 w-7" />
                )}
            </button>

            {menuOpen && (
                <div
                    className="absolute left-0 top-[calc(100%+0.5rem)] w-full bg-[#2a3024]/95 backdrop-blur-lg 
                            shadow-md flex flex-col py-3 md:hidden border border-gray-400/5 rounded-lg z-50 opacity-100"
                >
                    {navItems.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`block px-6 py-3 text-base uppercase text-center ${
                        activePath === item.href
                            ? "activeLink text-white font-bold inset-shadow-xs inset-shadow-white/4 transition-all border border-secondary ease-initial rounded-full bg-background"
                            : "text-gray-400 hover:text-white transition-all"
                        }`}
                    >
                        {item.label}
                    </a>
                    ))}
                </div>
            )}

        </header>
    );
};

export default Header;

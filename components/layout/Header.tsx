"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-azone-black/80 backdrop-blur-md shadow-sm border-b border-gray-800"
          : "bg-azone-black"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
            aria-label="Azone.store Home"
          >
            <div className="text-2xl md:text-3xl font-bold">
              <span className="text-white">Azone</span>
              <span className="text-azone-purple">.store</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              href="/templates"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/case-studies"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Case Studies
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              About
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-5">
            <Link
              href="/contact"
              className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/templates"
              className="px-6 py-2.5 text-sm font-semibold bg-azone-purple text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-azone-purple/50"
              aria-label="Get Started"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}


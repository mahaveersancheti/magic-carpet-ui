"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "About", href: "#about-company" },
    { name: "Features", href: "#about-product" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full max-w-6xl px-4 md:px-10 py-6 font-display">
      <div className="flex items-center justify-between whitespace-nowrap rounded-3xl px-8 py-4 glass border border-white/40 shadow-2xl relative">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="size-8 text-primary transition-transform duration-500 group-hover:rotate-12">
            <img
              src="/icon.png"
              alt="Magic Carpet Icon"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-black text-foreground tracking-tighter uppercase">Magic Carpet</h2>
        </div>

        <nav className="hidden md:flex flex-1 justify-center items-center gap-1">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="rounded-full h-11 px-6 flex items-center justify-center text-xs font-bold transition-all duration-300 hover:bg-black/5 text-gray-600 hover:text-black uppercase tracking-widest">
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex gap-3">
          <a href="/signin" className="flex items-center justify-center rounded-2xl h-11 px-6 text-xs font-black transition-all duration-300 border border-gray-200 hover:bg-gray-50 text-foreground uppercase tracking-widest shadow-sm active:scale-95">Sign In</a>
          <a href="/signup" className="flex items-center justify-center rounded-2xl h-11 px-8 bg-blue-600 text-white text-xs font-black transition-all duration-300 hover:bg-blue-700 uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95">Get Started</a>
        </div>

        <div className="lg:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="rounded-2xl p-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-[calc(100%+1rem)] left-0 right-0 glass border border-white/40 shadow-2xl rounded-3xl p-6 lg:hidden flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl h-12 px-6 flex items-center text-sm font-bold text-gray-600 hover:bg-black/5 hover:text-black uppercase tracking-widest transition-all"
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <a href="/signin" className="flex items-center justify-center rounded-2xl h-12 w-full text-sm font-black border border-gray-200 bg-white hover:bg-gray-50 text-foreground uppercase tracking-widest shadow-sm active:scale-95">Sign In</a>
              <a href="/signup" className="flex items-center justify-center rounded-2xl h-12 w-full bg-blue-600 text-white text-sm font-black hover:bg-blue-700 uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95">Get Started</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
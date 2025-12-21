"use client";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full max-w-6xl px-4 md:px-10 py-6 font-display">
      <div className="flex items-center justify-between whitespace-nowrap rounded-3xl px-8 py-4 glass border border-white/40 shadow-2xl">
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
          <a href="#about-company" className="rounded-full h-11 px-6 flex items-center justify-center text-xs font-bold transition-all duration-300 hover:bg-black/5 text-gray-600 hover:text-black uppercase tracking-widest">About</a>
          <a href="#about-product" className="rounded-full h-11 px-6 flex items-center justify-center text-xs font-bold transition-all duration-300 hover:bg-black/5 text-gray-600 hover:text-black uppercase tracking-widest">Features</a>
          <a href="#contact" className="rounded-full h-11 px-6 flex items-center justify-center text-xs font-bold transition-all duration-300 hover:bg-black/5 text-gray-600 hover:text-black uppercase tracking-widest">Contact</a>
        </nav>

        <div className="flex gap-3">
          <a href="/signin" className="flex items-center justify-center rounded-2xl h-11 px-6 text-xs font-black transition-all duration-300 border border-gray-200 hover:bg-gray-50 text-foreground uppercase tracking-widest shadow-sm active:scale-95">Sign In</a>
          <a href="/signup" className="flex items-center justify-center rounded-2xl h-11 px-8 bg-blue-600 text-white text-xs font-black transition-all duration-300 hover:bg-blue-700 uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95">Get Started</a>
        </div>

        <div className="md:hidden">
          <button className="rounded-2xl p-2 bg-gray-100 hover:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
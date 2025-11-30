"use client";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full max-w-6xl px-4 md:px-10 py-4 font-display">
      <div 
      className="flex items-center justify-between whitespace-nowrap rounded-full px-6 py-3 shadow-md"
      style={{background: '#E0E5EB'}}
      >
        <div className="flex items-center gap-4">
          <div className="size-6 text-primary">
            <img
              src="/icon.png"
              alt="A spell book with an open page and mystical symbols icon"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <h2 className="text-lg font-bold text-foreground">Magic Carpet</h2>
        </div>
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
          <a href="#about-company" className="rounded-full h-10 px-4 flex items-center justify-center text-sm font-medium transition-all duration-300 neo-button-light text-foreground">About Company</a>
          <a href="#about-product" className="rounded-full h-10 px-4 flex items-center justify-center text-sm font-medium transition-all duration-300 neo-button-light text-foreground">About Product</a>
          <a href="#contact" className="rounded-full h-10 px-4 flex items-center justify-center text-sm font-medium transition-all duration-300 neo-button-light text-foreground">Contact Details</a>
        </nav>
        <div className="flex gap-2">
          <a href="/signin" className="flex min-w-[84px] items-center justify-center rounded-full h-10 px-4 bg-background-light text-sm font-bold transition-all duration-300 neo-button-light text-foreground">Sign In</a>
          <a href="/signup" className="flex min-w-[84px] items-center justify-center rounded-full h-10 px-4 bg-background-light text-sm font-bold transition-all duration-300 neo-button-light text-foreground">Sign Up</a>
        </div>
        <div className="md:hidden">
          <button className="rounded-full p-2 neo-button-light">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
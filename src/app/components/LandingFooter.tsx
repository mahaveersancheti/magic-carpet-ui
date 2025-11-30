export default function LandingFooter() {
  return (
    <footer className="w-full max-w-6xl px-4 md:px-10 py-8 mt-16">
      <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-foreground">© 2024 Magic Carpet. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="text-sm hover:text-primary transition-colors text-foreground">Privacy Policy</a>
          <a href="#" className="text-sm hover:text-primary transition-colors text-foreground">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
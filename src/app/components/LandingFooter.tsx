export default function LandingFooter() {
  return (
    <footer className="w-full max-w-6xl px-4 md:px-10 py-8 mt-16">
      <div className="border-t border-gray-300 dark:border-gray-700/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-foreground dark:text-gray-300">© 2024 Visitor Search Management. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="text-sm hover:text-primary transition-colors text-foreground dark:text-gray-300">Privacy Policy</a>
          <a href="#" className="text-sm hover:text-primary transition-colors text-foreground dark:text-gray-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
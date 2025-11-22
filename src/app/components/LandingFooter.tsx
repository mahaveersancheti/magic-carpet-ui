export default function LandingFooter() {
  return (
    <footer className="w-full max-w-6xl px-4 md:px-10 py-8 mt-16">
      <div className="border-t border-text-light/20 dark:border-text-dark/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm">© 2024 Visitor Search Management. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
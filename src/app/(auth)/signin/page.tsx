export default function SignIn() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-light dark:bg-background-dark font-display">
      <div className="gradient-bg top-[-10%] left-[-10%] bg-blue-500/30 dark:bg-blue-800/20"></div>
      <div className="gradient-bg bottom-[-10%] right-[-10%] bg-pink-500/30 dark:bg-purple-800/20"></div>

      <main className="relative z-10 flex w-full max-w-md flex-col items-center rounded-lg p-6 sm:p-10">
        <div className="w-full rounded-xl bg-white/30 p-8 backdrop-blur-xl shadow-light-neumorphic dark:bg-black/20 dark:shadow-dark-neumorphic">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Welcome Back</h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Sign in to continue to your account.</p>
          </div>

          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="email" className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email / Username
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500">person</span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email or username"
                    className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 shadow-light-neumorphic-inset transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white dark:placeholder:text-slate-500 dark:shadow-dark-neumorphic-inset"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500">lock</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-12 text-slate-800 placeholder:text-slate-400 shadow-light-neumorphic-inset transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:text-white dark:placeholder:text-slate-500 dark:shadow-dark-neumorphic-inset"
                    autoComplete="current-password"
                  />
                  <button type="button" className="absolute right-4 text-slate-400 transition-colors hover:text-slate-500 dark:text-slate-500">
                    <span className="material-symbols-outlined">visibility</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3 font-semibold text-white shadow-light-neumorphic transition-all duration-300 hover:shadow-light-neumorphic-pressed active:scale-[0.98] dark:shadow-dark-neumorphic hover:dark:shadow-dark-neumorphic-pressed"
            >
              Sign In
            </button>

            <div className="flex items-center gap-4">
              <hr className="w-full border-slate-300 dark:border-slate-700" />
              <span className="text-sm text-slate-500 dark:text-slate-400">or</span>
              <hr className="w-full border-slate-300 dark:border-slate-700" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-background-light py-3 font-medium text-slate-800 shadow-light-neumorphic transition-all duration-300 hover:shadow-light-neumorphic-pressed active:scale-[0.98] dark:bg-background-dark dark:text-white dark:shadow-dark-neumorphic hover:dark:shadow-dark-neumorphic-pressed"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-semibold text-primary hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
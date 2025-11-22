export default function SignUp() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background-light p-4 font-display transition-colors duration-300 dark:bg-background-dark">
      <main className="z-10 flex w-full max-w-md flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Visitor Manager</h1>
        </div>

        <div className="w-full rounded-xl bg-background-light p-6 shadow-neomorph-light dark:bg-background-dark dark:shadow-neomorph-dark sm:p-8">
          <div className="mb-6 text-center">
            <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Create an Account</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Join us to manage your visitor requests seamlessly.</p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="full-name" className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500">person</span>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Enter your full name"
                  className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-primary focus:ring-opacity-50 dark:text-white dark:placeholder:text-slate-500 dark:shadow-neomorph-dark-pressed"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500">mail</span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-primary focus:ring-opacity-50 dark:text-white dark:placeholder:text-slate-500 dark:shadow-neomorph-dark-pressed"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500">lock</span>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-10 text-slate-900 placeholder:text-slate-400 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-primary focus:ring-opacity-50 dark:text-white dark:placeholder:text-slate-500 dark:shadow-neomorph-dark-pressed"
                  autoComplete="new-password"
                />
                <button type="button" className="absolute right-3 text-slate-400 transition-colors hover:text-slate-500 dark:text-slate-500">
                  <span className="material-symbols-outlined text-xl">visibility_off</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="confirm-password" className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500">lock</span>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-primary focus:ring-opacity-50 dark:text-white dark:placeholder:text-slate-500 dark:shadow-neomorph-dark-pressed"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary py-3 text-base font-bold text-white shadow-neomorph-light transition-all duration-300 hover:brightness-110 active:shadow-neomorph-light-pressed dark:shadow-neomorph-dark dark:active:shadow-neomorph-dark-pressed"
            >
              Sign Up
            </button>

            <div className="relative my-4 flex items-center">
              <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
              <span className="mx-4 flex-shrink text-xs text-slate-400 dark:text-slate-500">OR</span>
              <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-background-light py-3 text-base font-semibold text-slate-700 shadow-neomorph-light transition-all duration-300 active:shadow-neomorph-light-pressed dark:bg-background-dark dark:text-slate-200 dark:shadow-neomorph-dark dark:active:shadow-neomorph-dark-pressed"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  fill="#FFC107"
                ></path>
                <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"></path>
                <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"></path>
                <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.251,44,30.686,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"></path>
              </svg>
              Sign Up with Google
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <a href="/signin" className="font-bold text-primary hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
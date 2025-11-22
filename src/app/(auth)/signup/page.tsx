export default function SignUp() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0f141b] p-4 font-display dark:bg-[#0f141b]">

      {/* Background Glow Effects */}
      <div className="absolute top-[-20%] left-[-15%] h-[400px] w-[400px] rounded-full bg-blue-700/20 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-15%] h-[400px] w-[400px] rounded-full bg-purple-700/20 blur-[150px]" />

      <main className="z-10 flex w-full max-w-md flex-col items-center">

        {/* Title */}
        {/* <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Visitor Manager</h1>
        </div> */}

        {/* Glassy Card */}
        <div className="w-full rounded-3xl bg-black/30 p-8 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl border border-white/10">

          {/* Heading */}
          <div className="mb-6 text-center">
            <p className="text-2xl font-black tracking-tight text-white">
              Create an Account
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Join us to manage visitor requests seamlessly.
            </p>
          </div>

          {/* FORM — your fields untouched */}
          <form className="flex flex-col gap-5">

            {/* Full Name */}
            <div className="flex flex-col">
              <label
                htmlFor="full-name"
                className="mb-2 text-sm font-medium text-gray-300"
              >
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">person</span>
                <input
                  id="full-name"
                  type="text"
                  placeholder="Enter your full name"
                  className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-4 text-white placeholder:text-gray-500 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-blue-500 dark:shadow-neomorph-dark-pressed"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2 text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">mail</span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-4 text-white placeholder:text-gray-500 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-blue-500 dark:shadow-neomorph-dark-pressed"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2 text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">lock</span>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-10 text-white placeholder:text-gray-500 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-blue-500 dark:shadow-neomorph-dark-pressed"
                  autoComplete="new-password"
                />
                <button type="button" className="absolute right-3 text-gray-500 hover:text-gray-300">
                  <span className="material-symbols-outlined text-xl">visibility_off</span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label htmlFor="confirm-password" className="mb-2 text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-gray-500">lock</span>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  className="form-input w-full rounded-lg border-none bg-transparent py-3 pl-12 pr-4 text-white placeholder:text-gray-500 shadow-neomorph-light-pressed transition-shadow duration-300 focus:ring-2 focus:ring-blue-500 dark:shadow-neomorph-dark-pressed"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-base font-bold text-white hover:bg-blue-500 transition-all"
            >
              Sign Up
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-xs text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            {/* GOOGLE BUTTON */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-black/20 py-3 text-white border border-white/10 hover:bg-black/30 transition-all backdrop-blur-xl"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <a href="/signin" className="font-bold text-blue-400 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

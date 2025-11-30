import LandingHeader from "./components/LandingHeader";
import LandingFooter from "./components/LandingFooter";

const heroImage = "/landing.png"
  // "https://lh3.googleusercontent.com/aida-public/AB6AXuAmlGeNXnVDB94--T-Wr8dPXCh9qxzwf79BFvQ3wDtyHd7bzRK0Z4EMsuKwCKhkcanTcocBEwr-KAoODyuIqVjSnjGPf22lkHUZrnk_C9fq72l-ccE_sfDlqGZ6QAJmO9gTsqj63ZYWYgqNw05-laTYtOLqk_2WU2OKr9ImDRFGGzXW06e21wYF6yxauUgPIqCq5JXV0veNF0od5vHFLLNvAN1Wr_mBlES6aQoilIQ62IzsyKVCYeCtFDJo-oCd6HgNf7sahldAD6Yb";

const aboutImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBgMzqEasJKD211pVtrnOAWz7FlUEhFyb4XiVJsYaSDyg8HGJF_Q2kwupBdKUBblkqOwWlVbyPzGctWwjLTNpt5iHRsyYhdt4cjBNY0ITVHvZbd1TWbcqoH4gT7ZgWwsB-gJa566vbudVHEiyiS-vva-_hT67lkzRCRCoTikBDyb6wxkulo-jSA9ltivAB44tgLywONaoapqD6j_m4Zd3zws8fEGsmzggTBLBQJGC6ucj-3-KArpZGyRMBm2UzJCEMXynyAqsD0zI85";

const featureCards = [
  {
    title: "Real-Time Analytics",
    description: "Monitor visitor traffic and search queries as they happen with our live analytics.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBupVZ-oACtDt59awVWpzELujHsWxximoMGTP_rzjXFwxogAeIn7WRzafuzvYdDCr-y0UMFSqx9jRchiHIR4Y7vwoG7bO35Jcl7k3DoE_WBIsx-S5TXNeiZReJyhRZw5jb4Z39tYh3X2zxdzbSN3ivaJdjYXEnM1B1Ah0PRzTjF2GzXI7cGEFSe9VUQ_6sMJArir_PaImVRECzXTh6dN7NCn983DHrKb-VkMD0tqeilyoYkkVKEZfxuvXjBmUoj1dhc8QMKVsn4JffM",
    alt: "A colorful chart showing real-time data analytics",
  },
  {
    title: "Secure Data Handling",
    description: "We prioritize your security with end-to-end encryption and robust data protection.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCC9N0BzsNLSILGlXHfjbAD5EXndG3w8NXnX3m8qFZHXTP3bAVzJQEeK0G_s38jun6oqlggfGTDFxanx3MNXZ08r4kiK93fUkxO5kW--XTkeF3V80vMDPzaJMqgRqRisE-IaQcxZNoPEYzZ6gunG2bYtAzaTWSxmOHtOiBKpTWHaGoRchZsDLUY4OC75GEtYXS2aLc1XGnlAvSU_YJRlZTO-t57lQcJDEbgvYpcuFowFbwxjVS1WjLcqhNbmi3xJHDhNEV7lp0JeY_-",
    alt: "A digital lock icon symbolizing secure data handling",
  },
  {
    title: "Intuitive Dashboard",
    description: "Our clean and simple interface allows for easy navigation and management.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwje9zrUi8KCDzAZRz7ZZHbz3gjlEj4Y1swmfzBaHF45Fboa5vz6iNNkX4-5hiJfGbqVPD904izw0QaYfLlY5nJ6qNln31EBTCYrQhRTmIyZGEsDuprFY7uFkhijdZCQhwLt1MI1L1uJPsbYyVHjdGcFGu13WYPbuBPrKLTWJj59fRaiKGHT8LAyWjXs47dQiu4EiLEKUME_W_howoIndDMczgCjcsjpjbLjc3pTPlkcL79ZZKr8jkxzkkG4pF6vuYq5TG7PopnvaK",
    alt: "A clean and simple user interface dashboard",
  },
];

const contactItems = [
  { icon: "location_on", label: "Address", value: "123 Innovation Drive, Tech City, 45678" },
  { icon: "call", label: "Phone", value: "(123) 456-7890" },
  { icon: "mail", label: "Email", value: "support@vsm.com" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center bg-background-light text-foreground">
      <LandingHeader />
      <main className="w-full max-w-6xl px-4 md:px-10 py-5">
        <section className="w-full py-16 md:py-7">
          <div className="flex flex-col-reverse lg:flex-row gap-12 items-center">
            <div className="flex flex-col gap-8 text-center lg:text-left flex-1">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">Turn Every Cold Call Into a Warm Conversation</h1>
                <p className="text-base md:text-lg text-foreground">AI-powered intelligence briefs that help sales teams approach prospects like trusted advisors. <b>3-5X higher connect rates</b> in just 60 seconds.</p>
              </div>
              <a href="/signup" className="text-foreground self-center lg:self-start flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary font-bold tracking-wide transition-all duration-300 neo-button-light">
                Get Started for Free
              </a>
            </div>
            <div className="flex-1 w-full max-w-lg">
              <div className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-xl neo-card-light p-2" data-alt="Abstract 3D illustration of interconnected data nodes">
                <div className="w-full h-full bg-center bg-no-repeat bg-cover rounded-lg" style={{ backgroundImage: `url("${heroImage}")` }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24" id="about-company">
            <div className="flex flex-col gap-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">Who We Are</h2>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 rounded-xl bg-background-light neo-card-light p-8 md:p-12 transition-shadow duration-300">
              <div className="flex flex-col gap-4 flex-[2_2_0px] text-center lg:text-left">
                <p className="text-primary text-sm font-semibold tracking-wider uppercase">About The Company</p>
                <p className="text-2xl font-bold text-foreground">Our Mission</p>
                <p className="text-base md:text-lg text-foreground">
                Our purpose is to turn uncertainty into expertise. We provide cutting-edge, AI-powered intelligence designed to eliminate the friction of traditional cold calling. Our platform ensures that within seconds, your sales team is briefed and ready to approach prospects like informed, trusted partners. This commitment to instant personalization is the key to unlocking 3–5X higher connect rates and accelerating your sales success.
                </p>
              </div>
              <div className="w-full max-w-md flex-1 aspect-video rounded-lg shadow-neo-light-inset p-2">
                <div className="w-full h-full bg-center bg-no-repeat bg-cover rounded" data-alt="A modern office space with a team collaborating" style={{ backgroundImage: `url("${aboutImage}")` }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24" id="about-product">
            <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Features You'll Love</h2>
              <p className="text-base md:text-lg text-foreground">Discover the tools designed to enhance your visitor management process from start to finish.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureCards.map((feature) => (
                <div key={feature.title} className="flex flex-col gap-4 rounded-xl bg-background-light neo-card-light p-6 transition-shadow duration-300">
                  <div className="w-full aspect-video rounded-lg shadow-neo-light-inset p-2">
                    <div className="w-full h-full bg-center bg-no-repeat bg-cover rounded" data-alt={feature.alt} style={{ backgroundImage: `url("${feature.image}")` }}></div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{feature.title}</p>
                    <p className="text-sm text-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24" id="contact">
          <div className="rounded-xl bg-background-light neo-card-light p-8 md:p-12 transition-shadow duration-300">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Get In Touch</h2>
                <p className="text-base md:text-lg text-foreground">Have questions? We'd love to hear from you. Reach out and we'll get back to you shortly.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-3">
                    <div className="rounded-full p-4 neo-button-light transition-shadow duration-300">
                      <span className="material-symbols-outlined text-3xl text-primary">{item.icon}</span>
                    </div>
                    <h3 className="font-bold text-foreground">{item.label}</h3>
                    <p className="text-sm text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
function Footer() {
  return (
    <footer className="relative mt-3 rounded-2xl bg-white/5 p-6 sm:p-8 sm:text-black backdrop-blur-md text-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="">© {new Date().getFullYear()} Meraki Nexus</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Twitter
            </a>
            <a href="#" className="hover:underline">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

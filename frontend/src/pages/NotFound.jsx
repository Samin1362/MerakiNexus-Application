import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center text-center text-white">
      <div>
        <h1 className="text-4xl font-bold">404 — Page Not Found</h1>
        <p className="mt-2 text-white/80">
          The page you are looking for does not exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

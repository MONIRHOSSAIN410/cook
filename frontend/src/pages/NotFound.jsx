import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-app py-24 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-3 text-xl font-semibold">This page does not exist</h1>
      <p className="mt-2 text-sm text-slate-500">
        The link may be broken, or the page may have moved.
      </p>
      <Link to="/" className="btn-primary mt-6 inline-block">Back to home</Link>
    </div>
  );
}

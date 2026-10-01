import { Link } from "react-router-dom";

export default function SectionHeader({ title, subtitle, viewAllTo, viewAllLabel = "View all" }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="inline-block h-5 w-1.5 rounded-full bg-brand-600" />
          <h2 className="truncate text-lg font-semibold sm:text-xl">{title}</h2>
        </div>
        {subtitle && (
          <p className="ml-3.5 truncate text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="shrink-0 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}

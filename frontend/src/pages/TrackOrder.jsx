import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package } from "lucide-react";
import { SITE } from "../data/site.js";

export default function TrackOrder() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const number = value.trim().toUpperCase();
    if (number) navigate(`/order/${number}`);
  };

  return (
    <div className="container-app py-16">
      <div className="card mx-auto max-w-lg p-8 text-center">
        <Package size={36} className="mx-auto mb-4 text-brand-600" />
        <h1 className="mb-2 text-xl font-bold">Track your order</h1>
        <p className="mb-6 text-sm text-slate-500">
          Enter the order number from your receipt, for example CM-260902-4821.
        </p>

        <form onSubmit={submit} className="flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="CM-XXXXXX-XXXX"
            className="field"
            aria-label="Order number"
          />
          <button type="submit" className="btn-primary flex items-center gap-1">
            <Search size={16} /> Find
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          Lost your number? Call {SITE.phones.join(" or ")}.
        </p>
      </div>
    </div>
  );
}

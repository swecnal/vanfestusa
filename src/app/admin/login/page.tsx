"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (data.mustChangePassword) {
        router.push("/admin/change-password");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/images/vanfest-logo.png"
            alt="VanFest"
            className="h-16 mx-auto mb-4"
          />
          <h1 className="font-display font-bold text-2xl text-white">
            VanFest Admin
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Sign in to manage your site
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
              placeholder="you@vanfestusa.com"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white py-2.5 rounded-lg font-display font-semibold text-sm hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

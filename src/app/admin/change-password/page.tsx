"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mustChange, setMustChange] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.must_change_password) setMustChange(true);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully!");
      router.push("/admin");
    } catch {
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
            Change Your Password
          </h1>
          <p className="text-white/40 text-sm mt-1">
            You must set a new password before continuing
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          {!mustChange && (
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
                placeholder="Enter your current password"
              />
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal text-white py-2.5 rounded-lg font-display font-semibold text-sm hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

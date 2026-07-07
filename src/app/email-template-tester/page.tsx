"use client";

import React, { useState } from "react";

export default function EmailTemplateTesterPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Test Email Template");
  const [html, setHtml] = useState("<h1>Hello!</h1><p>This is a test.</p>");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!to.trim()) {
      setError("Please enter a recipient email address.");
      return;
    }
    if (!html.trim()) {
      setError("Please paste some HTML template content.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/email-template-tester", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, subject, html }),
      });

      const json = await res.json();

      if (!res.ok || json.ok === false) {
        setError(json.error || "Failed to send email.");
      } else {
        setResult("Email sent successfully!");
      }
    } catch (err: any) {
      console.error("Template test error:", err);
      setError(err?.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Email Template Tester
        </h1>
        <p className="text-sm text-gray-600">
          Paste your HTML email template, enter a test recipient, and send a
          test email. The template below is sent exactly as you provide it.
        </p>

        {/* Result / Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}
        {result && (
          <div className="border border-green-200 bg-green-50 text-green-700 text-sm px-3 py-2 rounded">
            {result}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To (recipient email)
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="example@domain.com"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Test Email Template"
            />
          </div>

          {/* HTML Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HTML Template
            </label>
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full min-h-[200px] border border-gray-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="<html>...</html>"
            />
            <p className="mt-1 text-xs text-gray-400">
              Paste your full HTML email here. Inline styles are recommended
              for email clients.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Test Email"}
            </button>
          </div>
        </form>

        {/* Live Preview */}
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">
            Live Preview (Browser Render)
          </h2>
          <div className="border border-gray-200 rounded p-3 bg-gray-50 max-h-[400px] overflow-auto">
            {/* ⚠️ Only for local testing/admin, fine here */}
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </section>
      </div>
    </main>
  );
}

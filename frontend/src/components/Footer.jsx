import React from "react";

export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white mt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer links */}
        <div className="flex flex-wrap justify-center gap-8 text-sm mb-6">
          <a href="/help" className="hover:underline">
            Help
          </a>
          <a href="/guidelines" className="hover:underline">
            Site Guidelines
          </a>
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/contact" className="hover:underline">
            Contact
          </a>
          <a href="/imprint" className="hover:underline">
            Imprint
          </a>
        </div>

        {/* Divider */}
        <div className="h-px bg-purple-600 opacity-50 mb-6" />

        {/* Copyright */}
        <p className="text-center text-xs opacity-80">
          © {new Date().getFullYear()} ETH RateTheProf. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

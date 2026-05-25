"use client";

import Link from "next/link";
import { useState } from "react";

// Need "use client" for the hamburger menu

const navItems = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/inventory/sold", label: "Sold" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="glass-card header-bar" style={{ borderRadius: open ? "28px" : undefined }}>
          <Link href="/" className="brand-block" aria-label="ARZ Auto home">
            <span className="brand-mark">ARZ</span>
            <span className="brand-copy">
              <span className="brand-kicker">Curated pre-owned vehicles</span>
              <span className="brand-name">ARZ Motorsports</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="nav-cluster desktop-nav">
            {navItems.map((item) => (
              <Link key={item.href} className="pill pill-ghost" href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="pill pill-primary" href="/inventory">Start search</Link>
            <Link className="pill pill-ghost" href="/admin">Admin</Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span style={{ display: "block", width: 22, height: 2, background: "currentColor", marginBottom: 5, transition: "all 0.2s", transform: open ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 2, background: "currentColor", marginBottom: 5, transition: "all 0.2s", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 2, background: "currentColor", transition: "all 0.2s", transform: open ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {open && (
          <div className="glass-card mobile-menu">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="mobile-nav-item" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href="/inventory" className="pill pill-primary" style={{ width: "100%", marginTop: 8 }} onClick={() => setOpen(false)}>
              Start search
            </Link>
            <Link href="/admin" className="mobile-nav-item" onClick={() => setOpen(false)}>
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
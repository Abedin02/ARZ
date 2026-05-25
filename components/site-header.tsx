"use client";
import Link from "next/link";
import { useState } from "react";

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
        {/* Main bar */}
        <div
          className="glass-card"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 72,
            padding: "10px 16px 10px 20px",
            borderRadius: 999,
          }}
        >
          {/* Brand */}
          <Link href="/" className="brand-block" aria-label="ARZ Auto home">
            <span className="brand-mark">ARZ</span>
            <span className="brand-copy">
              <span className="brand-kicker">Curated pre-owned vehicles</span>
              <span className="brand-name">ARZ Motorsports</span>
            </span>
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav
            aria-label="Primary"
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => (
              <Link key={item.href} className="pill pill-ghost" href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="pill pill-primary" href="/inventory">
              Start search
            </Link>
            <Link className="pill pill-ghost" href="/admin">
              Admin
            </Link>
          </nav>

          {/* Hamburger — visible on mobile only */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              gap: 5,
              padding: 8,
              cursor: "pointer",
              background: "transparent",
              border: "none",
              color: "var(--text)",
            }}
            className="hamburger-btn"
          >
            <span style={{
              display: "block", width: 22, height: 2,
              background: "currentColor", borderRadius: 2,
              transition: "transform 0.2s",
              transform: open ? "rotate(45deg) translate(4px, 7px)" : "none",
            }} />
            <span style={{
              display: "block", width: 22, height: 2,
              background: "currentColor", borderRadius: 2,
              transition: "opacity 0.2s",
              opacity: open ? 0 : 1,
            }} />
            <span style={{
              display: "block", width: 22, height: 2,
              background: "currentColor", borderRadius: 2,
              transition: "transform 0.2s",
              transform: open ? "rotate(-45deg) translate(4px, -7px)" : "none",
            }} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div
            className="glass-card"
            style={{
              marginTop: 8,
              borderRadius: 24,
              padding: 16,
              display: "grid",
              gap: 4,
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "14px 16px",
                  borderRadius: 14,
                  color: "var(--text)",
                  fontWeight: 500,
                  fontSize: "1rem",
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/inventory"
              className="pill pill-primary"
              onClick={() => setOpen(false)}
              style={{ width: "100%", marginTop: 8 }}
            >
              Start search
            </Link>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "14px 16px",
                borderRadius: 14,
                color: "var(--muted)",
                fontSize: "0.9rem",
              }}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
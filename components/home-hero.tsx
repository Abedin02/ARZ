"use client";

import Link from "next/link";

export function HomeHero() {
  return (
    <section className="section" style={{ paddingTop: 10 }}>
      <div className="container">
        <div className="page-intro-copy home-hero-copy">
          <div className="eyebrow">Premium pre-owned showroom</div>
          <h1 className="section-title">Find the right used car without the usual noise.</h1>
          <p className="section-copy">
            ARZ brings a cleaner dealership experience to the web: transparent pricing,
            confident imagery, and a direct path from homepage discovery to vehicle detail.
          </p>
          <div className="hero-actions">
            <Link className="pill pill-primary" href="/inventory">
              View inventory
            </Link>
            <Link className="pill pill-secondary" href="/sold">
              See sold vehicles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

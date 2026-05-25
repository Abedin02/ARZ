import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/sold", label: "Sold" },
];

export function SiteHeader() {
  return (
    <header className="header">
      <div className="container">
        <div className="glass-card header-bar">
          <Link href="/" className="brand-block" aria-label="ARZ Auto home">
            <span className="brand-mark">ARZ</span>
            <span className="brand-copy">
              <span className="brand-kicker">Curated pre-owned vehicles</span>
              <span className="brand-name">ARZ Motorsports</span>
            </span>
          </Link>
          <nav aria-label="Primary" className="nav-cluster">
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
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section">
      <div className="container">
        <div
          className="glass-card"
          style={{
            padding: "64px 32px",
            borderRadius: "var(--radius-xl)",
            textAlign: "center"
          }}
        >
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            Vehicle not found
          </div>
          <h1 className="section-title">That listing has moved out of the showroom.</h1>
          <p className="section-copy" style={{ marginInline: "auto" }}>
            The vehicle may have been sold or the link may have changed. Head back to the active
            inventory to keep browsing.
          </p>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
            <Link className="pill pill-primary" href="/inventory">
              View inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

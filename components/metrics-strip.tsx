export function MetricsStrip() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="stats-grid">
          {[
            ["Local sourcing", "Tri-state market insight and direct wholesale relationships."],
            ["Transparent pricing", "Mileage, trim, and pricing stay visible from search to detail page."],
            ["Inspection ready", "Condition context and specs are surfaced before shoppers need to ask."],
            ["Fast follow-up", "Homepage-to-inventory flow is built to shorten time to inquiry."]
          ].map(([title, copy]) => (
            <div key={title} className="glass-card metric-card">
              <h2 className="card-heading">{title}</h2>
              <p className="muted">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

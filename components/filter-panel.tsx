"use client";

import type { Filters, FilterOptions } from "@/lib/filters";

type FilterPanelProps = {
  id?: string;
  title: string;
  subtitle: string;
  filters: Filters;
  options: FilterOptions;
  onChange: (filters: Filters) => void;
  onReset: () => void;
};

export function FilterPanel({
  id,
  title,
  subtitle,
  filters,
  options,
  onChange,
  onReset
}: FilterPanelProps) {
  const listId = (suffix: string) => (id ? `${id}-${suffix}` : `filter-${suffix}`);

  return (
    <section id={id} aria-label={title} className="dark-panel filter-panel">
      <div>
        <h2 className="card-heading">{title}</h2>
        <p className="section-copy" style={{ marginTop: 8 }}>
          {subtitle}
        </p>
      </div>
      <div className="filter-grid">
        <Field label="Max price">
          <input
            list={listId("price")}
            inputMode="numeric"
            placeholder="Any price"
            value={filters.maxPrice}
            onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })}
            style={{
              width: "100%",
              minWidth: 0,
              color: "var(--text)",
              background: "transparent",
              border: "none",
              outline: "none"
            }}
          />
          <datalist id={listId("price")}>
            {options.prices.map((price) => (
              <option key={price} value={String(price)}>
                {`Up to $${price.toLocaleString()}`}
              </option>
            ))}
          </datalist>
        </Field>
        <Field label="Min year">
          <input
            list={listId("year")}
            inputMode="numeric"
            placeholder="Any year"
            value={filters.minYear}
            onChange={(event) => onChange({ ...filters, minYear: event.target.value })}
            style={{
              width: "100%",
              minWidth: 0,
              color: "var(--text)",
              background: "transparent",
              border: "none",
              outline: "none"
            }}
          />
          <datalist id={listId("year")}>
            {options.years.map((year) => (
              <option key={year} value={String(year)}>
                {`${year}+`}
              </option>
            ))}
          </datalist>
        </Field>
        <Field label="Make">
          <input
            list={listId("make")}
            placeholder="All makes"
            value={filters.make}
            onChange={(event) => onChange({ ...filters, make: event.target.value })}
            style={{
              width: "100%",
              minWidth: 0,
              color: "var(--text)",
              background: "transparent",
              border: "none",
              outline: "none"
            }}
          />
          <datalist id={listId("make")}>
            {options.makes.map((make) => (
              <option key={make} value={make} />
            ))}
          </datalist>
        </Field>
        <Field label="Max mileage">
          <input
            list={listId("mileage")}
            inputMode="numeric"
            placeholder="Any mileage"
            value={filters.maxMileage}
            onChange={(event) => onChange({ ...filters, maxMileage: event.target.value })}
            style={{
              width: "100%",
              minWidth: 0,
              color: "var(--text)",
              background: "transparent",
              border: "none",
              outline: "none"
            }}
          />
          <datalist id={listId("mileage")}>
            {options.mileages.map((mileage) => (
              <option key={mileage} value={String(mileage)}>
                {`Under ${mileage.toLocaleString()}`}
              </option>
            ))}
          </datalist>
        </Field>
      </div>
      <div className="card-actions">
        <button className="pill pill-secondary" onClick={onReset} type="button">
          Reset filters
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="field-control">{children}</span>
    </label>
  );
}

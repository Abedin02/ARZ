"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabaseClient";
import { formatCurrency } from "@/lib/formatters";

const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET!;

type Car = {
  id: string;
  stock_number: string;
  vin: string | null;
  year: number | null;
  make: string;
  model: string;
  body_style: string | null;
  price: number | null;
  mileage: number | null;
  condition: string | null;
  engine: string | null;
  cylinders: number | null;
  fuel_type: string | null;
  transmission: string | null;
  drivetrain: string | null;
  doors: number | null;
  exterior_color: string | null;
  interior_color: string | null;
  status: string | null;
  is_featured: boolean | null;
  description: string | null;
};

type FormData = Omit<Car, "id">;

type UploadedImage = {
  url: string;
  is_hero: boolean;
  label: string;
  sort_order: number;
};

const empty: FormData = {
  stock_number: "",
  vin: "",
  year: null,
  make: "",
  model: "",
  body_style: "Sedan",
  price: null,
  mileage: null,
  condition: "used",
  engine: "",
  cylinders: null,
  fuel_type: "gas",
  transmission: "automatic",
  drivetrain: "fwd",
  doors: null,
  exterior_color: "",
  interior_color: "",
  status: "available",
  is_featured: false,
  description: "",
};

// ── Field components ──────────────────────────────────────────────────────────

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid rgba(21,32,43,0.12)",
  background: "rgba(255,255,255,0.8)",
  fontSize: "0.95rem",
  width: "100%",
  outline: "none",
  color: "#1a1a1a",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

function TextField({ label, field, form, setForm, type = "text" }: {
  label: string; field: keyof FormData; form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>; type?: string;
}) {
  const val = form[field];
  const strVal = val === null || val === undefined ? "" : String(val);
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label className="muted" style={labelStyle}>{label}</label>
      <input
        type={type}
        value={strVal}
        onChange={(e) => setForm((f) => ({
          ...f,
          [field]: type === "number"
            ? e.target.value === "" ? null : Number(e.target.value)
            : e.target.value,
        }))}
        style={inputStyle}
      />
    </div>
  );
}

function SelectField({ label, field, form, setForm, options }: {
  label: string; field: keyof FormData; form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>; options: string[];
}) {
  const val = form[field];
  const strVal = val === null || val === undefined ? "" : String(val);
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <label className="muted" style={labelStyle}>{label}</label>
      <select
        value={strVal}
        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
        style={{ ...inputStyle, color: "#1a1a1a", background: "rgba(255,255,255,0.8)" }}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ color: "#1a1a1a", background: "#fff" }}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({ label, field, form, setForm }: {
  label: string; field: keyof FormData; form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  const val = form[field];
  const strVal = val === null || val === undefined ? "" : String(val);
  return (
    <div style={{ display: "grid", gap: 6, gridColumn: "1 / -1" }}>
      <label className="muted" style={labelStyle}>{label}</label>
      <textarea
        value={strVal}
        rows={4}
        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
        style={{ ...inputStyle, resize: "vertical" }}
      />
    </div>
  );
}

function CheckboxField({ label, field, form, setForm }: {
  label: string; field: keyof FormData; form: FormData;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <input
        type="checkbox"
        checked={!!form[field]}
        onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.checked }))}
        style={{ width: 18, height: 18, cursor: "pointer" }}
      />
      <label className="muted">{label}</label>
    </div>
  );
}

// ── Image uploader ────────────────────────────────────────────────────────────

function ImageUploader({ images, setImages, uploading, setUploading, uploadErrors, setUploadErrors }: {
  images: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploadErrors: string[];
  setUploadErrors: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [dragOver, setDragOver] = useState(false);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    setUploadErrors([]);
    const fileArray = Array.from(files);
    const uploaded: UploadedImage[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (error) {
        // Collect error but continue uploading remaining files
        errors.push(`Failed to upload "${file.name}": ${error.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

      uploaded.push({
        url: publicUrl,
        is_hero: images.length === 0 && uploaded.length === 0,
        label: "",
        sort_order: images.length + uploaded.length,
      });
    }

    if (errors.length > 0) setUploadErrors(errors);
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  }

  function setHero(index: number) {
    setImages((prev) => prev.map((img, i) => ({ ...img, is_hero: i === index })));
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (prev[index].is_hero && next.length > 0) next[0].is_hero = true;
      return next;
    });
  }

  function updateLabel(index: number, label: string) {
    setImages((prev) => prev.map((img, i) => i === index ? { ...img, label } : img));
  }

  return (
    <div style={{ display: "grid", gap: 16, gridColumn: "1 / -1" }}>
      <label className="muted" style={labelStyle}>Car images</label>

      {/* Upload errors */}
      {uploadErrors.length > 0 && (
        <div style={{ display: "grid", gap: 6 }}>
          {uploadErrors.map((err, i) => (
            <p key={i} style={{
              margin: 0, fontSize: "0.85rem", color: "rgb(220,38,38)",
              padding: "8px 12px", background: "rgba(220,38,38,0.06)",
              borderRadius: 10, border: "1px solid rgba(220,38,38,0.15)"
            }}>
              ⚠ {err}
            </p>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragOver ? "rgba(21,32,43,0.4)" : "rgba(21,32,43,0.15)"}`,
          borderRadius: 16,
          padding: "32px 24px",
          textAlign: "center",
          background: dragOver ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)",
          transition: "all 0.2s",
          cursor: "pointer",
        }}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        {uploading ? (
          <p className="muted" style={{ margin: 0 }}>Uploading...</p>
        ) : (
          <>
            <p style={{ margin: 0, fontWeight: 600 }}>Drop images here or click to browse</p>
            <p className="muted" style={{ margin: "6px 0 0", fontSize: "0.85rem" }}>
              JPG, PNG, WEBP supported · First image becomes the hero
            </p>
          </>
        )}
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {images.map((img, i) => (
            <div
              key={img.url}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: img.is_hero ? "2px solid #b8962e" : "2px solid transparent",
                background: "rgba(255,255,255,0.5)",
                display: "grid",
              }}
            >
              <div style={{ position: "relative", height: 120 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {img.is_hero && (
                  <span style={{
                    position: "absolute", top: 8, left: 8,
                    background: "#b8962e", color: "#fff",
                    fontSize: "0.7rem", fontWeight: 700,
                    padding: "2px 8px", borderRadius: 99,
                    letterSpacing: "0.04em",
                  }}>
                    HERO
                  </span>
                )}
                <button
                  onClick={() => removeImage(i)}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    background: "rgba(220,38,38,0.85)", color: "#fff",
                    border: "none", borderRadius: "50%",
                    width: 24, height: 24, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 700,
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: 8, display: "grid", gap: 6 }}>
                <input
                  placeholder="Label (e.g. Front)"
                  value={img.label}
                  onChange={(e) => updateLabel(i, e.target.value)}
                  style={{ ...inputStyle, fontSize: "0.8rem", padding: "6px 10px" }}
                />
                {!img.is_hero && (
                  <button
                    onClick={() => setHero(i)}
                    className="pill pill-secondary"
                    style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                  >
                    Set as hero
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [form, setForm] = useState<FormData>(empty);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  useEffect(() => {
    checkAuth();
    fetchCars();
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function checkAuth() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) router.replace("/admin");
  }

  async function fetchCars() {
    const { data } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });
    setCars(data ?? []);
  }

  async function handleSubmit() {
    if (!form.stock_number) { setError("Stock number is required."); return; }
    setLoading(true);
    setError("");
    try {
      let carId = editingId;

      if (editingId) {
        const { error } = await supabase.from("cars").update(form).eq("id", editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("cars").insert([form]).select().single();
        if (error) throw error;
        carId = data.id;
      }

      // Save images to car_images table
      if (images.length > 0 && carId) {
        if (editingId) {
          await supabase.from("car_images").delete().eq("car_id", carId);
        }
        const imageRows = images.map((img) => ({
          car_id: carId,
          url: img.url,
          is_hero: img.is_hero,
          label: img.label,
          sort_order: img.sort_order,
        }));
        const { error: imgError } = await supabase.from("car_images").insert(imageRows);
        if (imgError) throw imgError;
      }

      setForm(empty);
      setImages([]);
      setUploadErrors([]);
      setEditingId(null);
      setShowForm(false);
      fetchCars();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this car and all its images? This cannot be undone.")) return;
    await supabase.from("car_images").delete().eq("car_id", id);
    await supabase.from("cars").delete().eq("id", id);
    fetchCars();
  }

  async function handleStatusChange(id: string, status: "available" | "sold") {
    setError("");
    const { error } = await supabase.from("cars").update({ status }).eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    fetchCars();
  }

  async function handleEdit(car: Car) {
    const { id, ...rest } = car;
    setForm(rest);
    setEditingId(id);
    setUploadErrors([]);

    const { data } = await supabase
      .from("car_images")
      .select("*")
      .eq("car_id", id)
      .order("sort_order");
    setImages(data ?? []);

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setForm(empty);
    setImages([]);
    setUploadErrors([]);
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  const fp = { form, setForm };

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: "grid", gap: 32 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="eyebrow">Admin</div>
              <h1 className="section-title">Dashboard</h1>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="pill pill-primary"
                onClick={() => showForm ? handleCancel() : setShowForm(true)}
              >
                {showForm ? "Cancel" : "+ Add car"}
              </button>
              <button className="pill pill-secondary" onClick={handleLogout}>Sign out</button>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="glass-card" style={{ padding: 32, borderRadius: "28px", display: "grid", gap: 24 }}>
              <div className="eyebrow">{editingId ? "Edit car" : "Add new car"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                <TextField label="Stock number *" field="stock_number" {...fp} />
                <TextField label="VIN" field="vin" {...fp} />
                <TextField label="Year" field="year" type="number" {...fp} />
                <TextField label="Make" field="make" {...fp} />
                <TextField label="Model" field="model" {...fp} />
                <SelectField label="Body style" field="body_style" options={["Sedan", "SUV", "Truck", "Wagon", "Coupe", "Convertible", "Van"]} {...fp} />
                <TextField label="Price" field="price" type="number" {...fp} />
                <TextField label="Mileage" field="mileage" type="number" {...fp} />
                <SelectField label="Condition" field="condition" options={["used", "new", "certified"]} {...fp} />
                <TextField label="Engine" field="engine" {...fp} />
                <TextField label="Cylinders" field="cylinders" type="number" {...fp} />
                <SelectField label="Fuel type" field="fuel_type" options={["gas", "diesel", "electric", "hybrid"]} {...fp} />
                <SelectField label="Transmission" field="transmission" options={["automatic", "manual", "cvt"]} {...fp} />
                <SelectField label="Drivetrain" field="drivetrain" options={["fwd", "rwd", "awd", "4wd"]} {...fp} />
                <TextField label="Doors" field="doors" type="number" {...fp} />
                <TextField label="Exterior color" field="exterior_color" {...fp} />
                <TextField label="Interior color" field="interior_color" {...fp} />
                <SelectField label="Status" field="status" options={["available", "sold"]} {...fp} />
                <CheckboxField label="Featured" field="is_featured" {...fp} />
                <TextareaField label="Description" field="description" {...fp} />
                <ImageUploader
                  images={images}
                  setImages={setImages}
                  uploading={uploading}
                  setUploading={setUploading}
                  uploadErrors={uploadErrors}
                  setUploadErrors={setUploadErrors}
                />
              </div>

              {error && (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "rgb(220,38,38)", padding: "10px 14px", background: "rgba(220,38,38,0.06)", borderRadius: 10, border: "1px solid rgba(220,38,38,0.15)" }}>
                  {error}
                </p>
              )}

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="pill pill-primary"
                  onClick={handleSubmit}
                  disabled={loading || uploading}
                  style={{ opacity: loading || uploading ? 0.7 : 1 }}
                >
                  {uploading ? "Uploading images..." : loading ? "Saving..." : editingId ? "Update car" : "Add car"}
                </button>
                <button className="pill pill-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          )}

          {/* Car list */}
          <div style={{ display: "grid", gap: 16 }}>
            <div className="eyebrow">{cars.length} cars in database</div>
            {cars.map((car) => (
              <div
                key={car.id}
                className="glass-card"
                style={{ padding: "20px 24px", borderRadius: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <div style={{ fontWeight: 600 }}>{car.year} {car.make} {car.model}</div>
                  <div className="muted" style={{ fontSize: "0.85rem" }}>
                    {car.stock_number} · {car.status} · {car.price ? formatCurrency(car.price) : "—"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    className="pill pill-secondary"
                    onClick={() => handleStatusChange(car.id, car.status === "sold" ? "available" : "sold")}
                  >
                    {car.status === "sold" ? "Mark available" : "Mark sold"}
                  </button>
                  <button className="pill pill-secondary" onClick={() => handleEdit(car)}>Edit</button>
                  <button
                    className="pill"
                    onClick={() => handleDelete(car.id)}
                    style={{ background: "rgba(220,38,38,0.1)", color: "rgb(220,38,38)", border: "1px solid rgba(220,38,38,0.2)" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

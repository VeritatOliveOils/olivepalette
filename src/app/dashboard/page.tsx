"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import type { Producer, Product } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({
    name: "",
    region: "",
    country: "",
    website: "",
    instagram_url: "",
    logo_url: "",
    shipping_regions: "",
    certifications_text: "",
    is_women_led: false,
    story: "",
  });

  useEffect(() => {
    const supabase = getSupabase();
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        router.push("/login");
        return;
      }
      let { data: prod } = await supabase
        .from("producers")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (!prod) {
        // Profile row may be missing if email confirmation interrupted signup
        const { data: inserted } = await supabase
          .from("producers")
          .insert({ id: user.id, name: user.email?.split("@")[0] ?? "My Brand" })
          .select()
          .single();
        prod = inserted;
      }
      setProducer(prod);
      if (prod) {
        setProfileDraft({
          name: prod.name ?? "",
          region: prod.region ?? "",
          country: prod.country ?? "",
          website: prod.website ?? "",
          instagram_url: prod.instagram_url ?? "",
          logo_url: prod.logo_url ?? "",
          shipping_regions: (prod.shipping_regions ?? []).join(", "),
          certifications_text: prod.certifications_text ?? "",
          is_women_led: !!prod.is_women_led,
          story: prod.story ?? "",
        });
        const { data: prods } = await supabase
          .from("products")
          .select("*")
          .eq("producer_id", prod.id)
          .order("created_at", { ascending: false });
        setProducts(prods ?? []);
      }
      setLoading(false);
    })();
  }, [router]);

  async function saveProfile() {
    if (!producer) return;
    const supabase = getSupabase();
    const { data } = await supabase
      .from("producers")
      .update({
        name: profileDraft.name.trim() || producer.name,
        region: profileDraft.region.trim() || null,
        country: profileDraft.country.trim() || null,
        website: profileDraft.website.trim() || null,
        instagram_url: profileDraft.instagram_url.trim() || null,
        logo_url: profileDraft.logo_url.trim() || null,
        shipping_regions: profileDraft.shipping_regions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        certifications_text: profileDraft.certifications_text.trim() || null,
        is_women_led: profileDraft.is_women_led,
        story: profileDraft.story.trim() || null,
      })
      .eq("id", producer.id)
      .select()
      .single();
    if (data) setProducer(data);
    setEditingProfile(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const supabase = getSupabase();
    await supabase.from("products").delete().eq("id", id);
    setProducts((p) => p.filter((x) => x.id !== id));
  }

  async function logout() {
    await getSupabase().auth.signOut();
    router.push("/");
  }

  if (loading) return <p className="mt-16 text-center text-olive-500">Loading…</p>;

  return (
    <div className="mt-4 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-olive-900">
            {producer?.name}
          </h1>
          <p className="text-sm text-olive-600">
            {[producer?.region, producer?.country].filter(Boolean).join(", ") ||
              "Add your region to help buyers find you"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setEditingProfile(!editingProfile)}>
            {editingProfile ? "Cancel" : "Edit profile"}
          </button>
          <button className="btn-secondary" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      {editingProfile && (
        <div className="rounded-2xl border border-olive-200 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Brand name</label>
              <input
                className="input"
                value={profileDraft.name}
                onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Website</label>
              <input
                className="input"
                placeholder="https://…"
                value={profileDraft.website}
                onChange={(e) => setProfileDraft({ ...profileDraft, website: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Region</label>
              <input
                className="input"
                placeholder="e.g. Central Valley, California"
                value={profileDraft.region}
                onChange={(e) => setProfileDraft({ ...profileDraft, region: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input
                className="input"
                value={profileDraft.country}
                onChange={(e) => setProfileDraft({ ...profileDraft, country: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Instagram URL</label>
              <input
                className="input"
                placeholder="https://instagram.com/…"
                value={profileDraft.instagram_url}
                onChange={(e) =>
                  setProfileDraft({ ...profileDraft, instagram_url: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Logo URL</label>
              <input
                className="input"
                placeholder="https://…/logo.png"
                value={profileDraft.logo_url}
                onChange={(e) =>
                  setProfileDraft({ ...profileDraft, logo_url: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Ships to (comma-separated)</label>
              <input
                className="input"
                placeholder="US, Canada, EU, UK"
                value={profileDraft.shipping_regions}
                onChange={(e) =>
                  setProfileDraft({ ...profileDraft, shipping_regions: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Certifications (PDO/PGI, organic body…)</label>
              <input
                className="input"
                value={profileDraft.certifications_text}
                onChange={(e) =>
                  setProfileDraft({ ...profileDraft, certifications_text: e.target.value })
                }
              />
            </div>
            <div className="flex items-center sm:col-span-2">
              <label className="flex items-center gap-2 text-sm text-olive-800">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-olive-700"
                  checked={profileDraft.is_women_led}
                  onChange={(e) =>
                    setProfileDraft({ ...profileDraft, is_women_led: e.target.checked })
                  }
                />
                Women-led business
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Your story (shown on your public page)</label>
              <textarea
                className="input min-h-28"
                placeholder="Paste your About page here — family history, groves, milling philosophy…"
                value={profileDraft.story}
                onChange={(e) => setProfileDraft({ ...profileDraft, story: e.target.value })}
              />
            </div>
          </div>
          <button className="btn-primary mt-4" onClick={saveProfile}>
            Save profile
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-olive-900">
          Your oils ({products.length})
        </h2>
        <Link href="/dashboard/new" className="btn-primary">
          + Add a product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-olive-300 bg-olive-50 p-10 text-center">
          <p className="mb-2 text-2xl">🫒</p>
          <p className="mb-1 font-semibold text-olive-800">
            Add your first oil in under a minute
          </p>
          <p className="mb-4 text-sm text-olive-600">
            Just copy the text from your website or label — Smart Paste fills in the rest.
          </p>
          <Link href="/dashboard/new" className="btn-primary">
            Try Smart Paste
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-olive-200 bg-white px-5 py-4"
            >
              <div>
                <p className="font-semibold text-olive-900">
                  {p.name}{" "}
                  {p.status === "approved" ? (
                    <span className="tag !bg-olive-700 !text-white">✓ Certified</span>
                  ) : p.status === "rejected" ? (
                    <span className="tag !bg-red-100 !text-red-800">Not approved</span>
                  ) : (
                    <span className="tag !bg-gold/20 !text-olive-900">In review</span>
                  )}
                </p>
                <p className="text-sm text-olive-600">
                  {[
                    p.intensity,
                    p.flavor_tags.slice(0, 3).join(", "),
                    p.price_usd != null ? `$${Number(p.price_usd).toFixed(2)}` : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <div className="flex gap-2">
                {p.status === "approved" && (
                  <Link href={`/oil/${p.id}`} className="btn-secondary !py-1.5">
                    View
                  </Link>
                )}
                <Link href={`/dashboard/new?edit=${p.id}`} className="btn-secondary !py-1.5">
                  Edit
                </Link>
                <button
                  className="btn-secondary !py-1.5 !text-red-700"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

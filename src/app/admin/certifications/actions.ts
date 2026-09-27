"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type CertificationInput = {
  title: string;
  issuer: string;
  description: string;
  type: string;
  sortOrder: string;
  isPublished: boolean;
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) throw new Error("You must be signed in as an admin.");

  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
  if (!admin) throw new Error("Admin access is required.");
  return supabase;
}

function payload(input: CertificationInput) {
  return {
    title: input.title.trim(),
    issuer: input.issuer.trim(),
    description: input.description.trim(),
    type: input.type.trim() || "formal",
    sort_order: Number.parseInt(input.sortOrder, 10) || 0,
    is_published: input.isPublished,
  };
}

function validate(input: CertificationInput) {
  if (!input.title.trim()) throw new Error("Title is required.");
  if (!input.issuer.trim()) throw new Error("Issuer or platform is required.");
}

export async function createCertification(input: CertificationInput) {
  validate(input);
  const supabase = await requireAdmin();
  const { error } = await supabase.from("certifications").insert(payload(input));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/admin");
}

export async function updateCertification(id: string, input: CertificationInput) {
  validate(input);
  const supabase = await requireAdmin();
  const { error } = await supabase.from("certifications").update(payload(input)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/admin");
}

export async function deleteCertification(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/admin");
}

export async function toggleCertificationPublished(id: string, isPublished: boolean) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("certifications").update({ is_published: isPublished }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/certifications");
  revalidatePath("/admin");
}

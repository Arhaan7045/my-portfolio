"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ExperienceInput = {
  period: string;
  title: string;
  organization: string;
  description: string;
  sortOrder: string;
  isPublished: boolean;
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    throw new Error("You must be signed in as an admin.");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!admin) {
    throw new Error("Admin access is required.");
  }

  return supabase;
}

function normalizeExperience(input: ExperienceInput) {
  return {
    period: input.period.trim(),
    title: input.title.trim(),
    organization: input.organization.trim(),
    description: input.description.trim(),
    sort_order: Number.parseInt(input.sortOrder, 10) || 0,
    is_published: input.isPublished,
  };
}

function validateExperience(input: ExperienceInput) {
  if (!input.period.trim()) throw new Error("Period is required.");
  if (!input.title.trim()) throw new Error("Title is required.");
  if (!input.organization.trim()) throw new Error("Organization is required.");
}

export async function createExperience(input: ExperienceInput) {
  validateExperience(input);
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("experience")
    .insert(normalizeExperience(input));

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/experience");
  revalidatePath("/admin");
}

export async function updateExperience(id: string, input: ExperienceInput) {
  validateExperience(input);
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("experience")
    .update(normalizeExperience(input))
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/experience");
  revalidatePath("/admin");
}

export async function deleteExperience(id: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("experience").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/experience");
  revalidatePath("/admin");
}

export async function toggleExperiencePublished(id: string, isPublished: boolean) {
  const supabase = await requireAdmin();

  const { error } = await supabase
    .from("experience")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/experience");
  revalidatePath("/admin");
}

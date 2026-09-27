"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type SkillGroupInput = {
  title: string;
  skills: string;
  sortOrder: string;
  isPublished: boolean;
};

type LearningAreaInput = {
  title: string;
  description: string;
  sortOrder: string;
  isPublished: boolean;
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) throw new Error("You must be signed in as an admin.");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!admin) throw new Error("Admin access is required.");
  return supabase;
}

function skillPayload(input: SkillGroupInput) {
  return {
    title: input.title.trim(),
    skills: input.skills.split(",").map((item) => item.trim()).filter(Boolean),
    sort_order: Number.parseInt(input.sortOrder, 10) || 0,
    is_published: input.isPublished,
  };
}

function learningPayload(input: LearningAreaInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    sort_order: Number.parseInt(input.sortOrder, 10) || 0,
    is_published: input.isPublished,
  };
}

function validateTitle(title: string) {
  if (!title.trim()) throw new Error("Title is required.");
}

export async function createSkillGroup(input: SkillGroupInput) {
  validateTitle(input.title);
  const supabase = await requireAdmin();
  const { error } = await supabase.from("skill_groups").insert(skillPayload(input));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
}

export async function updateSkillGroup(id: string, input: SkillGroupInput) {
  validateTitle(input.title);
  const supabase = await requireAdmin();
  const { error } = await supabase.from("skill_groups").update(skillPayload(input)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
}

export async function deleteSkillGroup(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("skill_groups").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
}

export async function toggleSkillGroupPublished(id: string, isPublished: boolean) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("skill_groups").update({ is_published: isPublished }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
}

export async function createLearningArea(input: LearningAreaInput) {
  validateTitle(input.title);
  const supabase = await requireAdmin();
  const { error } = await supabase.from("learning_areas").insert(learningPayload(input));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
}

export async function updateLearningArea(id: string, input: LearningAreaInput) {
  validateTitle(input.title);
  const supabase = await requireAdmin();
  const { error } = await supabase.from("learning_areas").update(learningPayload(input)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
}

export async function deleteLearningArea(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("learning_areas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
}

export async function toggleLearningAreaPublished(id: string, isPublished: boolean) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("learning_areas").update({ is_published: isPublished }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/admin");
}

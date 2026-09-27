"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ProjectInput = {
  slug: string;
  title: string;
  category: string;
  status: string;
  description: string;
  details: string;
  tags: string;
  sortOrder: string;
  isPublished: boolean;
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!admin) {
    redirect("/admin/login");
  }

  return supabase;
}

function normalizeProject(input: ProjectInput) {
  const slug = input.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const tags = input.tags
    .split(",")
    .map((tag) => tag.trim().toUpperCase())
    .filter(Boolean);

  const sortOrder = Number.parseInt(input.sortOrder, 10);

  return {
    slug,
    title: input.title.trim(),
    category: input.category.trim(),
    status: input.status.trim() || "IN PROGRESS",
    description: input.description.trim(),
    details: input.details.trim(),
    tags,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_published: input.isPublished,
  };
}

export async function createProject(input: ProjectInput) {
  const supabase = await requireAdmin();
  const project = normalizeProject(input);

  if (!project.slug || !project.title || !project.category) {
    throw new Error("Title, slug, and category are required.");
  }

  const { error } = await supabase.from("projects").insert(project);

  if (error) {
    if (error.code === "23505") {
      throw new Error("A project with this slug already exists.");
    }

    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

export async function updateProject(id: string, input: ProjectInput) {
  const supabase = await requireAdmin();
  const project = normalizeProject(input);

  if (!id || !project.slug || !project.title || !project.category) {
    throw new Error("Project ID, title, slug, and category are required.");
  }

  const { error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      throw new Error("A project with this slug already exists.");
    }

    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

export async function deleteProject(id: string) {
  const supabase = await requireAdmin();

  if (!id) {
    throw new Error("Project ID is required.");
  }

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

export async function toggleProjectPublished(id: string, isPublished: boolean) {
  const supabase = await requireAdmin();

  if (!id) {
    throw new Error("Project ID is required.");
  }

  const { error } = await supabase
    .from("projects")
    .update({ is_published: isPublished })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

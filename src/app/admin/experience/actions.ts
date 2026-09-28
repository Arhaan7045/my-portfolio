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

function normalizeExperience(input: ExperienceInput, sortOrder: number) {
  return {
    period: input.period.trim(),
    title: input.title.trim(),
    organization: input.organization.trim(),
    description: input.description.trim(),
    sort_order: sortOrder,
    is_published: input.isPublished,
  };
}

function validateExperience(input: ExperienceInput) {
  if (!input.period.trim()) throw new Error("Period is required.");
  if (!input.title.trim()) throw new Error("Title is required.");
  if (!input.organization.trim()) throw new Error("Organization is required.");
}

function parseRequestedOrder(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 1;
}

async function getExperienceOrders(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase
    .from("experience")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

async function setExperienceOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: string[],
  startOrder: number,
  step: number,
) {
  for (let index = 0; index < ids.length; index += 1) {
    const { error } = await supabase
      .from("experience")
      .update({ sort_order: startOrder + index * step })
      .eq("id", ids[index]);

    if (error) {
      throw new Error(error.message);
    }
  }
}

export async function createExperience(input: ExperienceInput) {
  validateExperience(input);
  const supabase = await requireAdmin();

  const existing = await getExperienceOrders(supabase);
  const requestedOrder = parseRequestedOrder(input.sortOrder);
  const targetOrder = Math.max(1, Math.min(requestedOrder, existing.length + 1));

  // Shift the records at/after the requested position down by one.
  const affected = existing.filter((item) => item.sort_order >= targetOrder);
  await setExperienceOrder(
    supabase,
    affected.map((item) => item.id),
    targetOrder + 1,
    1,
  );

  const { error } = await supabase
    .from("experience")
    .insert(normalizeExperience(input, targetOrder));

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/experience");
  revalidatePath("/admin");
}

export async function updateExperience(id: string, input: ExperienceInput) {
  validateExperience(input);
  const supabase = await requireAdmin();

  if (!id) {
    throw new Error("Experience ID is required.");
  }

  const existing = await getExperienceOrders(supabase);
  const current = existing.find((item) => item.id === id);

  if (!current) {
    throw new Error("Experience record not found.");
  }

  const requestedOrder = parseRequestedOrder(input.sortOrder);
  const targetOrder = Math.max(1, Math.min(requestedOrder, existing.length));

  if (targetOrder < current.sort_order) {
    // Example: 3 → 1 means 1 → 2 and 2 → 3.
    const affected = existing
      .filter(
        (item) =>
          item.id !== id &&
          item.sort_order >= targetOrder &&
          item.sort_order < current.sort_order,
      )
      .sort((a, b) => a.sort_order - b.sort_order);

    await setExperienceOrder(
      supabase,
      affected.map((item) => item.id),
      targetOrder + 1,
      1,
    );
  } else if (targetOrder > current.sort_order) {
    // Example: 1 → 3 means 2 → 1 and 3 → 2.
    const affected = existing
      .filter(
        (item) =>
          item.id !== id &&
          item.sort_order > current.sort_order &&
          item.sort_order <= targetOrder,
      )
      .sort((a, b) => a.sort_order - b.sort_order);

    await setExperienceOrder(
      supabase,
      affected.map((item) => item.id),
      current.sort_order,
      1,
    );
  }

  const { error } = await supabase
    .from("experience")
    .update(normalizeExperience(input, targetOrder))
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/experience");
  revalidatePath("/admin");
}

export async function deleteExperience(id: string) {
  const supabase = await requireAdmin();

  if (!id) {
    throw new Error("Experience ID is required.");
  }

  const existing = await getExperienceOrders(supabase);
  const current = existing.find((item) => item.id === id);

  if (!current) {
    throw new Error("Experience record not found.");
  }

  const { error } = await supabase.from("experience").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  // Close the gap left by the deleted record.
  const affected = existing
    .filter((item) => item.id !== id && item.sort_order > current.sort_order)
    .sort((a, b) => a.sort_order - b.sort_order);

  await setExperienceOrder(
    supabase,
    affected.map((item) => item.id),
    current.sort_order,
    1,
  );

  revalidatePath("/admin/experience");
  revalidatePath("/admin");
}

export async function toggleExperiencePublished(id: string, isPublished: boolean) {
  const supabase = await requireAdmin();

  if (!id) {
    throw new Error("Experience ID is required.");
  }

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

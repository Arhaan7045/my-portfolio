"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";

type ProjectInput = { slug:string; title:string; category:string; status:string; description:string; details:string; tags:string; sortOrder:string; isPublished:boolean };

function parseOrder(value:string, fallback=1) {
  const parsed=Number.parseInt(value,10);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function normalizeProject(input:ProjectInput, sortOrder:number) {
  const slug=input.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  const tags=input.tags.split(",").map(tag=>tag.trim().toUpperCase()).filter(Boolean);
  return {slug,title:input.title.trim(),category:input.category.trim(),status:input.status.trim()||"IN PROGRESS",description:input.description.trim(),details:input.details.trim(),tags,sort_order:sortOrder,is_published:input.isPublished};
}
async function getOrders(supabase:Awaited<ReturnType<typeof createClient>>) {
  const {data,error}=await supabase.from("projects").select("id, sort_order").order("sort_order",{ascending:true}).order("created_at",{ascending:true});
  if(error) throw new Error(error.message);
  return data??[];
}
async function setOrders(supabase:Awaited<ReturnType<typeof createClient>>, ids:string[], start:number) {
  for(let i=0;i<ids.length;i++){
    const {error}=await supabase.from("projects").update({sort_order:start+i}).eq("id",ids[i]);
    if(error) throw new Error(error.message);
  }
}

export async function createProject(input:ProjectInput) {
  const supabase=await requireAdmin();
  const existing=await getOrders(supabase);
  const target=Math.max(1,Math.min(parseOrder(input.sortOrder,existing.length+1),existing.length+1));
  const affected=existing.filter(item=>item.sort_order>=target).sort((a,b)=>a.sort_order-b.sort_order);
  await setOrders(supabase,affected.map(item=>item.id),target+1);
  const project=normalizeProject(input,target);
  if(!project.slug||!project.title||!project.category) throw new Error("Title, slug, and category are required.");
  const {error}=await supabase.from("projects").insert(project);
  if(error){if(error.code==="23505") throw new Error("A project with this slug already exists."); throw new Error(error.message);}
  revalidatePath("/admin/projects"); revalidatePath("/admin");
}

export async function updateProject(id:string,input:ProjectInput) {
  const supabase=await requireAdmin();
  if(!id) throw new Error("Project ID is required.");
  const existing=await getOrders(supabase);
  const current=existing.find(item=>item.id===id);
  if(!current) throw new Error("Project record not found.");
  const target=Math.max(1,Math.min(parseOrder(input.sortOrder,current.sort_order),existing.length));
  const affected=existing.filter(item=>item.id!==id && item.sort_order>=Math.min(current.sort_order,target) && item.sort_order<=Math.max(current.sort_order,target)).sort((a,b)=>a.sort_order-b.sort_order);
  if(target<current.sort_order) await setOrders(supabase,affected.map(item=>item.id),target+1);
  if(target>current.sort_order) await setOrders(supabase,affected.map(item=>item.id),current.sort_order);
  const project=normalizeProject(input,target);
  if(!project.slug||!project.title||!project.category) throw new Error("Title, slug, and category are required.");
  const {error}=await supabase.from("projects").update(project).eq("id",id);
  if(error){if(error.code==="23505") throw new Error("A project with this slug already exists."); throw new Error(error.message);}
  revalidatePath("/admin/projects"); revalidatePath("/admin");
}

export async function deleteProject(id:string) {
  const supabase=await requireAdmin();
  const existing=await getOrders(supabase);
  const current=existing.find(item=>item.id===id);
  if(!current) throw new Error("Project record not found.");
  const {error}=await supabase.from("projects").delete().eq("id",id);
  if(error) throw new Error(error.message);
  const affected=existing.filter(item=>item.id!==id && item.sort_order>current.sort_order).sort((a,b)=>a.sort_order-b.sort_order);
  await setOrders(supabase,affected.map(item=>item.id),current.sort_order);
  revalidatePath("/admin/projects"); revalidatePath("/admin");
}

export async function toggleProjectPublished(id:string,isPublished:boolean) {
  const supabase=await requireAdmin();
  if(!id) throw new Error("Project ID is required.");
  const {error}=await supabase.from("projects").update({is_published:isPublished}).eq("id",id);
  if(error) throw new Error(error.message);
  revalidatePath("/admin/projects"); revalidatePath("/admin");
}

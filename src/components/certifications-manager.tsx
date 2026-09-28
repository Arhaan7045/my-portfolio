"use client";

import { useState, type FormEvent } from "react";
import { AdminConfirmDialog } from "@/components/admin-confirm-dialog";
import { createCertification, deleteCertification, toggleCertificationPublished, updateCertification } from "@/app/admin/certifications/actions";

type Certification={id:string;title:string;issuer:string;description:string;type:string;sort_order:number;is_published:boolean;created_at:string;updated_at:string};
type Form={title:string;issuer:string;description:string;type:string;sortOrder:string;isPublished:boolean};
const empty:Form={title:"",issuer:"",description:"",type:"formal",sortOrder:"0",isPublished:true};
const date=(v:string)=>new Intl.DateTimeFormat("en",{dateStyle:"medium",timeStyle:"short"}).format(new Date(v));

export function CertificationsManager({certifications}:{certifications:Certification[]}){
  const [open,setOpen]=useState(certifications.length===0),[editing,setEditing]=useState<string|null>(null),[form,setForm]=useState< Form>(empty),[busy,setBusy]=useState(false),[error,setError]=useState(""),[pendingDelete,setPendingDelete]=useState<Certification|null>(null);
  const reset=()=>{setEditing(null);setForm(empty);setOpen(false);};
  async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");try{editing?await updateCertification(editing,form):await createCertification(form);reset();window.location.reload();}catch(x){setError(x instanceof Error?x.message:"Something went wrong.");}finally{setBusy(false);}}
  async function del(item:Certification){if(!window.confirm(`Delete “${item.title}”? This cannot be undone.`))return;setBusy(true);setError("");try{await deleteCertification(item.id);window.location.reload();}catch(x){setError(x instanceof Error?x.message:"Something went wrong.");setBusy(false);}}
  async function toggle(item:Certification){setBusy(true);setError("");try{await toggleCertificationPublished(item.id,!item.is_published);window.location.reload();}catch(x){setError(x instanceof Error?x.message:"Something went wrong.");setBusy(false);}}

  return <section className="admin-projects-section" aria-label="Certification management">
    <div className="admin-projects-toolbar"><div><span className="admin-auth-label">Credential library</span><p>Formal certificates and virtual experiences use the same database with a type field.</p></div><button className="admin-primary-action" type="button" onClick={()=>{setEditing(null);setForm(empty);setOpen(true);}}>+ ADD CREDENTIAL</button></div>
    {error?<p className="admin-login-error" role="alert">{error}</p>:null}
    {open?<form className="admin-project-form" onSubmit={submit}>
      <div className="admin-project-form-head"><div><span className="admin-auth-label">{editing?"Edit credential":"New credential"}</span><h2>{editing?"Update credential.":"Add a credential."}</h2></div><button className="admin-ghost-action" type="button" onClick={reset} disabled={busy}>CANCEL</button></div>
      <div className="admin-form-grid">
        <label><span>Title</span><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Google Cybersecurity Professional Certificate" required/></label>
        <label><span>Issuer / platform</span><input value={form.issuer} onChange={e=>setForm({...form,issuer:e.target.value})} placeholder="Google / Coursera" required/></label>
        <label><span>Type</span><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="formal">Formal certification</option><option value="virtual">Virtual experience</option></select></label>
        <label><span>Sort order</span><input type="number" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:e.target.value})}/></label>
        <label className="admin-form-wide"><span>Description</span><textarea rows={6} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="What was completed and what it covered..."/></label>
      </div>
      <label className="admin-checkbox-row"><input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form,isPublished:e.target.checked})}/><span><strong>Published</strong><small>Visible to the public after migration.</small></span></label>
      <div className="admin-project-form-actions"><button className="admin-primary-action" disabled={busy}>{busy?"SAVING...":editing?"SAVE CHANGES ↗":"CREATE CREDENTIAL ↗"}</button></div>
    </form>:null}
    {certifications.length===0?<div className="admin-empty-state"><span>NO CREDENTIAL RECORDS</span><h2>Your credential library is empty.</h2><p>Add certifications and virtual experiences here.</p><button className="admin-primary-action" type="button" onClick={()=>setOpen(true)}>+ ADD FIRST CREDENTIAL</button></div>:<div className="admin-project-list">{certifications.map((item,i)=><article className="admin-project-card" key={item.id}><div className="admin-project-index"><span>{String(i+1).padStart(2,"0")}</span><small>{item.is_published?"PUBLISHED":"DRAFT"}</small></div><div className="admin-project-main"><div className="admin-project-card-head"><div><span>{item.type.toUpperCase()}</span><h2>{item.title}</h2></div><strong>{item.issuer}</strong></div><p>{item.description||"No description added yet."}</p><div className="admin-project-meta"><span>ORDER {item.sort_order}</span><span>UPDATED {date(item.updated_at)}</span></div></div><div className="admin-project-actions"><button className="admin-ghost-action" onClick={()=>{setEditing(item.id);setForm({title:item.title,issuer:item.issuer,description:item.description,type:item.type,sortOrder:String(item.sort_order),isPublished:item.is_published});setOpen(true);}} disabled={busy}>EDIT</button><button className="admin-ghost-action" onClick={()=>toggle(item)} disabled={busy}>{item.is_published?"UNPUBLISH":"PUBLISH"}</button><button className="admin-danger-action" onClick={()=>requestDelete(item)} disabled={busy}>DELETE</button></div></article>)}</div>}
    <AdminConfirmDialog open={Boolean(pendingDelete)} title={pendingDelete ? `Delete “${pendingDelete.title}”?` : "Delete credential?"} description="This will permanently remove this credential and close its position in the credential order. This action cannot be undone." busy={busy} onCancel={()=>setPendingDelete(null)} onConfirm={deleteConfirmed}/>
  </section>;
}

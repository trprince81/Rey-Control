"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const API = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/rey-ink-admin`;
const PRICE = { "Especial 5":13, "Básico 10":20, "Pro 35":30, "Plus 50":50, "Business 100":70, "Enterprise 500":150, "Max 1000":350, "Mensual":13, "Trimestral":39, "Prueba":0 };

export default function AdminPage(){
  const router=useRouter();
  const [user,setUser]=useState(null),[tab,setTab]=useState("dashboard"),[data,setData]=useState({clients:[],licenses:[],plans:[]}),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[message,setMessage]=useState("");
  const [client,setClient]=useState({name:"",email:"",phone:"",notes:""});
  const [license,setLicense]=useState({email:"",planId:"",maxDevices:1});
  const [modoClaro,setModoClaro]=useState(false);

  useEffect(()=>{try{const u=JSON.parse(localStorage.getItem("user")||"null");const s=localStorage.getItem("adminSession");if(!u||u.role!=="admin"||!s){router.push("/login");return}setUser(u);load(s)}catch{router.push("/login")}},[]);
  const load=async(s=localStorage.getItem("adminSession"))=>{setLoading(true);try{const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json","x-admin-session":s||""},body:JSON.stringify({action:"bootstrap"})});const x=await r.json();if(r.status===401){localStorage.removeItem("adminSession");router.push("/login");return}if(!r.ok||!x.ok)throw Error(x.error||"No se pudo cargar");setData({clients:x.clients||[],licenses:x.licenses||[],plans:x.plans||[]});}catch(e){setMessage(e.message)}finally{setLoading(false)}};
  const call=async(action,body={})=>{setSaving(true);setMessage("");try{const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json","x-admin-session":localStorage.getItem("adminSession")||""},body:JSON.stringify({action,...body})});const x=await r.json();if(!r.ok||!x.ok)throw Error(x.error||"Operación no completada");setMessage("✓ Operación realizada correctamente");await load();return x}catch(e){setMessage("⚠ "+e.message)}finally{setSaving(false)}};
  const createClient=()=>{if(!client.name||!client.email)return setMessage("⚠ Completa nombre y correo");call("create_client",client).then(x=>{if(x?.client)setClient({name:"",email:"",phone:"",notes:""})})};
  const createLicense=()=>{if(!license.email||!license.planId)return setMessage("⚠ Selecciona cliente y paquete");call("create_license",license).then(x=>{if(x?.license){setLicense({email:"",planId:"",maxDevices:1});setTab("licencias")}})};
  const update=(id,patch)=>call("update_license",{id,...patch});
  const renew=id=>call("renew_license",{id});
  const logout=()=>{localStorage.removeItem("adminSession");localStorage.removeItem("user");router.push("/login")};
  const active=data.licenses.filter(x=>x.status==="active").length, expired=data.licenses.filter(x=>x.status==="expired"||x.status==="revoked").length;
  const planName=id=>data.plans.find(p=>p.id===id)?.name||"—";
  const sortedClients=useMemo(()=>data.clients,[data.clients]);
  if(!user||loading)return <div style={page}><div style={glass}><h2>Cargando Rey Ink…</h2></div></div>;

  return <div style={page}>
    <aside style={side}><div style={brand}>REY INK <span>◈</span></div><div style={adminTag}>ADMINISTRACIÓN</div>{[["dashboard","⌂ Dashboard"],["clientes","👤 Clientes"],["licencias","🔑 Licencias Mutant"],["crear","＋ Crear licencia"],["usuarios","👥 Usuarios"],["config","⚙ Configuración"]].map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={nav(tab===id)}>{label}</button>)}<button onClick={logout} style={logoutStyle}>Cerrar sesión</button></aside>
    <main style={main}><header style={header}><div><div style={eyebrow}>CENTRO DE CONTROL</div><h1 style={{margin:0}}>Rey Ink</h1></div><div style={status}>● Mutant conectado al backend</div></header>
      {message&&<div style={notice}>{message}</div>}
      {tab==="dashboard"&&<><h2>Resumen</h2><div style={grid}><Stat title="Clientes" value={data.clients.length}/><Stat title="Licencias activas" value={active}/><Stat title="Licencias totales" value={data.licenses.length}/><Stat title="Suspendidas / vencidas" value={expired}/></div><section style={glass}><div style={sectionHead}><h2 style={{margin:0}}>Últimas licencias</h2><button style={greenBtn} onClick={()=>setTab("crear")}>＋ Nueva licencia</button></div><LicenseTable rows={data.licenses.slice(0,8)} planName={planName} onAction={update} onRenew={renew}/></section></>}
      {tab==="clientes"&&<><div style={sectionHead}><h2>Clientes</h2><button style={greenBtn} onClick={()=>setTab("crearCliente")}>＋ Nuevo cliente</button></div><section style={glass}><table style={table}><thead><tr><th>Cliente</th><th>Correo</th><th>Teléfono</th><th>Producto</th><th>Estado</th></tr></thead><tbody>{sortedClients.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td>{c.phone||"—"}</td><td>{c.product||"Mutant"}</td><td><Badge text={c.status}/></td></tr>)}</tbody></table></section></>}
      {tab==="crearCliente"&&<FormCard title="Crear cliente" subtitle="El cliente quedará disponible para asignarle una licencia Mutant."><Field label="Nombre" value={client.name} onChange={v=>setClient({...client,name:v})}/><Field label="Correo" type="email" value={client.email} onChange={v=>setClient({...client,email:v})}/><Field label="WhatsApp / teléfono" value={client.phone} onChange={v=>setClient({...client,phone:v})}/><Field label="Notas" value={client.notes} onChange={v=>setClient({...client,notes:v})}/><button style={greenBtn} disabled={saving} onClick={createClient}>{saving?"Guardando…":"Crear cliente"}</button></FormCard>}
      {tab==="crear"&&<FormCard title="Crear licencia Mutant" subtitle="Aquí se selecciona el cliente y el paquete. No se pide ninguna clave administrativa adicional."><label style={label}>Cliente</label><select style={input} value={license.email} onChange={e=>setLicense({...license,email:e.target.value})}><option value="">Seleccionar cliente…</option>{data.clients.map(c=><option key={c.id} value={c.email}>{c.name} — {c.email}</option>)}</select><label style={label}>Paquete</label><select style={input} value={license.planId} onChange={e=>setLicense({...license,planId:e.target.value})}><option value="">Seleccionar paquete…</option>{data.plans.map(p=><option key={p.id} value={p.id}>{p.name} — US${PRICE[p.name]??"—"} — {p.max_profiles} perfiles</option>)}</select><label style={label}>Límite de dispositivos</label><input style={input} type="number" min="1" value={license.maxDevices} onChange={e=>setLicense({...license,maxDevices:Number(e.target.value||1)})}/><div style={miniInfo}>Mutant será creado como producto <b>Mutant</b> y la licencia quedará vinculada al correo seleccionado.</div><button style={greenBtn} disabled={saving} onClick={createLicense}>{saving?"Generando…":"Generar licencia"}</button></FormCard>}
      {tab==="licencias"&&<section style={glass}><div style={sectionHead}><div><h2 style={{margin:0}}>Licencias Mutant</h2><small>Control central de las licencias que usa el programa.</small></div><button style={greenBtn} onClick={()=>setTab("crear")}>＋ Generar licencia</button></div><LicenseTable rows={data.licenses} planName={planName} onAction={update} onRenew={renew}/></section>}
      {tab==="usuarios"&&<section style={glass}><h2>Usuarios</h2><p>Los usuarios de Rey Ink siguen administrándose desde el sistema existente. La sesión del administrador actual se reutiliza para las operaciones de licencias.</p></section>}
      {tab==="config"&&<section style={glass}><h2>Configuración</h2><p>La administración de licencias Mutant ya no solicita una clave administrativa por cada operación. La autorización se establece al iniciar sesión y se mantiene mediante una sesión temporal.</p><button style={button} onClick={()=>setModoClaro(!modoClaro)}>{modoClaro?"Modo oscuro":"Modo claro"}</button></section>}
    </main>
  </div>;
}

function LicenseTable({rows,planName,onAction,onRenew}){return <div style={{overflowX:"auto"}}><table style={table}><thead><tr><th>Cliente</th><th>Paquete</th><th>Licencia</th><th>Estado</th><th>Vence</th><th>Dispositivo</th><th>Acciones</th></tr></thead><tbody>{rows.length?rows.map(l=><tr key={l.id}><td><b>{l.client_name||"—"}</b><br/><small>{l.client_email}</small></td><td>{planName(l.plan_id)}</td><td><code>{l.license_key}</code></td><td><Badge text={l.status}/></td><td>{l.expires_at?new Date(l.expires_at).toLocaleDateString():"Sin vencimiento"}</td><td>{l.device_id?"Vinculado":"Libre"}</td><td style={{whiteSpace:"nowrap"}}><button style={smallBtn} onClick={()=>onAction(l.id,{status:l.status==="active"?"paused":"active"})}>{l.status==="active"?"Pausar":"Activar"}</button><button style={smallBtn} onClick={()=>onRenew(l.id)}>Renovar</button><button style={smallBtn} onClick={()=>onAction(l.id,{resetDevice:true})}>Liberar equipo</button>{l.status!=="revoked"&&<button style={dangerBtn} onClick={()=>onAction(l.id,{status:"revoked"})}>Revocar</button>}</td></tr>):<tr><td colSpan="7">No hay licencias todavía.</td></tr>}</tbody></table></div>}
const Field=({label,value,onChange,type="text"})=><><label style={labelStyle}>{label}</label><input style={input} type={type} value={value} onChange={e=>onChange(e.target.value)}/></>;
const FormCard=({title,subtitle,children})=><section style={{...glass,maxWidth:650}}><h2 style={{marginTop:0}}>{title}</h2><p style={{opacity:.7}}>{subtitle}</p><div style={{display:"grid",gap:10}}>{children}</div></section>;
const Badge=({text})=><span style={badge(text)}>{text}</span>;
const Stat=({title,value})=><div style={stat}><small>{title}</small><strong>{value}</strong></div>;
const page={minHeight:"100vh",background:"linear-gradient(rgba(5,5,8,.48),rgba(5,5,8,.62)),url('/01.JPG') center/cover fixed",color:"#fff",fontFamily:"Segoe UI,sans-serif",display:"flex"};
const side={width:230,background:"rgba(8,8,12,.58)",backdropFilter:"blur(16px)",borderRight:"1px solid rgba(255,255,255,.08)",padding:22,display:"flex",flexDirection:"column",gap:8,boxSizing:"border-box"};
const brand={fontSize:23,fontWeight:900,letterSpacing:2,color:"#fff",marginBottom:2};
const adminTag={fontSize:10,letterSpacing:2,color:"#d4af37",marginBottom:18};
const nav=a=>({textAlign:"left",border:0,borderRadius:10,padding:"11px 12px",cursor:"pointer",color:"#fff",background:a?"rgba(212,175,55,.18)":"transparent",borderLeft:a?"2px solid #d4af37":"2px solid transparent"});
const logoutStyle={marginTop:"auto",background:"rgba(255,0,76,.12)",border:"1px solid rgba(255,0,76,.35)",color:"#fff",padding:10,borderRadius:10,cursor:"pointer"};
const main={flex:1,padding:"28px 34px",overflow:"auto"};
const header={display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22};
const eyebrow={fontSize:10,letterSpacing:2,color:"#d4af37"};
const status={fontSize:12,color:"#62ff9b"};
const glass={background:"rgba(8,8,12,.48)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.09)",borderRadius:16,padding:22,boxShadow:"0 18px 50px rgba(0,0,0,.2)"};
const grid={display:"grid",gridTemplateColumns:"repeat(4,minmax(150px,1fr))",gap:14,marginBottom:22};
const stat={...glass,padding:18,display:"flex",flexDirection:"column",gap:7};
const sectionHead={display:"flex",justifyContent:"space-between",alignItems:"center",gap:15,margin:"0 0 14px"};
const greenBtn={background:"#39ff88",color:"#06100a",border:0,borderRadius:9,padding:"10px 14px",fontWeight:800,cursor:"pointer"};
const button={background:"rgba(255,255,255,.08)",color:"#fff",border:"1px solid rgba(255,255,255,.15)",borderRadius:9,padding:"10px 14px",cursor:"pointer"};
const notice={marginBottom:15,padding:12,borderRadius:10,background:"rgba(57,255,136,.1)",border:"1px solid rgba(57,255,136,.25)",color:"#9dffbf"};
const table={width:"100%",borderCollapse:"collapse",fontSize:13};
const input={width:"100%",boxSizing:"border-box",padding:12,borderRadius:9,border:"1px solid rgba(255,255,255,.13)",background:"rgba(0,0,0,.35)",color:"#fff"};
const label={display:"block",marginBottom:6,fontSize:12,opacity:.8};
const labelStyle={display:"block",fontSize:12,marginTop:4,opacity:.8};
const miniInfo={padding:12,borderRadius:9,background:"rgba(255,255,255,.05)",fontSize:12,margin:"5px 0"};
const smallBtn={marginRight:5,background:"rgba(255,255,255,.08)",color:"#fff",border:"1px solid rgba(255,255,255,.12)",borderRadius:7,padding:"6px 8px",cursor:"pointer",fontSize:11};
const dangerBtn={...smallBtn,color:"#ff718f",borderColor:"rgba(255,0,76,.3)"};
const badge=t=>({display:"inline-block",padding:"4px 8px",borderRadius:99,fontSize:10,textTransform:"uppercase",background:t==="active"?"rgba(57,255,136,.12)":t==="paused"?"rgba(255,193,7,.12)":"rgba(255,0,76,.12)",color:t==="active"?"#65ff9d":t==="paused"?"#ffd45a":"#ff7893"});

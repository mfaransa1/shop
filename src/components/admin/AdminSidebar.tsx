"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const groups = [
 { label:"WORKSPACE", links:[ ["Overview","/admin","⌂"], ["Membership applications","/admin/memberships","♙"], ["Tournament applications","/admin/tournaments","♜"] ] },
 { label:"CONTENT", links:[ ["Events & tournaments","/admin/events","♟"], ["Merch shop","/admin/merch","▣"], ["Announcements","/admin/cms/announcements","◉"] ] },
 { label:"OPERATIONS", links:[ ["Sales & orders","/admin/commerce","▤"], ["Event registrations","/admin/commerce/registrations","♙"], ["Inventory","/admin/commerce/inventory","▦"], ["Delivery settings","/admin/commerce/settings","⚙"] ] },
] as const;
export function AdminSidebar(){
 const pathname=usePathname(); const [mobileOpen,setMobileOpen]=useState(false);
 if(pathname==="/admin/login" || pathname.startsWith("/admin/login/")) return null;
 return <aside className="shop-admin-sidebar md:sticky md:top-0 md:flex md:h-screen md:w-[260px] md:shrink-0 md:flex-col">
  <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
   <Link href="/admin" className="flex items-center gap-3 no-underline"><span className="flex h-10 w-10 items-center justify-center bg-[#d8a84e] text-xl font-black text-[#20231f]">S</span><span><strong className="block text-sm tracking-[.18em] text-white">SHoP</strong><span className="mt-1 block text-[10px] uppercase tracking-[.18em] text-white/55">Admin workspace</span></span></Link>
   <button type="button" className="shop-admin-mobile-toggle rounded border border-white/20 px-3 py-2 text-sm md:hidden" aria-expanded={mobileOpen} onClick={()=>setMobileOpen(v=>!v)}>{mobileOpen?"Close":"Menu"}</button>
  </div>
  <nav className={`${mobileOpen?"block":"hidden"} shop-admin-nav flex-1 overflow-y-auto px-3 py-4 md:block`}>{groups.map(group=><section key={group.label} className="mb-5"><p className="px-3 pb-2 text-[10px] font-bold tracking-[.2em] text-white/40">{group.label}</p>{group.links.map(([label,href,icon])=>{const active=pathname===href || (href!=="/admin" && pathname.startsWith(href+"/"));return <Link key={href} href={href} aria-current={active?"page":undefined} onClick={()=>setMobileOpen(false)} className={`shop-admin-navlink mb-1 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium no-underline ${active?"is-active":""}`}><span className="w-5 text-center" aria-hidden="true">{icon}</span><span>{label}</span></Link>})}</section>)}</nav>
  <div className="border-t border-white/10 p-4"><Link href="/" className="shop-admin-back block rounded-sm px-3 py-3 text-sm no-underline">View public website</Link><p className="px-3 pt-2 text-[11px] text-white/40">Kila hatua ina maana.</p></div>
 </aside>
}

import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { darajaAccessToken, darajaTimestamp, darajaUrl, normalizeKenyanPhone, requiredEnv } from "@/lib/daraja";
import { shopDb } from "@/lib/shop-commerce-store";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
type Item = { productId?: unknown; quantity?: unknown };
const clean = (v: unknown, max=200) => typeof v === "string" ? v.trim().slice(0,max) : "";
export async function POST(req: Request) {
 let orderId = "";
 try {
  const b = await req.json() as { items?: Item[]; customerName?:unknown; phone?:unknown; email?:unknown; deliveryCounty?:unknown; deliveryArea?:unknown; deliveryAddress?:unknown; deliveryNotes?:unknown; mpesaPhone?:unknown };
  if (!Array.isArray(b.items) || !b.items.length || b.items.length > 30) return NextResponse.json({error:"Your basket is empty or too large."},{status:400});
  const customerName=clean(b.customerName,100), phone=normalizeKenyanPhone(clean(b.phone,40)), mpesaPhone=normalizeKenyanPhone(clean(b.mpesaPhone || b.phone,40));
  const email=clean(b.email,254); const deliveryCounty=clean(b.deliveryCounty,80), deliveryArea=clean(b.deliveryArea,100), deliveryAddress=clean(b.deliveryAddress,300), deliveryNotes=clean(b.deliveryNotes,500);
  if (!customerName || !deliveryCounty || !deliveryArea || !deliveryAddress) return NextResponse.json({error:"Enter your name and complete delivery location."},{status:400});
  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({error:"Enter a valid email address."},{status:400});
  const quantities = new Map<string,number>(); for(const item of b.items){ if(typeof item.productId!=="string" || !/^[0-9a-f-]{36}$/i.test(item.productId) || !Number.isInteger(item.quantity) || Number(item.quantity)<1 || Number(item.quantity)>20) return NextResponse.json({error:"A basket item is invalid."},{status:400}); quantities.set(item.productId,(quantities.get(item.productId)||0)+Number(item.quantity)); }
  const ids=[...quantities.keys()];
  const productsRes=await shopDb(`shop_merch_products?select=id,name,price_kes,status,availability,track_inventory,stock_quantity&id=in.(${ids.join(",")})`);
  const products=Array.isArray(productsRes.data)?productsRes.data as Array<{id:string;name:string;price_kes:number|null;status:string;availability:string;track_inventory?:boolean;stock_quantity?:number|null}>:[];
  if(products.length!==ids.length || products.some(p=>p.status!=="published" || !Number.isFinite(Number(p.price_kes)) || Number(p.price_kes)<=0 || /out of stock|unavailable|coming soon/i.test(p.availability||"") || (p.track_inventory && Number(p.stock_quantity ?? 0) < (quantities.get(p.id) ?? 0)))) return NextResponse.json({error:"One or more products are unavailable for online checkout."},{status:409});
  if(products.some(p=>!Number.isInteger(Number(p.price_kes)))) return NextResponse.json({error:"Online checkout requires whole-shilling prices. Please contact SHoP for this item."},{status:409});
  const lines=products.map(p=>({product_id:p.id,product_name:p.name,unit_price_kes:Number(p.price_kes),quantity:quantities.get(p.id)!,line_total_kes:Number(p.price_kes)*quantities.get(p.id)!}));
  const subtotal=lines.reduce((s,l)=>s+l.line_total_kes,0); if(subtotal>150000) return NextResponse.json({error:"Order total exceeds the current online checkout limit. Contact SHoP for assistance."},{status:400});
  let deliveryFee = 0;
  try {
    const settings = await shopDb("shop_commerce_settings?setting_key=eq.delivery_pricing&select=setting_value&limit=1");
    const rows = Array.isArray(settings.data) ? settings.data as Array<{setting_value?: {default_fee_kes?: number; county_fees?: Record<string, number>}}> : [];
    const pricing = rows[0]?.setting_value;
    const countyFee = pricing?.county_fees?.[deliveryCounty];
    deliveryFee = Number.isInteger(countyFee) && Number(countyFee) >= 0 ? Number(countyFee) : Number.isInteger(pricing?.default_fee_kes) && Number(pricing?.default_fee_kes) >= 0 ? Number(pricing?.default_fee_kes) : 0;
  } catch { deliveryFee = 0; }
  orderId=randomUUID(); const orderNumber=`SHOP-${new Date().toISOString().slice(2,10).replace(/-/g,"")}-${orderId.slice(0,6).toUpperCase()}`;
  await shopDb("shop_orders",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({id:orderId,order_number:orderNumber,customer_name:customerName,phone,email:email||null,delivery_county:deliveryCounty,delivery_area:deliveryArea,delivery_address:deliveryAddress,delivery_notes:deliveryNotes||null,subtotal_kes:subtotal,delivery_fee_kes:deliveryFee,total_kes:subtotal+deliveryFee,mpesa_phone:mpesaPhone,payment_status:"pending",order_status:"awaiting_payment"})});
  await shopDb("shop_order_items",{method:"POST",body:JSON.stringify(lines.map(l=>({...l,order_id:orderId})))});
  const shortcode=requiredEnv("DARAJA_SHORTCODE"), passkey=requiredEnv("DARAJA_PASSKEY"), callbackUrl=requiredEnv("SHOP_ORDER_DARAJA_CALLBACK_URL"); const callback=new URL(callbackUrl); if(callback.protocol!=="https:"||/localhost|127\.0\.0\.1/.test(callback.hostname)) throw new Error("SHOP_ORDER_DARAJA_CALLBACK_URL must be public HTTPS.");
  const token=await darajaAccessToken(), timestamp=darajaTimestamp(), password=Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
  const response=await fetch(darajaUrl("/mpesa/stkpush/v1/processrequest"),{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},cache:"no-store",body:JSON.stringify({BusinessShortCode:shortcode,Password:password,Timestamp:timestamp,TransactionType:process.env.DARAJA_TRANSACTION_TYPE==="CustomerBuyGoodsOnline"?"CustomerBuyGoodsOnline":"CustomerPayBillOnline",Amount:Math.ceil(subtotal+deliveryFee),PartyA:mpesaPhone,PartyB:process.env.DARAJA_PARTY_B?.trim()||shortcode,PhoneNumber:mpesaPhone,CallBackURL:callbackUrl,AccountReference:orderNumber,TransactionDesc:`SHoP merch order ${orderNumber}`})});
  const d=await response.json().catch(()=>null) as Record<string,unknown>|null;
  if(!response.ok||!d||d.ResponseCode!=="0"||typeof d.CheckoutRequestID!=="string"){await shopDb(`shop_orders?id=eq.${orderId}`,{method:"PATCH",body:JSON.stringify({payment_status:"failed",order_status:"cancelled",payment_result:typeof d?.errorMessage==="string"?d.errorMessage.slice(0,400):"STK request rejected"})});return NextResponse.json({error:"M-Pesa could not start payment. Please try again."},{status:502});}
  await shopDb(`shop_orders?id=eq.${orderId}`,{method:"PATCH",body:JSON.stringify({merchant_request_id:d.MerchantRequestID??null,checkout_request_id:d.CheckoutRequestID,payment_result:typeof d.CustomerMessage==="string"?d.CustomerMessage.slice(0,400):null})});
  return NextResponse.json({orderId,orderNumber,message:typeof d.CustomerMessage==="string"?d.CustomerMessage:"Check your phone and enter your M-Pesa PIN."},{status:202});
 } catch(e) { return NextResponse.json({error:e instanceof Error&&e.message.startsWith("Missing server environment variable:")?"Online checkout is not configured yet. Please contact SHoP.":e instanceof Error?e.message:"Could not start checkout."},{status:503}); }
}

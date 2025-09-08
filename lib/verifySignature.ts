import { NextRequest } from "next/server";


export function verifySecret(req:NextRequest):boolean{
  
    const names = [
    "x-webhook-secret",
    ];

    const keys : string[] = [];
    req.headers.forEach((_v, k) => keys.push(k));
    console.log("[auth] header keys:", keys.join(", "));

    let got = 
        names.map((n)=>req.headers.get(n)).find((v)=> !!v && v.trim().length)||
        new URL(req.url).searchParams.get("secret") || null

    const expect = (process.env.MARKETS_WEBHOOK_SECRET || '').trim();
    const ok = !!expect && !!got && got.trim() ===expect
    return ok;



}
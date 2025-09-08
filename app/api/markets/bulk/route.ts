import prisma from "@/lib/prisma";
import { verifySecret } from "@/lib/verifySignature";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


type CryptoInput = {
  symbol: string;
  price: number | string;
  fetchedAt: string;
  source?: string;
};

type BulkBody = { cryptos?: CryptoInput[] };

function toValidDate(iso: string): Date | null {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function toDecimal(n: number | string): Prisma.Decimal | null {
  const num = typeof n === "string" ? Number(n) : n;
  return typeof num === "number" && !Number.isNaN(num)
    ? new Prisma.Decimal(num)
    : null;
}

export async function POST(req:NextRequest) {
    console.log("➡️ Request:", req.method, req.nextUrl.pathname);

    if(!verifySecret(req)){
        console.log("❌ Unauthorized");
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    }

    console.log("✅ Auth OK");

    let body: BulkBody | null = null;
    try {
        body = (await req.json()) as BulkBody
    } catch (error) {
        console.log("❌ Body parse error");
        return NextResponse.json({ message: "Invalid body" }, { status: 400 });
    }

    if(!body || !Array.isArray(body.cryptos)){
        console.log("❕ No data in body");
        return NextResponse.json({ message: "No data" }, { status: 400 });

    }

    console.log("Input count:", body.cryptos.length);

    let InvalidCount = 0;
    const valid = body.cryptos
        .map((c)=>{
            const fetchedAt = toValidDate(c.fetchedAt);
            const price = toDecimal(c.price);
            if(!c.symbol || !fetchedAt || !price){
                invalidCount++;
                return null;
            }
            return{
                symbol: c.symbol.trim().toUpperCase(),
                price,
                fetchedAt,
                source:(c.source ?? "coingecko").toLowerCase(),
            };
        }).filter(Boolean) as {
             symbol: string;
                price: Prisma.Decimal;
                fetchedAt: Date;
                source: string;
        }[];

        console.log("Valid:", valid.length, "Invalid:", InvalidCount);

        if (!valid.length) {
            console.log("❕ Nothing valid to insert");
            return NextResponse.json({ message: "Nothing valid to insert" }, { status: 400 });
        }

        try {
            const res = await prisma.cryptoTick.createMany({
                data:valid,
                skipDuplicates:true
            })
            console.log("✅ Insert done:", res.count);

                return NextResponse.json({
                    ok: true,
                    received: body.cryptos.length,
                    valid: valid.length,
                    skippedInvalid: InvalidCount,
                    cryptoInserted: res.count,
                });

            
        } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              console.log("❌ DB error:", msg);
              return NextResponse.json({ message: msg }, { status: 500 });


        }





    
}



import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// BTC -  BTCUSDT
// BTCUSDT 

function toDbSymbol(sym: string) {
  return sym.toUpperCase().endsWith("USDT")
    ? sym.toUpperCase()
    : sym.toUpperCase() + "USDT";
}

export async function GET(req: NextRequest) {

    try {

        const url = new URL(req.url);
        const raw = url.searchParams.get("symbols") || '["BTC","ETH","SOL"]';
        
        let uiSymbols: string[] = [];
        try {
            uiSymbols = JSON.parse(raw);
        } catch {
            uiSymbols = ["BTC", "ETH", "SOL"];
        }
        
        const pairs = uiSymbols.map((ui) => ({ ui, db: toDbSymbol(ui) }));

        //en son fiyat

        const cryptos = await Promise.all(
            pairs.map(async({ui, db})=>{
                const row = await prisma.cryptoTick.findFirst({
                    where:{symbol:db},
                    orderBy:{fetchedAt:"desc"}
                });
                return row 
                    ? {symbol: ui, price: Number(row.price), fetchedAt:row.fetchedAt }
                    : {symbol: ui, price: null, fetchedAt:null }
            })
        )


        // 24 saateki fiyat değişim

        const lookback = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const changes = await Promise.all(
            pairs.map(async({ui, db})=>{
                const last = await prisma.cryptoTick.findFirst({
                    where:{symbol:db},
                    orderBy:{fetchedAt:"desc"}
                });

                const prev = await prisma.cryptoTick.findFirst({
                    where:{symbol:db, fetchedAt: {lte:lookback}},
                    orderBy:{fetchedAt:"desc"}
                });

                if(!last || !prev) return {symbol : ui, change24hPct: null}

                const pct = 
                    ((Number(last.price)- Number(prev.price)) / Number(prev.price)) * 100

                return {symbol:ui, change24hPct: Number(pct.toFixed(2))};
                
            })
        )
        
        
        //grafik

        const series: Record<string, {t:string; v:number}[]>={};
        for(const {ui, db} of pairs){
             const rows = await prisma.cryptoTick.findMany({
                    where:{symbol:db},
                    orderBy:{fetchedAt:"desc"},
                    take: 200
             });

             series[ui] = rows.reverse().map((r)=>({t: r.fetchedAt.toISOString(), v: Number(r.price)}));

        }

        return NextResponse.json({ cryptos, changes, series });


        
    } catch (e) {
         console.log("❌ summary error:", e);
          return NextResponse.json(
            { cryptos: [], changes: [], series: {} },
            { status: 200 }
            );
    }


}
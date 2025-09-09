"use client"
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import RechartClient from "@/components/rechart-client";

const Chart = dynamic(() => import("@/components/rechart-client"), { ssr: false });

type Point = { t: string; v: number };
type Latest = { symbol: string; price: number | null; fetchedAt: string | null };
type Change = { symbol: string; change24hPct: number | null };
type Summary = { cryptos: Latest[]; changes: Change[]; series: Record<string, Point[]> };

export default function Home() {

  const [data, setData] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      setErr(null);
      const r = await fetch("/api/markets/summary", { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setData(await r.json());

    } catch (e: unknown) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);


  if (err) return <div className="p-6 text-red-600">Hata: {err}</div>;
  if (!data) return <div className="p-6">Yükleniyor…</div>;

  const firstSym = data.cryptos[0]?.symbol ?? "BTC";
  const firstSeries = data.series[firstSym] ?? [];
  const changeOf = (s: string) => data.changes.find(x => x.symbol === s)?.change24hPct ?? null;





  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Kripto Canlı Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.cryptos.map((c) => {
          const ch = changeOf(c.symbol); const pos = (ch ?? 0) >= 0;
          return (
            <div key={c.symbol} className="border rounded-lg p-4">
              <div className="text-sm text-gray-500">{c.symbol}</div>
              <div className="text-2xl font-bold">{c.price ?? "-"}</div>
              <div className={`text-xs ${pos ? "text-green-600" : "text-red-600"}`}>24s: {ch ?? "-"}%</div>
              <div className="text-xs text-gray-500">
                {c.fetchedAt ? new Date(c.fetchedAt).toLocaleString() : "-"}
              </div>

            </div>
          )
        })}

      </div>
      <div className="border rounded-lg p-4">
           <div className="text-sm mb-2">{firstSym} (son ~200)</div>
           <div  className="h-72 w-full">
            {firstSeries.length> 0 ? (
              <RechartClient data={firstSeries}/>
            ):(
              <div>Veri Bulunmadı</div>
            )}

           </div>


      </div>
    </div>
  );
}

import React from 'react';
import type { MineData } from '../types';

interface WorstLabor {
  labor: string;
  eficiencia: number;
}

interface ExplosiveCons {
  blocks: string[];
  dia: number[];
  noche: number[];
}

interface ChartsProps {
  sortedData: MineData[];
  data: MineData[];
  worstLaborsData: WorstLabor[];
  explosiveConsByTurn: ExplosiveCons;
}

export default function Charts({ sortedData, data, worstLaborsData, explosiveConsByTurn }: ChartsProps) {
  const getRockData = () => {
    const rockData: Record<string, { sum: number, count: number }> = {};
    data.forEach(d => {
      if (!rockData[d.tipoRoca]) rockData[d.tipoRoca] = { sum: 0, count: 0 };
      rockData[d.tipoRoca].sum += d.factorCarga;
      rockData[d.tipoRoca].count++;
    });
    return rockData;
  };

  const rockData = getRockData();

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* G1: Rendimiento Diario */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-bold text-white mb-3">Progreso de Avance (Últimos 10 Ciclos)</h3>
        <div className="h-44 flex items-end justify-between gap-1 border-b border-slate-800 pb-1 relative">
          {sortedData.slice(0, 10).map((d, i) => {
            const rPct = Math.min((d.real / 6) * 100, 100);
            const pPct = Math.min((d.avance / 6) * 100, 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div className="w-full flex items-end justify-center gap-0.5 h-32">
                  <div className="w-2 bg-slate-800 rounded-t-sm" style={{ height: `${pPct}%` }}></div>
                  <div className={`w-2 rounded-t-sm ${d.eficiencia >= 90 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ height: `${rPct}%` }}></div>
                </div>
                <span className="text-4xs text-slate-500 mt-1 truncate max-w-8">{d.fecha.substring(5)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* G2: Factor de Carga por Roca */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-bold text-white mb-3">Factor de Carga Promedio (kg/m) por Tipo de Roca RMR</h3>
        <div className="space-y-2.5">
          {Object.keys(rockData).sort().map(r => {
            const avg = rockData[r].sum / rockData[r].count;
            return (
              <div key={r} className="space-y-1">
                <div className="flex justify-between text-3xs font-semibold"><span className="text-slate-300">Roca RMR - {r}</span><span className="text-white font-bold">{avg.toFixed(1)} kg/m</span></div>
                <div className="w-full bg-slate-950 h-2 rounded border border-slate-850 overflow-hidden"><div className={`h-full rounded ${avg > 26 && (r.includes('IV') || r.includes('V')) ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${(avg / 45) * 100}%` }}></div></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* G3: Top Labores con Peor Eficiencia */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-bold text-white mb-3">Top 5 Labores Críticas con Menor Eficiencia Acumulada</h3>
        <div className="space-y-3">
          {worstLaborsData.map((l, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-3xs"><span className="text-slate-300 font-mono">#{i + 1} {l.labor}</span><span className="text-rose-400 font-bold">{l.eficiencia.toFixed(0)}%</span></div>
              <div className="w-full bg-slate-950 h-2 rounded border border-slate-850 overflow-hidden"><div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded" style={{ width: `${l.eficiencia}%` }}></div></div>
            </div>
          ))}
        </div>
      </div>

      {/* G4: Explosivo por Turno y Block */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-xs font-bold text-white mb-3">Distribución de Explosivos (kg) por Turno y Block (Top 5)</h3>
        <div className="space-y-2.5">
          {explosiveConsByTurn.blocks.map((b, idx) => {
            const dKilos = explosiveConsByTurn.dia[idx] || 0;
            const nKilos = explosiveConsByTurn.noche[idx] || 0;
            return (
              <div key={b} className="text-3xs space-y-1">
                <span className="text-slate-300 font-medium block">{b}</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">D:</span>
                    <div className="flex-1 bg-slate-950 h-2 rounded border border-slate-850 overflow-hidden"><div className="h-full bg-amber-400" style={{ width: `${Math.min((dKilos / 400) * 100, 100)}%` }}></div></div>
                    <span className="text-slate-400 font-bold w-12 text-right">{dKilos.toFixed(0)}kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">N:</span>
                    <div className="flex-1 bg-slate-950 h-2 rounded border border-slate-850 overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${Math.min((nKilos / 400) * 100, 100)}%` }}></div></div>
                    <span className="text-slate-400 font-bold w-12 text-right">{nKilos.toFixed(0)}kg</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

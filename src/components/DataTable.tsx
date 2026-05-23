import { Calendar } from 'lucide-react';
import type { MineData } from '../types';

interface DataTableProps {
  sortedData: MineData[];
}

export default function DataTable({ sortedData }: DataTableProps) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/40 text-xs font-bold text-white">Consolidado Métrico de Guardias de Mina Justa</div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-3xs border-b border-slate-800">
            <tr>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Block</th>
              <th className="px-5 py-3">Labor</th>
              <th className="px-5 py-3">Referencia</th>
              <th className="px-5 py-3 text-center">RMR</th>
              <th className="px-5 py-3 text-right">Prog. (m)</th>
              <th className="px-5 py-3 text-right">Real (m)</th>
              <th className="px-5 py-3 text-center">Eficiencia</th>
              <th className="px-5 py-3 text-right">Factor Carga</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {sortedData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-850/40 transition-colors">
                <td className="px-5 py-3 flex items-center gap-1.5 text-slate-400"><Calendar className="w-3.5 h-3.5" />{row.fecha}</td>
                <td className="px-5 py-3 text-slate-300 font-medium">{row.block}</td>
                <td className="px-5 py-3 text-white font-mono font-bold">{row.labor}</td>
                <td className="px-5 py-3 text-slate-400 truncate max-w-xs">{row.referencia}</td>
                <td className="px-5 py-3 text-center"><span className={`px-2 py-0.5 rounded text-3xs font-bold ${row.tipoRoca.includes('IV') || row.tipoRoca.includes('V') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400'}`}>{row.tipoRoca}</span></td>
                <td className="px-5 py-3 text-right font-mono text-slate-400">{row.avance.toFixed(2)}</td>
                <td className="px-5 py-3 text-right font-mono text-white font-bold">{row.real.toFixed(2)}</td>
                <td className="px-5 py-3 text-center"><span className={`px-2 py-0.5 rounded text-3xs font-bold ${row.eficiencia >= 90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{row.eficiencia.toFixed(0)}%</span></td>
                <td className="px-5 py-3 text-right font-mono text-slate-300">{row.factorCarga.toFixed(2)} <span className="text-4xs text-slate-500">kg/m</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

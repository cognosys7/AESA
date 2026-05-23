import type { Stats } from '../types';

interface MetricsProps {
  stats: Stats;
  alertsCount: number;
}

export default function Metrics({ stats, alertsCount }: MetricsProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-3xs text-slate-400 font-medium uppercase">Avance Real</p>
        <div className="text-2xl font-bold text-white mt-1">{stats.totalReal} <span className="text-xs text-slate-400">m</span></div>
        <p className="text-4xs text-slate-500 mt-1">Perforado: {stats.totalAvance}m</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-3xs text-slate-400 font-medium uppercase">Eficiencia Promedio</p>
        <div className="text-2xl font-bold text-amber-400 mt-1">{stats.efficiency}%</div>
        <p className="text-4xs text-slate-500 mt-1">Meta: &gt;90% de rendimiento</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-3xs text-slate-400 font-medium uppercase">Factor de Carga</p>
        <div className="text-2xl font-bold text-yellow-500 mt-1">{stats.avgFactor} <span className="text-xs text-slate-400">kg/m</span></div>
        <p className="text-4xs text-slate-500 mt-1">Consumo específico lineal</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-3xs text-slate-400 font-medium uppercase">Explosivo Disparado</p>
        <div className="text-2xl font-bold text-blue-400 mt-1">{stats.totalExplosivo} <span className="text-xs text-slate-400">kg</span></div>
        <p className="text-4xs text-slate-500 mt-1">{stats.totalDisparos} voladuras auditadas</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 border-l-4 border-l-rose-500">
        <p className="text-3xs text-rose-400 font-medium uppercase">Desviaciones Críticas</p>
        <div className="text-2xl font-bold text-rose-500 mt-1">{alertsCount} <span className="text-xs text-slate-400">alertas</span></div>
        <p className="text-4xs text-slate-500 mt-1">Riesgo de Overbreak / Caídas</p>
      </div>
    </section>
  );
}

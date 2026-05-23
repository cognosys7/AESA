import type { Alert } from '../types';

interface AlertsProps {
  alerts: Alert[];
  triggerAlertPlan: (alert: Alert) => void;
}

export default function Alerts({ alerts, triggerAlertPlan }: AlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-rose-950/10 border border-rose-900/30 rounded-xl p-4 space-y-3">
      <h3 className="text-xs font-bold text-rose-400 flex items-center gap-1">⚠️ Desviaciones Críticas de Voladura en Macizo Rocoso</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
        {alerts.map((a, i) => (
          <div key={i} className="bg-slate-900/90 border border-slate-800 p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs text-slate-300"><span className="text-rose-400 font-bold">[{a.tipo}]</span> {a.mensaje}</p>
            <button onClick={() => triggerAlertPlan(a)} className="text-4xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-2 py-1 rounded font-bold whitespace-nowrap self-end sm:self-center">✨ Ver Plan de Mitigación</button>
          </div>
        ))}
      </div>
    </div>
  );
}

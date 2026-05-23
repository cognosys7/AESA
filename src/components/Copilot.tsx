import React from 'react';
import { Bot, Loader2 } from 'lucide-react';

interface CopilotProps {
  isCopilotLoading: boolean;
  copilotError: string;
  copilotResponse: string;
  triggerEnergyOptimization: () => void;
  triggerBottleneckAnalysis: () => void;
}

export default function Copilot({
  isCopilotLoading,
  copilotError,
  copilotResponse,
  triggerEnergyOptimization,
  triggerBottleneckAnalysis
}: CopilotProps) {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 rounded-2xl p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Bot className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">✨ Mina Justa Copilot</h3>
        </div>
        <p className="text-2xs text-slate-400 leading-relaxed">Asistente de inteligencia artificial conectado a las mallas de perforación de Mina Justa.</p>
        <div className="flex flex-col gap-2 pt-2">
          <button onClick={triggerEnergyOptimization} className="text-left text-3xs font-semibold bg-slate-950 hover:bg-slate-900 border border-slate-800 px-3 py-2 rounded text-amber-300 flex items-center justify-between"><span>🛠️ Optimizar Energía (Explosivo)</span> <span>👉</span></button>
          <button onClick={triggerBottleneckAnalysis} className="text-left text-3xs font-semibold bg-slate-950 hover:bg-slate-900 border border-slate-800 px-3 py-2 rounded text-amber-300 flex items-center justify-between"><span>📉 Diagnóstico de frentes lentos</span> <span>👉</span></button>
        </div>
      </div>
      <div className="lg:col-span-2 flex flex-col bg-slate-950 border border-slate-850 rounded-xl min-h-48 overflow-hidden">
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-850 text-3xs font-bold text-slate-400 uppercase">Respuesta de Ingeniería de Voladura</div>
        <div className="flex-1 p-4 overflow-y-auto max-h-56 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed custom-scrollbar">
          {isCopilotLoading ? <div className="h-full flex items-center justify-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin text-amber-400" /> Generando pautas geomecánicas...</div> : copilotError ? <span className="text-rose-400 font-medium">{copilotError}</span> : copilotResponse || "Seleccione una optimización rápida arriba."}
        </div>
      </div>
    </section>
  );
}

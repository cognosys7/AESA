import { SlidersHorizontal } from 'lucide-react';

interface FiltersProps {
  fechaInicio: string;
  setFechaInicio: (val: string) => void;
  fechaFin: string;
  setFechaFin: (val: string) => void;
  filterLabor: string;
  setFilterLabor: (val: string) => void;
  opcionesLabor: string[];
  filterBlock: string;
  setFilterBlock: (val: string) => void;
  opcionesBlock: string[];
  filterRoca: string;
  setFilterRoca: (val: string) => void;
  opcionesRoca: string[];
  filterEtapa: string;
  setFilterEtapa: (val: string) => void;
  opcionesEtapa: string[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export default function Filters({
  fechaInicio, setFechaInicio,
  fechaFin, setFechaFin,
  filterLabor, setFilterLabor, opcionesLabor,
  filterBlock, setFilterBlock, opcionesBlock,
  filterRoca, setFilterRoca, opcionesRoca,
  filterEtapa, setFilterEtapa, opcionesEtapa,
  searchTerm, setSearchTerm
}: FiltersProps) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider"><SlidersHorizontal className="w-4 h-4" /> Filtros Operacionales Avanzados</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="text-3xs text-slate-400 font-semibold uppercase">Rango de Fecha (Inicio)</label>
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-3xs text-slate-400 font-semibold uppercase">Rango de Fecha (Fin)</label>
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-3xs text-slate-400 font-semibold uppercase">Labor / Frente</label>
          <select value={filterLabor} onChange={(e) => setFilterLabor(e.target.value)} className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500">
            {opcionesLabor.map(o => <option key={o} value={o}>{o === 'Todas' ? 'Todas las Labores' : o}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-3xs text-slate-400 font-semibold uppercase">Block / Zona</label>
          <select value={filterBlock} onChange={(e) => setFilterBlock(e.target.value)} className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500">
            {opcionesBlock.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/60 text-xs">
        <div className="flex flex-col gap-1">
          <label className="text-3xs text-slate-500 uppercase font-semibold">Tipo Roca Real</label>
          <select value={filterRoca} onChange={(e) => setFilterRoca(e.target.value)} className="bg-slate-950 border border-slate-850 text-slate-300 px-3 py-1 rounded">
            {opcionesRoca.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-3xs text-slate-500 uppercase font-semibold">Etapa</label>
          <select value={filterEtapa} onChange={(e) => setFilterEtapa(e.target.value)} className="bg-slate-950 border border-slate-855 text-slate-300 px-3 py-1 rounded">
            {opcionesEtapa.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-3xs text-slate-500 uppercase font-semibold">Buscador General</label>
          <input type="text" placeholder="Filtrar por coincidencia..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-950 border border-slate-855 text-slate-300 px-3 py-1 rounded text-xs focus:outline-none" />
        </div>
      </div>
    </section>
  );
}

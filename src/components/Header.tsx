import React, { useRef } from 'react';
import { Compass, Upload, RefreshCw, Download } from 'lucide-react';

interface HeaderProps {
  dataIsInitial: boolean;
  autoLoadStatus: string;
  dataLength: number;
  handleCSVUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetToInitialData: () => void;
  exportToCSV: () => void;
}

export default function Header({
  dataIsInitial,
  handleCSVUpload,
  resetToInitialData,
  exportToCSV
}: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCSVUpload(e);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-30 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-slate-950 shadow-md">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">MineOps BI — Mina Justa</h1>
          <p className="text-xs text-slate-400">Panel de Auditoría de Perforación, Geotecnia y Avances</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="manual-upload" className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-lg cursor-pointer transition-all shadow-md active:scale-95">
          <Upload className="w-4 h-4" /> Importar AVANCES_MINA JUSTA.csv
        </label>
        <input type="file" id="manual-upload" ref={fileInputRef} accept=".csv" onChange={onUploadClick} className="hidden" />
        {!dataIsInitial && <button onClick={resetToInitialData} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-2.5 rounded-lg hover:bg-slate-700 transition-all"><RefreshCw className="w-3.5 h-3.5" /></button>}
        <button onClick={exportToCSV} className="bg-slate-900 border border-slate-800 text-slate-200 text-xs px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-all"><Download className="w-4 h-4" /></button>
      </div>
    </header>
  );
}

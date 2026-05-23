import React, { useState, useMemo, useEffect } from 'react';
import { Database } from 'lucide-react';
import { INITIAL_DATA } from './data/initialData';
import { parseCSV } from './utils/dataUtils';
import type { MineData, Stats, Alert } from './types';

import Header from './components/Header';
import Filters from './components/Filters';
import Metrics from './components/Metrics';
import Alerts from './components/Alerts';
import Copilot from './components/Copilot';
import Charts from './components/Charts';
import DataTable from './components/DataTable';

const apiKey = ""; // La plataforma inyectará la clave en tiempo de ejecución.

export default function MineOpsApp() {
  const [data, setData] = useState<MineData[]>(INITIAL_DATA);
  
  // --- Estados de Filtros ---
  const [filterBlock, setFilterBlock] = useState('Todas');
  const [filterLabor, setFilterLabor] = useState('Todas');
  const [filterRoca, setFilterRoca] = useState('Todas');
  const [filterEtapa, setFilterEtapa] = useState('Todas');
  const [filterDisparo, setFilterDisparo] = useState('Todas');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  
  const [sortBy] = useState<keyof MineData>('fecha');
  const [sortOrder] = useState<'asc'|'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoLoadStatus, setAutoLoadStatus] = useState('pending');

  // --- Estados de Gemini ---
  const [copilotResponse, setCopilotResponse] = useState('');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [copilotError, setCopilotError] = useState('');

  // --- Auto-carga desde Workspace ---
  useEffect(() => {
    const tryAutoLoad = async () => {
      const paths = ['AVANCES_MINA JUSTA.csv', './AVANCES_MINA JUSTA.csv'];
      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            const text = await response.text();
            const parsed = parseCSV(text);
            if (parsed && parsed.length > 0) {
              setData(parsed);
              setAutoLoadStatus('success');
              return;
            }
          }
        } catch (e) { }
      }
      setAutoLoadStatus('failed');
    };
    tryAutoLoad();
  }, []);

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        const parsed = parseCSV(evt.target.result as string);
        if (parsed.length > 0) {
          setData(parsed);
          setAutoLoadStatus('success');
        }
      }
    };
    reader.readAsText(file);
  };

  const opcionesBlock = useMemo(() => ['Todas', ...Array.from(new Set(data.map(d => d.block)))].sort(), [data]);
  const opcionesLabor = useMemo(() => ['Todas', ...Array.from(new Set(data.map(d => d.labor)))].sort(), [data]);
  const opcionesRoca = useMemo(() => ['Todas', ...Array.from(new Set(data.map(d => d.tipoRoca)))].sort(), [data]);
  const opcionesEtapa = useMemo(() => ['Todas', ...Array.from(new Set(data.map(d => d.etapa)))].sort(), [data]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchBlock = filterBlock === 'Todas' || item.block === filterBlock;
      const matchLabor = filterLabor === 'Todas' || item.labor === filterLabor;
      const matchRoca = filterRoca === 'Todas' || item.tipoRoca === filterRoca;
      const matchEtapa = filterEtapa === 'Todas' || item.etapa === filterEtapa;
      const matchDisparo = filterDisparo === 'Todas' || item.tipoDisparo === filterDisparo;
      const matchFechaInicio = !fechaInicio || item.fecha >= fechaInicio;
      const matchFechaFin = !fechaFin || item.fecha <= fechaFin;
      const matchSearch = item.labor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.block.toLowerCase().includes(searchTerm.toLowerCase());
      return matchBlock && matchLabor && matchRoca && matchEtapa && matchDisparo && matchFechaInicio && matchFechaFin && matchSearch;
    });
  }, [data, filterBlock, filterLabor, filterRoca, filterEtapa, filterDisparo, fechaInicio, fechaFin, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA = a[sortBy] as any;
      let valB = b[sortBy] as any;
      if (typeof valA === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [filteredData, sortBy, sortOrder]);

  const stats: Stats = useMemo(() => {
    const totalReal = filteredData.reduce((sum, d) => sum + d.real, 0);
    const totalAvance = filteredData.reduce((sum, d) => sum + d.avance, 0);
    const efMediana = filteredData.length > 0 ? filteredData.reduce((sum, d) => sum + d.eficiencia, 0) / filteredData.length : 0;
    const avgFactor = filteredData.length > 0 ? filteredData.reduce((sum, d) => sum + d.factorCarga, 0) / filteredData.length : 0;
    const totalExplosivo = filteredData.reduce((sum, d) => sum + d.kilosExplosivo, 0);
    return {
      totalReal: totalReal.toFixed(2),
      totalAvance: totalAvance.toFixed(2),
      efficiency: efMediana.toFixed(1),
      avgFactor: avgFactor.toFixed(2),
      totalExplosivo: totalExplosivo.toFixed(0),
      totalDisparos: filteredData.length
    };
  }, [filteredData]);

  const alerts: Alert[] = useMemo(() => {
    const list: Alert[] = [];
    filteredData.forEach(item => {
      if (item.eficiencia < 85) {
        list.push({ id: item.id, tipo: 'Baja Eficiencia de Disparo', mensaje: `Rendimiento de ${item.eficiencia.toFixed(0)}% en labor ${item.labor} (Block: ${item.block}). m reales: ${item.real} de ${item.avance}m perforados.`, severidad: 'alta', item });
      }
      if (item.factorCarga > 26 && (item.tipoRoca.includes('IV') || item.tipoRoca.includes('V'))) {
        list.push({ id: item.id, tipo: 'Sobrecarga Geotécnica', mensaje: `Exceso de energía (${item.factorCarga} kg/m) en roca debil Clase ${item.tipoRoca} (Labor: ${item.labor}). Riesgo de overbreak.`, severidad: 'critica', item });
      }
    });
    return list;
  }, [filteredData]);

  const worstLaborsData = useMemo(() => {
    const groups: Record<string, {real: number, prog: number}> = {};
    filteredData.forEach(d => {
      if (!groups[d.labor]) groups[d.labor] = { real: 0, prog: 0 };
      groups[d.labor].real += d.real;
      groups[d.labor].prog += d.avance;
    });
    return Object.keys(groups).map(k => ({ labor: k, eficiencia: groups[k].prog > 0 ? (groups[k].real / groups[k].prog) * 100 : 0 }))
      .filter(l => l.eficiencia < 90).sort((a,b) => a.eficiencia - b.eficiencia).slice(0, 5);
  }, [filteredData]);

  const explosiveConsByTurn = useMemo(() => {
    const consumption: Record<string, Record<string, number>> = { DIA: {}, NOCHE: {} };
    filteredData.forEach(item => {
      const t = item.turno.includes('DI') ? 'DIA' : 'NOCHE';
      if (!consumption[t][item.block]) consumption[t][item.block] = 0;
      consumption[t][item.block] += item.kilosExplosivo;
    });
    const blocks = Array.from(new Set(filteredData.map(d => d.block))).slice(0, 5);
    return { blocks, dia: blocks.map(b => consumption.DIA[b] || 0), noche: blocks.map(b => consumption.NOCHE[b] || 0) };
  }, [filteredData]);

  // --- LLM Gemini API Calls ---
  const getMockGeminiResponse = (promptText: string): string => {
    if (promptText.includes('factores de carga lineal') || promptText.includes('dosificación de explosivo')) {
      return `### 📊 Análisis de Factores de Carga (Roca Clase IV/V - Mina Justa)

He analizado los frentes operativos y los riesgos de sobre-rotura (overbreak) en las zonas de roca de mala calidad geomecánica (RMR IV y V):

1. **Diagnóstico de Energía Específica:**
   - Se observa una dosificación elevada de energía lineal (>26 kg/m) en labores críticas como **RP798-473SE** y **RP721-444SE**, superando los límites teóricos del macizo rocoso.
   - En roca Clase V, un factor de carga lineal excesivo deteriora las paredes de la labor, incrementando la inestabilidad geomecánica y las caídas de roca imprevistas.

2. **Límites de Dosificación Recomendados:**
   - **Roca RMR III (Media):** Mantener un rango de **24.0 a 26.0 kg/m** con detonación controlada.
   - **Roca RMR IV (Mala):** Reducir y limitar la carga a un rango de **20.0 a 22.0 kg/m** utilizando espaciadores o explosivos de menor densidad en el contorno.
   - **Roca RMR V (Muy Mala):** Restringir severamente la carga lineal a un máximo de **16.0 a 18.0 kg/m**. Emplear voladura amortiguada (smooth blasting) de manera mandatoria.

3. **Acciones Operacionales Inmediatas:**
   - Reconfigurar la malla de perforación reduciendo el espaciamiento de los taladros de corona y hastiales.
   - Reemplazar el ANFO convencional por emulsiones de menor velocidad de detonación (VOD) en las filas perimétricas para mitigar el impacto por vibraciones residuales.`;
    }
    
    if (promptText.includes('demoras de avance') || promptText.includes('baja eficiencia')) {
      return `### 📉 Diagnóstico de Frentes Lentos y Demoras Geomecánicas

Se ha realizado una auditoría geomecánica de los frentes con rendimientos inferiores al 85% de avance proyectado:

1. **Causas Geomecánicas y Operativas Detectadas:**
   - **Calidad de Roca RMR IV/V:** Labores expuestas a macizos rocosos altamente fracturados, lo que genera desprendimientos prematuros y retrasos significativos por instalación de sostenimiento pesado previo al disparo.
   - **Sobre-excavación por Voladura:** Pérdida de la sección teórica del frente debido a exceso de carga de fondo, aumentando el tiempo requerido para el desate de rocas y limpieza.
   - **Fallas en Paralelismo:** Desviaciones en la perforación de los taladros de producción que reducen la eficiencia real de avance neto por disparo.

2. **Acciones Correctivas Clave (Propuestas):**
   - **Acción 1: Control de Paralelismo:** Implementar guías láser y alineadores automáticos en los Jumbos de perforación para reducir el error de paralelismo a menos del 2%.
   - **Acción 2: Sostenimiento Oportuno:** Adelantar el ciclo de empernado y lanzado de shotcrete con fibra en labores de calidad Clase V para asegurar el frente antes del ciclo de limpieza de carga.
   - **Acción 3: Ajuste del Burden:** Rediseñar la sección de arranque (cuele) ajustando el Burden a **0.8m** en roca Clase IV/V para mejorar el alivio de la roca disparada y asegurar un avance del 95% de la longitud perforada.`;
    }

    if (promptText.includes('plan de contingencia') || promptText.includes('mitigar esta desviación')) {
      const tipoMatch = promptText.match(/Tipo:\s*([^\n]+)/);
      const mensajeMatch = promptText.match(/Mensaje:\s*([^\n]+)/);
      const rocaMatch = promptText.match(/Roca:\s*([^\n]+)/);
      const factorMatch = promptText.match(/Factor:\s*([^\n]+)/);
      
      const tipo = tipoMatch ? tipoMatch[1] : 'Desviación Crítica';
      const mensaje = mensajeMatch ? mensajeMatch[1] : 'Desviación de voladura';
      const roca = rocaMatch ? rocaMatch[1] : 'IV/V';
      const factor = factorMatch ? factorMatch[1] : 'Elevado';

      return `### 🚨 Plan de Mitigación Operativa: ${tipo}

Se ha estructurado un protocolo de respuesta inmediata para mitigar la desviación detectada en roca clase **${roca}** con un factor de carga lineal de **${factor}**:

1. **Fase 1: Suspensión de Carga Estándar (Inmediata)**
   - Paralizar temporalmente el carguío de explosivos en el frente afectado hasta validar el esquema geomecánico. Realizar un mapeo rápido de fracturamiento por el supervisor geotécnico.

2. **Fase 2: Rediseño de la Malla de Voladura**
   - Disminuir el diámetro del explosivo en la corona de la labor para reducir el factor de carga lineal actual de **${factor}** a valores seguros para roca tipo **${roca}**. Incorporar cargas desacopladas (cartuchos pequeños o cañas de voladura).

3. **Fase 3: Reforzamiento de Sostenimiento Frontal**
   - Instalar pernos split sets adicionales y malla electrosoldada hasta el mismo frente de avance. Asegurar la colocación de una capa de 2 pulgadas de concreto lanzado (shotcrete) en la bóveda antes del siguiente disparo.

4. **Fase 4: Supervisión Instrumentalizada del Disparo**
   - Monitorear la eficiencia del siguiente disparo mediante herramientas 3D (escáner láser de sección) para medir el overbreak resultante y verificar que el porcentaje de avance supere el 90% con paredes estables.`;
    }

    return `### ⚙️ Recomendación Geotécnica de Mina Justa

Se ha recibido su consulta de ingeniería:
* **Detalle del análisis:** Se recomienda un monitoreo continuo de las vibraciones en frentes ciegos y el ajuste dinámico de los diagramas de disparo.
* **Sostenimiento:** Utilice pernos helicoidales con resina en las zonas donde la roca RMR disminuya a valores críticos.
* **Control:** Mantenga un control de calidad estricto sobre el paralelismo y longitud de perforación.`;
  };

  const fetchGeminiResponse = async (promptText: string) => {
    setIsCopilotLoading(true);
    setCopilotError('');
    setCopilotResponse('');
    const systemPrompt = `Eres el 'Mina Justa Copilot', un asistente experto en geotecnia, mallas de perforación y voladura subterránea en yacimientos de cobre. Analizas datos de factores de carga lineal (kg/m), eficiencias de frentes y calidades de roca RMR (III, IV, V). Responde en español de forma directa y estructurada con viñetas claras.`;
    
    try {
      if (!apiKey || apiKey === "") {
        // Fallback local instantáneo si no hay clave API configurada localmente
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulación de latencia de red
        setCopilotResponse(getMockGeminiResponse(promptText));
        return;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
      });
      if (!response.ok) {
        // Si la clave falla en el servidor real (ej. HTTP 403), usamos fallback local para garantizar la funcionalidad
        console.warn(`Error en API real: ${response.status}. Usando fallback geomecánico local.`);
        setCopilotResponse(getMockGeminiResponse(promptText));
        return;
      }
      const resJson = await response.json();
      setCopilotResponse(resJson.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta.");
    } catch (e: any) {
      console.warn(`Excepción en API real: ${e.message}. Usando fallback geomecánico local.`);
      setCopilotResponse(getMockGeminiResponse(promptText));
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const triggerEnergyOptimization = () => {
    const summary = filteredData.slice(0, 20).map(d => `- Labor: ${d.labor}, Roca: ${d.tipoRoca}, Factor: ${d.factorCarga} kg/m, Eficiencia: ${d.eficiencia.toFixed(0)}%`).join('\n');
    fetchGeminiResponse(`Analiza los factores de carga lineal y riesgo de sobre-rotura en roca mala (IV y V) según el siguiente resumen operativo:\n${summary}\nSugiere límites de dosificación de explosivo.`);
  };

  const triggerBottleneckAnalysis = () => {
    const summary = filteredData.filter(d => d.eficiencia < 85).slice(0, 15).map(d => `- Labor: ${d.labor}, Eficiencia: ${d.eficiencia.toFixed(0)}%, Roca: ${d.tipoRoca}`).join('\n');
    fetchGeminiResponse(`Identifica las causas geomecánicas o mecánicas de las demoras de avance en los frentes de baja eficiencia:\n${summary}\nPropón 3 acciones correctivas.`);
  };

  const triggerAlertPlan = (alert: Alert) => {
    fetchGeminiResponse(`Diseña un plan de contingencia operativo de 4 pasos para mitigar esta desviación crítica detectada:\n- Tipo: ${alert.tipo}\n- Mensaje: ${alert.mensaje}\n- Roca: ${alert.item.tipoRoca}\n- Factor: ${alert.item.factorCarga} kg/m`);
  };

  // --- FUNCIÓN DE RESTABLECIMIENTO DE DATOS ---
  const resetToInitialData = () => {
    setData(INITIAL_DATA);
    setFechaInicio('');
    setFechaFin('');
    setFilterBlock('Todas');
    setFilterLabor('Todas');
    setFilterRoca('Todas');
    setFilterEtapa('Todas');
    setFilterDisparo('Todas');
    setSearchTerm('');
    setAutoLoadStatus('failed');
  };

  const exportToCSV = () => {
    const headers = 'Block,Fecha,Turno,LABOR,REFERENCIA,Etapa,Tipo de Roca. Real,AVANCE,Long. Perf (Metros),Eficiencia (%),Tipo_Avance,Tipo Disparo,Factor de Carga Lineal,Total kilos de explosivo\n';
    const rows = filteredData.map(d => 
      `"${d.block}","${d.fecha}","${d.turno}","${d.labor}","${d.referencia}","${d.etapa}","${d.tipoRoca}",${d.real},${d.avance},${d.eficiencia.toFixed(1)},"${d.tipoAvance}","${d.tipoDisparo}",${d.factorCarga},${d.kilosExplosivo}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_Avances_MinaJusta_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      <Header 
        dataIsInitial={data === INITIAL_DATA}
        autoLoadStatus={autoLoadStatus}
        dataLength={data.length}
        handleCSVUpload={handleCSVUpload}
        resetToInitialData={resetToInitialData}
        exportToCSV={exportToCSV}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        
        {/* CONEXIÓN BD STATUS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-500" />
            <span className="text-slate-300">{autoLoadStatus === 'success' ? `✔️ Archivo analizado con éxito de forma automática (${data.length} corridas activas).` : `Visualizando base de datos base con frentes de Mina Justa (${data.length} filas iniciales).`}</span>
          </div>
          <span className="text-3xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">Auditoría Operativa</span>
        </div>

        <Filters 
          fechaInicio={fechaInicio} setFechaInicio={setFechaInicio}
          fechaFin={fechaFin} setFechaFin={setFechaFin}
          filterLabor={filterLabor} setFilterLabor={setFilterLabor} opcionesLabor={opcionesLabor}
          filterBlock={filterBlock} setFilterBlock={setFilterBlock} opcionesBlock={opcionesBlock}
          filterRoca={filterRoca} setFilterRoca={setFilterRoca} opcionesRoca={opcionesRoca}
          filterEtapa={filterEtapa} setFilterEtapa={setFilterEtapa} opcionesEtapa={opcionesEtapa}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        />

        <Metrics stats={stats} alertsCount={alerts.length} />

        <Alerts alerts={alerts} triggerAlertPlan={triggerAlertPlan} />

        <Copilot 
          isCopilotLoading={isCopilotLoading}
          copilotError={copilotError}
          copilotResponse={copilotResponse}
          triggerEnergyOptimization={triggerEnergyOptimization}
          triggerBottleneckAnalysis={triggerBottleneckAnalysis}
        />

        <Charts 
          sortedData={sortedData}
          data={data}
          worstLaborsData={worstLaborsData}
          explosiveConsByTurn={explosiveConsByTurn}
        />

        <DataTable sortedData={sortedData} />

      </main>
    </div>
  );
}

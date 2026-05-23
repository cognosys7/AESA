import type { MineData } from '../types';

export const normalizeDateToISO = (str: string): string => {
  if (!str) return '';
  const trimmed = str.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parts = trimmed.split(/[/\-]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    } else {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return trimmed;
};

export const parseCSV = (text: string): MineData[] => {
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return [];

  const firstLine = lines[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';
  const headers = firstLine.split(delimiter).map(h => h.trim().replace(/"/g, '').toLowerCase());
  const findIndex = (keys: string[]) => headers.findIndex(h => keys.some(k => h.includes(k)));

  const idxBlock = findIndex(['block']);
  const idxFecha = findIndex(['fecha']);
  const idxTurno = findIndex(['turno']);
  const idxLabor = headers.indexOf('labor') >= 0 ? headers.indexOf('labor') : findIndex(['labor']);
  const idxReferencia = findIndex(['referencia']);
  const idxEtapa = findIndex(['etapa']);
  const idxRoca = findIndex(['tipo de roca. real', 'roca. real', 'roca']);
  const idxAvanceReal = findIndex(['avance']);
  const idxAvanceProg = findIndex(['long. perf', 'metros perforados', 'prog']);
  const idxEficiencia = findIndex(['eficiencia']);
  const idxTipoAvance = findIndex(['tipo_avance', 'tipo avance']);
  const idxTipoDisparo = findIndex(['tipo disparo', 'disparo']);
  const idxFactorCarga = findIndex(['factor de carga', 'factor carga']);
  const idxTotalKilos = findIndex(['total kilos', 'explosivo', 'kilos']);

  const parsedRows: MineData[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(new RegExp(`${delimiter}(?=(?:(?:[^"]*"){2})*[^"]*$)`)).map(c => c.trim().replace(/"/g, ''));
    if (columns.length < 5) continue;

    const getFloat = (idx: number, fallback = 0) => {
      if (idx < 0 || idx >= columns.length) return fallback;
      let valStr = columns[idx].replace('%', '').trim();
      const val = parseFloat(valStr);
      return isNaN(val) ? fallback : val;
    };

    const getString = (idx: number, fallback = 'N/A') => {
      if (idx < 0 || idx >= columns.length) return fallback;
      return columns[idx].trim() || fallback;
    };

    const real = getFloat(idxAvanceReal, 0);
    const prog = getFloat(idxAvanceProg, 3.0);
    let ef = getFloat(idxEficiencia, 0);
    if (ef > 0 && ef < 2) ef = ef * 100;
    if (ef === 0 && prog > 0) ef = (real / prog) * 100;

    parsedRows.push({
      id: i,
      block: getString(idxBlock, 'N/A'),
      fecha: normalizeDateToISO(getString(idxFecha, 'N/A')),
      turno: getString(idxTurno, 'N/A').toUpperCase(),
      labor: getString(idxLabor, 'N/A'),
      referencia: getString(idxReferencia, 'N/A'),
      etapa: getString(idxEtapa, 'N/A').toUpperCase(),
      tipoRoca: getString(idxRoca, 'III').trim(),
      real: real,
      avance: prog,
      eficiencia: ef,
      tipoAvance: getString(idxTipoAvance, 'Lineal'),
      tipoDisparo: getString(idxTipoDisparo, 'Frente'),
      factorCarga: getFloat(idxFactorCarga, 0),
      kilosExplosivo: getFloat(idxTotalKilos, 0)
    });
  }
  return parsedRows;
};

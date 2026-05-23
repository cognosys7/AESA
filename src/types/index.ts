export interface MineData {
  id: number;
  block: string;
  fecha: string;
  turno: string;
  labor: string;
  referencia: string;
  etapa: string;
  tipoRoca: string;
  real: number;
  avance: number;
  eficiencia: number;
  tipoAvance: string;
  tipoDisparo: string;
  factorCarga: number;
  kilosExplosivo: number;
}

export interface Alert {
  id: number;
  tipo: string;
  mensaje: string;
  severidad: 'alta' | 'critica' | string;
  item: MineData;
}

export interface Stats {
  totalReal: string;
  totalAvance: string;
  efficiency: string;
  avgFactor: string;
  totalExplosivo: string;
  totalDisparos: number;
}

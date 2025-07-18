export interface SeguroAuto {
  tipoVehiculo: string;
  matricula: string;
  anio: number;
  marca: string;
  modelo: string;
  tipoCombustible: string;
  cobertura: string;
  asistenciaVial: boolean;
  vehiculoSustituto: boolean;
}

export interface SeguroHogar {
  tipoPropiedad: string;
  direccion: string;
  ciudad: string;
  metrosConstruidos: number;
  pisos: number;
  valorContenido: number;
  valorPropiedad: number;
}

export interface SeguroViaje {
  fechaInicio: string;
  fechaFin: string;
  destino: string;
  paisResidencia: string;
  motivo: string;
  cobertura: string;
}

export interface SeguroVida {
  genero: string;
  estadoCivil: string;
  profesion: string;
  enfermedades: string;
  fuma: boolean;
  alcohol: boolean;
  discapacidad: boolean;
  antecedentes: boolean;
  extremos: boolean;
  hospitalizado: boolean;
}

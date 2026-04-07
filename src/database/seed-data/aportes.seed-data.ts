export type SeedDocumentDefinition = {
  name: string;
  shortened: string;
};

export type SeedModalityDefinition = {
  name: string;
  shortened: string;
};

export type SeedProcedureTypeDefinition = {
  name: string;
  secondName: string;
  modalities: SeedModalityDefinition[];
};

export const APORTES_MODULE_SEED = {
  displayName: 'Contribuciones',
  description: 'Contribuciones',
  name: 'contribuciones',
  shortened: 'CON',
} as const;

export const APORTES_PROCEDURE_TYPES: SeedProcedureTypeDefinition[] = [
  {
    name: 'Descuentos Anticipados',
    secondName: 'Anticipado',
    modalities: [
      {
        name: 'Servicio Pasivo Anticipo Titular',
        shortened: 'SP-AT',
      },
      {
        name: 'Servicio Pasivo Anticipo Viuda(o)',
        shortened: 'SP-AV',
      },
    ],
  },
  {
    name: 'Aportes Directos',
    secondName: 'Directo',
    modalities: [
      {
        name: 'Servicio Activo Comisión Ítem "0"',
        shortened: 'SA-CI0',
      },
      {
        name: 'Servicio Activo por Suspensión Temporal de Funciones',
        shortened: 'SA-STF',
      },
      {
        name:
          'Servicio Activo con Destino a la Disponibilidad de la Letra "A" por Enfermedad',
        shortened: 'SA-DDAE',
      },
      {
        name: 'Reserva Activa Comisión Ítem "0"',
        shortened: 'RA-CI0',
      },
      {
        name: 'Reserva Activa por Suspensión Temporal de Funciones',
        shortened: 'RA-STF',
      },
      {
        name: 'Servicio Pasivo Titular',
        shortened: 'SP-T',
      },
      {
        name: 'Servicio Pasivo Viuda(o)',
        shortened: 'SP-V',
      },
    ],
  },
  {
    name: 'Regularización de Aportes',
    secondName: 'Regularización',
    modalities: [
      {
        name: 'Reincorporación de Servicio Activo Comisión Ítem "0"',
        shortened: 'RSA-CI0',
      },
      {
        name: 'Reincorporación de Servicio Activo por Suspensión Temporal de Funciones',
        shortened: 'RSA-STF',
      },
      {
        name:
          'Reincorporación de Servicio Activo con Destino a la Disponibilidad de la Letra "A" por Enfermedad',
        shortened: 'RSA-DDAE',
      },
      {
        name: 'Reincorporación de Reserva Activa Comisión Ítem "0"',
        shortened: 'RRA-CI0',
      },
      {
        name: 'Reincorporación de Reserva Activa por Suspensión Temporal de Funciones',
        shortened: 'RRA-STF',
      },
      {
        name: 'Fallecimiento del Servicio Activo',
        shortened: 'F-SA',
      },
      {
        name: 'Fallecimiento de la Reserva Activa',
        shortened: 'F-RA',
      },
      {
        name: 'Fallecimiento del Servicio Pasivo Titular',
        shortened: 'F-SPT',
      },
      {
        name: 'Fallecimiento del Servicio Pasivo Viudo(a)',
        shortened: 'F-SPV',
      },
    ],
  },
];

export const APORTES_DOCUMENTS = {
  memoComisionServicioItem0: {
    name: 'Fotocopia del Memorándum de designación en Comisión de Servicio Ítem "0"',
    shortened: 'FOT_MCSI0',
  },
  resolucionComisionServicioItem0: {
    name: 'Fotocopia de la Resolución de designación en Comisión de Servicio Ítem "0"',
    shortened: 'FOT_RCSI0',
  },
  memoSuspensionTemporalFunciones: {
    name: 'Fotocopia del Memorándum de Suspensión Temporal de Funciones',
    shortened: 'FOT_MSTF',
  },
  resolucionSuspensionTemporalFunciones: {
    name: 'Fotocopia de la Resolución de Suspensión Temporal de Funciones',
    shortened: 'FOT_RSTF',
  },
  memoDisponibilidadLetraAEnfermedad: {
    name:
      'Fotocopia del Memorándum de Destino a la Disponibilidad de la Letra "A" por Enfermedad',
    shortened: 'FOT_MDLAE',
  },
  resolucionDisponibilidadLetraAEnfermedad: {
    name:
      'Fotocopia de la Resolución de Destino a la Disponibilidad de la Letra "A" por Enfermedad',
    shortened: 'FOT_RDLAE',
  },
  memoDisponibilidadLetraCReservaActiva: {
    name:
      'Fotocopia del Memorándum de Destino a la Disponibilidad de la Letra "C" de la Reserva Activa',
    shortened: 'FOT_MDLCRA',
  },
  resolucionDisponibilidadLetraCReservaActiva: {
    name:
      'Fotocopia de la Resolución de Destino a la Disponibilidad de la Letra "C" de la Reserva Activa',
    shortened: 'FOT_RDLCRA',
  },
  memoDisponibilidadLetraAJubilacion: {
    name:
      'Fotocopia del Memorándum de Destino a la Disponibilidad de la Letra "A" por Jubilación',
    shortened: 'FOT_MDLAJ',
  },
  resolucionDisponibilidadLetraAJubilacion: {
    name:
      'Fotocopia de la Resolución de Destino a la Disponibilidad de la Letra "A" por Jubilación',
    shortened: 'FOT_RDLAJ',
  },
  memoReincorporacion: {
    name: 'Fotocopia del Memorándum de Reincorporación',
    shortened: 'FOT_MR',
  },
  resolucionReincorporacion: {
    name: 'Fotocopia de la Resolución de Reincorporación',
    shortened: 'FOT_RR',
  },
  certificadoComisionReincorporacion: {
    name:
      'Certificado de Trabajo original que detalle periodos de comisión y reincorporación',
    shortened: 'CERT_CR',
  },
  certificadoSuspensionReincorporacion: {
    name:
      'Certificado de Trabajo original que detalle periodos de suspensión y reincorporación',
    shortened: 'CERT_SR',
  },
  certificadoDestinoDisponibilidadReincorporacion: {
    name:
      'Certificado de Trabajo original que detalle periodos de destino a la disponibilidad y reincorporación',
    shortened: 'CERT_DDR',
  },
  certificadoDefuncionTitular: {
    name: 'Fotocopia del certificado de defunción de titular',
    shortened: 'FOT_CDT',
  },
  certificadoDefuncionConyuge: {
    name: 'Fotocopia del certificado de defunción de cónyuge',
    shortened: 'FOT_CDC',
  },
  certificadoAniosServicio: {
    name:
      'Fotocopia del certificado de años de servicio del Comando General de la Policía Boliviana',
    shortened: 'FOT_CAS',
  },
  contratoGestoraPublica: {
    name: 'Fotocopia del Contrato de la Gestora Pública, AFP o Entidad Aseguradora',
    shortened: 'FOT_CON',
  },
  memorandoAgradecimiento: {
    name: 'Fotocopia de Memorándum de Agradecimiento',
    shortened: 'FOT_MA',
  },
  certificadoDesvinculacion: {
    name: 'Certificado de trabajo que detalle causal de desvinculación',
    shortened: 'CERT_DESV',
  },
  certificadoMatrimonio: {
    name: 'Fotocopia del certificado de matrimonio',
    shortened: 'FOT_CM',
  },
  certificadoDefuncionViudo: {
    name: 'Fotocopia del certificado de defunción de viudo (a)',
    shortened: 'FOT_CDV',
  },
  compromisoAporteDirectoTitular: {
    name: 'Compromiso de aporte directo titular',
    shortened: 'CO_ADT',
  },
  compromisoAporteDirectoViuda: {
    name: 'Compromiso de pago de aporte directo viuda',
    shortened: 'CO_ADV',
  },
  compromisoCambioModalidadTitular: {
    name: 'Compromiso Cambio de Modalidad Titular',
    shortened: 'CO_CMT',
  },
  compromisoCambioModalidadViuda: {
    name: 'Compromiso de Pago Cambio de Modalidad Viuda',
    shortened: 'CO_CMV',
  },
  compromisoItem0ServicioActivo: {
    name: 'Compromiso de Pago Item "0" - Servicio Activo',
    shortened: 'CO_I0SA',
  },
  compromisoItem0ReservaActiva: {
    name: 'Compromiso de Pago Ítem "0" - Reserva Activa',
    shortened: 'CO_I0RA',
  },
  compromisoSuspendidoServicioActivo: {
    name: 'Compromiso de Pago Suspendido - Servicio Activo',
    shortened: 'CO_SSA',
  },
  compromisoSuspendidoReservaActiva: {
    name: 'Compromiso de Pago Suspendido - Reserva Activa',
    shortened: 'CO_SRA',
  },
  compromisoDisponibilidadEnfermedad: {
    name: 'Compromiso de Pago Disponibilidad por Enfermedad',
    shortened: 'CO_DE',
  },
  solicitudRegularizacionAmFallecimiento: {
    name: 'Solicitud de Regularización de Aportes AM por Fallecimiento',
    shortened: 'SOL_RAAMF',
  },
  solicitudRegularizacionCmFallecimiento: {
    name: 'Solicitud de Regularización de Aportes CM por Fallecimiento',
    shortened: 'SOL_RACMF',
  },
  solicitudRegularizacionReincorporacion: {
    name: 'Solicitud de Regularización de Aportes (FRPS y/o CM) por reincorporación',
    shortened: 'SOL_RAPR',
  },
} as const satisfies Record<string, SeedDocumentDefinition>;

export type SeedRequirementDefinition = {
  documentKey: keyof typeof APORTES_DOCUMENTS;
  number: number;
};

export const APORTES_REQUIREMENT_PLACEHOLDERS = {
  'SP-AT': [],
  'SP-AV': [],
  'SA-CI0': [],
  'SA-STF': [],
  'SA-DDAE': [],
  'RA-CI0': [],
  'RA-STF': [],
  'SP-T': [],
  'SP-V': [],
  'RSA-CI0': [],
  'RSA-STF': [],
  'RSA-DDAE': [],
  'RRA-CI0': [],
  'RRA-STF': [],
  'F-SA': [],
  'F-RA': [],
  'F-SPT': [],
  'F-SPV': [],
} as const satisfies Record<string, readonly SeedRequirementDefinition[]>;

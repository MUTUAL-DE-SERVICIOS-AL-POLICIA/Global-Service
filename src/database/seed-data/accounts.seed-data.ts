export interface AccountSeedData {
  id: number;
  eif: string;
  name: string;
  state: string;
  accountNumber: string;
}

export const ACCOUNTS_SEED_DATA: AccountSeedData[] = [
  {
    id: 1,
    eif: 'MLD1014',
    name: 'SERVICIOS VARIOS',
    state: 'activo',
    accountNumber: '1-33175642',
  },
  {
    id: 2,
    eif: 'MLD1014',
    name: 'AUXILIO MORTUORIO',
    state: 'activo',
    accountNumber: '1-33175741',
  },
  {
    id: 3,
    eif: 'MLD1014',
    name: 'PRÉSTAMOS Y DIVIDENDOS',
    state: 'activo',
    accountNumber: '1-33175676',
  },
  {
    id: 4,
    eif: 'MLD1014',
    name: 'FONDO DE RETIRO Y CUOTA MORTUORIA',
    state: 'activo',
    accountNumber: '1-33175733',
  },
];

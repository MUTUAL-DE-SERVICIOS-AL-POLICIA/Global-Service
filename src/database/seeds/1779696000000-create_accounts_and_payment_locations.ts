import { Account } from 'src/account/entities/account.entity';
import { PaymentLocation } from 'src/payment-location/entities/payment-location.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class GlobalCreateAccountsAndPaymentLocations1779696000000 implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<any> {
    const accountRepository = dataSource.getRepository(Account);
    const paymentLocationRepository = dataSource.getRepository(PaymentLocation);

    await accountRepository.insert([
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
    ]);

    await dataSource.query(`
      SELECT setval(
        pg_get_serial_sequence('global.accounts', 'id'),
        (SELECT MAX(id) FROM global.accounts)
      )
    `);

    await paymentLocationRepository.insert([
      {
        id: 1,
        name: 'MUTUAL DE SERVICIOS AL POLICÍA',
        code: 'MUS',
        isActive: true,
      },
      {
        id: 2,
        name: 'BANCO BISA S.A.',
        code: 'BIS',
        isActive: true,
      },
      {
        id: 3,
        name: 'BANCO DE CRÉDITO DE BOLIVIA S.A.',
        code: 'BCR',
        isActive: true,
      },
      {
        id: 4,
        name: 'BANCO PYME ECOFUTURO S.A.',
        code: 'PEF',
        isActive: true,
      },
      {
        id: 5,
        name: 'BANCO ECONOMICO S.A.',
        code: 'BEC',
        isActive: true,
      },
      {
        id: 6,
        name: 'BANCO FIE (BANCO PARA EL FOMENTO A INICIATIVAS ECONÓMICAS S.A.)',
        code: 'BIE',
        isActive: true,
      },
      {
        id: 7,
        name: 'BANCO FORTALEZA S.A.',
        code: 'BFO',
        isActive: true,
      },
      {
        id: 8,
        name: 'BANCO GANADERO S.A.',
        code: 'BGA',
        isActive: true,
      },
      {
        id: 9,
        name: 'BANCO MERCANTIL SANTA CRUZ S.A.',
        code: 'BME',
        isActive: true,
      },
      {
        id: 10,
        name: 'BANCO DE LA NACIÓN ARGENTINA',
        code: 'BNA',
        isActive: true,
      },
      {
        id: 11,
        name: 'BANCO NACIONAL DE BOLIVIA S.A.',
        code: 'BNB',
        isActive: true,
      },
      {
        id: 12,
        name: 'BANCO SOLIDARIO S.A.',
        code: 'BSO',
        isActive: true,
      },
      {
        id: 13,
        name: 'BANCO PRODEM S.A.',
        code: 'BPR',
        isActive: true,
      },
      {
        id: 14,
        name: 'BANCO UNIÓN S.A.',
        code: 'BUN',
        isActive: true,
      },
      {
        id: 15,
        name: 'BANCO FASSIL S.A.',
        code: 'FAS',
        isActive: false,
      },
    ]);

    await dataSource.query(`
      SELECT setval(
        pg_get_serial_sequence('global.payment_location', 'id'),
        (SELECT MAX(id) FROM global.payment_location)
      )
    `);
  }
}

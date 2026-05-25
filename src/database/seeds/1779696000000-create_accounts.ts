import { Account } from 'src/account/entities/account.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class GlobalCreateAccounts1779696000000 implements Seeder {
  track = true;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Account);

    await repository.insert([
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
  }
}

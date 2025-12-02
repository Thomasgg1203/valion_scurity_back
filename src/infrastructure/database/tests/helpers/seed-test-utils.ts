import { DataSource, DataSourceOptions } from 'typeorm';
import { AppDataSource } from 'src/config/ormconfig';

export const createTestDataSource = async () => {
  const ds = new DataSource({
    ...(AppDataSource.options as DataSourceOptions),
    synchronize: false,
    logging: false,
  });

  await ds.initialize();
  return ds;
};

import * as mysql from 'mysql2/promise';

async function refresh() {
  const configs = [
    { host: 'localhost', port: 3310, user: 'archkit_user', password: 'archkit_password', database: 'archkit_monolith' },
    { host: 'localhost', port: 3307, user: 'archkit_user', password: 'archkit_password', database: 'archkit_product' },
    { host: 'localhost', port: 3308, user: 'archkit_user', password: 'archkit_password', database: 'archkit_inventory' },
    { host: 'localhost', port: 3309, user: 'archkit_user', password: 'archkit_password', database: 'archkit_sales' }
  ];

  const tables = ['sales_items', 'sales_transactions', 'inventory', 'products'];

  for (const config of configs) {
    console.log(`Refreshing database: ${config.database}...`);
    let connection;
    try {
      connection = await mysql.createConnection(config);
      await connection.query('SET FOREIGN_KEY_CHECKS = 0');
      
      for (const table of tables) {
        try {
          await connection.query(`TRUNCATE TABLE ${table}`);
          console.log(`  Truncated ${table}`);
        } catch (e) {
          // Table might not exist in this specific DB (e.g. monolith has all, hybrid has subsets)
        }
      }
      
      await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log(`Successfully refreshed ${config.database}`);
    } catch (err: any) {
      console.warn(`Could not connect to ${config.database}: ${err.message}`);
    } finally {
      if (connection) await connection.end();
    }
  }
}

refresh().catch(console.error);

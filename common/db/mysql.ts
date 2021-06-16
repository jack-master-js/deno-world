import { DenoDB } from '../../dep.ts';

const { Database, MySQLConnector } = DenoDB;
const connector = new MySQLConnector({
    database: 'dev',
    host: '192.168.72.128',
    username: 'root',
    password: '123456',
    port: 3306,
});

export default new Database(connector);

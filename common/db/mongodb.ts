import { DenoDB } from '../../dep.ts';

const { Database, MongoDBConnector } = DenoDB;
const connector = new MongoDBConnector({
    uri: 'mongodb://192.168.72.128:27017',
    database: 'dev',
});

export default new Database(connector);

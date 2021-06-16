import { User } from './model.ts';
import { uuid } from '../dep.ts';
import db from '../common/db/mysql.ts';

class Service {
    async find(req: any, res: any) {
        if (!req.query.name) throw Error('need name');

        console.log(req.query);
        res.success();
    }
    async get(req: any, res: any) {
        console.log(req.params);
        res.data({ name: 'test' });
    }
    async create(req: any, res: any) {
        console.log(req.body);
        await User.create({
            id: uuid.generate(),
            name: 'test',
        });
        await db.close();
        res.success();
    }
    async update(req: any, res: any) {
        console.log(req.params);
        res.success();
    }
    async del(req: any, res: any) {
        console.log(req.params);
        res.success();
    }
}

export default new Service();

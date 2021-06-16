import { DenoDB } from '../dep.ts';
import db from '../common/db/mysql.ts';

const { DataTypes, Model } = DenoDB;

export class User extends Model {
    static table = 'users';
    static fields = {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            length: 25,
        },
    };
}

db.link([User]);

import { Sequelize, Model, DataTypes } from 'sequelize';
import { nanoid } from 'nanoid'
import * as bcrypt from 'bcrypt'

let path = "data/users.sqlite";
let sequelize = new Sequelize(
    {    
        "logging": false,
        "dialect": "sqlite",
        "storage": path
    }
);


const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    email: DataTypes.TEXT,
    token: DataTypes.TEXT,
    password: DataTypes.TEXT,
    group: DataTypes.TEXT,
    expired: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN
});

async function add_user(e, p, g) {
    await User.sync();
    let uuid = nanoid();
    const pwd = await(bcrypt.hash(p, 10));
    await User.create({
        email: e,
        id: uuid,
        token: null,
        password: pwd,
        group: g, 
        expired: false,
        admin: false
    });
    return uuid;
}

let id;
id = await(add_user("me@mail.com", "mypassword", "admin"));
id = await(add_user("fred@mail.com", "fredpassword", "regular"));
id = await(add_user("lisa@mail.com", "lisapassword", "regular"));
id = await(add_user("sheri@mail.com", "sheripassword", "regular"));
id = await(add_user("tom@mail.com", "tompassword", "regular"));

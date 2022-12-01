import { Sequelize, DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import * as bcrypt from 'bcrypt'

const path = "data/users.sqlite";

const sequelize = new Sequelize(
    {    
        "logging": false,
        "dialect": "sqlite",
        "storage": path,
        "query": {"raw": true}
    }
);

// User model
export const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    group: DataTypes.TEXT,
    status: DataTypes.TEXT,
    token: DataTypes.TEXT, // session token
    key: DataTypes.TEXT, // verification key
    reset: DataTypes.TEXT, // set to "pending" if pwd reset in progress
    newpassword: DataTypes.TEXT, // holding slot for pending new password
    expired: DataTypes.BOOLEAN
});

// add a user to the databse with pending status.
export async function Add(e, p) {
    const key = nanoid(6);
    await User.sync();
    let uuid = nanoid();
    const pwd = await(bcrypt.hash(p, 10));
    await User.create({
        email: e,
        id: uuid,
        token: null,
        status: "pending",
        password: pwd,
        key: key,
        reset: null,
        newpassword: null,
        group: "regular", 
        expired: false
    });
    return key;
}

// verify a user via key code
export async function Verify(e, k) {
    await User.sync();
    const user = await User.findOne({where: { email: e, key: k } });
    if(user) {
        await User.update(
            {
                status: "verified"
            },
            {
                where: { email: e, key: k }
            }
        )
        return(true)
    } else {
        return(false)
    }
}

// stage a password reset. will not finalize until confirmed.
export async function Reset(e, p) {
    await User.sync();
    const key = nanoid(6);
    const pwd = await(bcrypt.hash(p, 10));
    const user = await User.findOne({where: { email: e } });
    if(user) {
        await User.update(
            {
                reset: "pending",
                key: key,
                newpassword: pwd
            },
            {
                where: { email: e }
            }
        )
        return(key)
    } else {
        return(null)
    }
}

// confirm password reset.
export async function Confirm(e, k) {
    await User.sync();
    const user = await User.findOne({where: { email: e, key: k, reset: "pending"} });
    if(user) {
        await User.update(
            {
                reset: null,
                key: k,
                password: user.newpassword
            },
            {
                where: { email: e, reset: "pending"} 
            }
        )
        return(true)
    } else {
        return(false)
    }
}
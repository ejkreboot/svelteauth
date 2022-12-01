import { invalid, redirect } from '@sveltejs/kit';
import { Sequelize, Model, DataTypes } from 'sequelize';
import { nanoid } from 'nanoid'
import * as bcrypt from 'bcrypt'

const path = "data/users.sqlite";
const sequelize = new Sequelize(
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

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const email = form.get('email');
        const password = form.get('password');            
        const user = await User.findOne({where: { email: email } });
        const passwordMatch = user && (await bcrypt.compare(password, user.password));

        if(passwordMatch) {
            const authToken = crypto.randomUUID();
            await User.update(
                { 
                    token: authToken
                },
                {
                    where: { email: email }
                }
            );    
            cookies.set('session', authToken, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 // one hour
              })
            throw redirect(307, '/protected/landing');
        } else {
            return {
                success: false,
                email: email,
                message: "Hmmm. Not quite.",
                info: null
            }            
        }
    }
};
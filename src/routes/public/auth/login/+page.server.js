import { redirect } from '@sveltejs/kit';
import * as bcrypt from 'bcrypt'
import { User } from '$lib/server/user.js';

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const email = form.get('email');
        const password = form.get('password');            
        const user = await User.findOne({where: { email: email } });
        const passwordMatch = user && (await bcrypt.compare(password, user.password));

        if(passwordMatch && user.status == "verified") {
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
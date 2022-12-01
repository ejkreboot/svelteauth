import { Reset, Confirm, User } from '$lib/server/user.js'
import { redirect } from '@sveltejs/kit';
import { smtp_config } from '$lib/server/config.js';
import * as nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: smtp_config.host,
    port: smtp_config.port,
    auth: {
      user: smtp_config.user,
      pass: smtp_config.pass
    }
  });

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const email = form.get('email');
        const password = form.get('password');
        const key_code = form.get('key_code')

        if(key_code == undefined) {
            let user = await User.findOne({where: { email: email, status: "verified" } });
            if(!user) { 
                // user does not exist
                return {
                    success: false,
                    email: email,
                    message: "That email is not registered. Please try again or register new account.",
                    info: null
                }            
            }
            // user exists...stage password reset.
            const key = await(Reset(email, password));
            const info = await transport.sendMail({
                from: 'mailtrap@mailtrap.com', 
                to: email, 
                subject: "Your Svelte Auth confirmation code", 
                text: "Someone (you, I hope) requested a password reset for Svelte Auth. Your confirmation code is: " + key +
                      " If you did not request a new password, you can ignore this message.",
                html: "<b><span style='font-family: Arial;'>Someone (you, I hope) requested a password reset for Svelte Auth. </b></span>" +
                      "<span style='font-family: Arial;'><p>Your confirmation code is: <b>" + key + "</b></span></p>" +
                      "<span style='font-family: Arial;'><p>If you did not request a new password, you can ignore this message.</p></span>"
            });
            return {
                success: true,
                email: email,
                message: "Please check your email for confirmation code.",
                info: null
            }    
        } else {
            // confirmation code provided...verify it.
            const v = await(Confirm(email, key_code))
            if(v) {
                throw redirect(307, '/public/auth/verified');
            } else {
                return {
                    success: true,
                    email: email,
                    message: "Incorrect confirmation code. Please try again.",
                    info: null
                }    
            }
        }
    }
}
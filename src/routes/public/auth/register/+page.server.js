import { Add, Verify, User } from '$lib/server/user.js'
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
            let user = await User.findOne({where: { email: email } });
            if(user) { 
                // user already exists
                return {
                    success: false,
                    email: email,
                    message: "That email is already registered.",
                    info: null
                }            
            }

            user = await User.findOne({where: { email: email, status: "pending" } });
            if(user) {
                // user already exists but not yet verified...try again
                return {
                    success: true,
                    email: email,
                    message: "Unverified account. Please check your email for verification code.",
                    info: null
                }            
            }

            // user does not exist...create new user
            const key = await(Add(email, password));
            const info = await transport.sendMail({
                from: 'mailtrap@mailtrap.com', 
                to: email, 
                subject: "Your Svelte Auth confirmation code", 
                text: "Thank you for signing up at Svelte Auth! Your confirmation code is: " + key, 
                html: "<b><span style='font-family: Arial;'>Thank you for signing up at Svelte Auth! </b></span>" +
                      "<span style='font-family: Arial;'><p>Your confirmation code is: <b>" + key + "</b></span></p>"
            });

            return {
                success: true,
                email: email,
                message: "Please check your email for confirmation code.",
                info: null
            }    
        } else {
            // confirmation code provided...verify it.
            const v = await(Verify(email, key_code))
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
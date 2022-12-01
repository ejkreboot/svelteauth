import { redirect } from '@sveltejs/kit';
import { User } from '$lib/server/user.js';

export const handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session')
  const path = event.url.pathname;
  if(path == "/") {
    throw redirect(307, '/public/landing');
  }

  if (!session) {
    const regex = /^\/public/g;
    const pub = path.match(regex);
    if(!pub) {
      // requested a protected route but not logged in
      throw redirect(307, '/public/auth/login');
    } else {
      // public route ... proceed with request
      return await resolve(event)
    }
  }

  const user = await User.findOne(
    {
        where: { token: session } 
    });

  if (user) {
    const regex = /^\/private\/admin/g;
    const admin = path.match(regex);
    if(admin) {
      if(!user.group == "admin") {
        // requested an admin route but not an admin
        throw redirect(403, '/protected/landing');
      }
    }
    event.locals.user = {
      email: user.email,
      group: user.group
    }
  } else {
    // requested a protected route invalid token...
    throw redirect(403, '/public/auth/login');
  }

  return await resolve(event);
}

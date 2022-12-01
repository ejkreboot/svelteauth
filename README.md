# Auth example with sveltekit

This is a self contained svletekit web site with public and protected routes combined with session token based user 
authentication. There are [other](https://joyofcode.xyz/sveltekit-authentication-using-cookies) [examples](https://blog.logrocket.com/authentication-svelte-using-cookies/) on the web, which are excellent.  But each seemed to leave out one or more details 
that made this topic challenging for my pea sized intellect. So I rolled my own example here mainly for self education 
purposes. I wonder what I left out?

Please open issues to identify errors or shortcomings in this example.

## Features

* Only hashed password saved in database.
* sqlite user database -- no external database required
* Any routes added under /src/routes/public are (you guessed it) public.
* Any route added under /src/routes/protected are (wait for it) password protected.
* Any routes added under /src/routes/protected/admin are (...) only accessible by users of the "admin" group.
* init-users.js script is provided to create the database and Users table and generate some demo users.
* Built with 'pico.css' to keep it simple but not too painful on the eyes

## Usage

```
git clone https://github.com/ejkrebook/svelteauth
cd svelteauth
npm install
node init-users.js
npm run dev
```
Then point your browser to [http://localhost:5173/](http://localhost:5173/).

## Basic design.

Requests are caught by 'hooks.server.js'. Requests for public routes are passwed through. Requests for 
Private routes are only passed if there is a session cookie with a token that matches a user token 
in the database. Requests for admin routes are only passed if there is both a valid user token and if 
the user is part of the "admin" group.

If there is valid session cookie (with a valid token), the user email and group are injected into session's 
local storage:

> src/hooks.server.js
```
  if (user) {
  ... 
  /* validate routes and then...*/
  ...

    event.locals.user = {
      email: user.email,
      group: user.group
    }
  }
 
  ...

```

The local storage is then loaded by the (aptly named) load function in the top level `+layout.server.js' which 
then exposes this information to the template as follows:

> src/routes/+layout.server.js
```
export const load = async ({ locals }) => {
    if(locals.user) {
      return {
        email: locals.user.email,
        group: locals.user.group
      }  
    } else {
      return {
        email: "",
        group: ""
      }  
    }
  }
```

>src/routes/+layout.svelte
```
<script>
    export let data;
</script>

...rest of template here, customized based on whether data.user is defined...

```

But where does the session cookie get set? That occurs via the login page ('src/routes/auth/login'). 
The default form action checks if the provided password (after hashing) matches the (hashed) password 
in the database, a session cookie is created. The cookie expires after one hour as presently coded, 
but this could be adjusted to your liking. See 'src/routes/auth/login/+page.server.js' for details.

## TO DO

No user administration or registration is implemented yet. Presently you need to "manually" (i.e. with 
a script such as the provided 'init-users.js') create entries in `data/users.sqlite`. I need to 
implement a registration page (ideally with email confirmation) and user admin page at some point. 


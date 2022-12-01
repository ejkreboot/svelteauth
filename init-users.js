import { nanoid } from 'nanoid';
import { User } from './src/lib/server/user.js';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import { exit } from 'process';

var args = process.argv.slice(2);

if(fs.existsSync("data/users.sqlite")) {
    if(args[0] == "-f") {
        console.log("File exists...overwriting due to -f flag.");
        fs.unlink("data/users.sqlite", (e) => e ? console.log(e) : "" );
    } else {
        console.log("File exists. Use node init-users.js -f to overwrite.");
        exit();    
    }
}

async function add_user(e, p, g) {
    await User.sync();
    let uuid = nanoid();
    const pwd = await(bcrypt.hash(p, 10));
    await User.create({
        email: e,
        id: uuid,
        token: null,
        status: "verified",
        password: pwd,
        reset: null,
        newpassword: null,
        key: nanoid(6),
        group: g, 
        expired: false
    });
    return uuid;
}

let id;
id = await(add_user("me@mail.com", "mypassword", "admin"));
id = await(add_user("fred@mail.com", "fredpassword", "regular"));
id = await(add_user("lisa@mail.com", "lisapassword", "regular"));
id = await(add_user("sheri@mail.com", "sheripassword", "regular"));
id = await(add_user("tom@mail.com", "tompassword", "regular"));

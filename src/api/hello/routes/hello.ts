// src/api/hello/routes/hello.ts
export default {
    routes: [
        { 
            method: 'GET',
             path: '/hello',
              handler: 'api::hello.hello.spellName',
               config: { auth: false }
         },
    ],
};
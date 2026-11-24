// src/api/hello/controllers/hello.ts
export default {
  spellName(ctx: any) {
    const name = ctx.query.name ?? 'world';
    const message = strapi.service('api::hello.hello').greet(name);
    ctx.body = { message };
  },
};
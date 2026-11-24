// src/extensions/users-permissions/strapi-server.ts
export default (plugin: any) => {
  console.log('>>> users-permissions extension loaded');

  const originalRegister = plugin.controllers.auth.register;
  const ALLOWED_ROLES = ['Author', 'dev', 'adminnew']; 

  plugin.controllers.auth.register = async (ctx: any) => {
    console.log('>>> custom register called');

    const requestedRole = ctx.request.body?.role;
    if (ctx.request.body) delete ctx.request.body.role;

    let role: any = null;
    if (requestedRole !== undefined) {
      if (!ALLOWED_ROLES.includes(requestedRole)) {
        return ctx.badRequest('Invalid role');
      }
      role = await strapi.db
        .query('plugin::users-permissions.role')
        .findOne({ where: { name: requestedRole } });
      if (!role) return ctx.badRequest('Role not found');
    }

    await originalRegister(ctx);

    if (role && ctx.body?.user?.id) {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: ctx.body.user.id },
        data: { role: role.id },
      });
    }
  };

  return plugin;
};
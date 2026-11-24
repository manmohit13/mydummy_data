const ALLOWED_ROLES = ['dev','adminnew']; // lowercase names of roles allowed at registration

export default {
  async register(ctx: any) {
    const { username, email, password, role: roleName } = ctx.request.body || {};

    if (!username || !email || !password || !roleName) {
      return ctx.badRequest('username, email, password and role are required');
    }

    const requested = String(roleName).trim().toLowerCase();
    if (!ALLOWED_ROLES.includes(requested)) {
      return ctx.badRequest('Invalid role');
    }

    const roles = await strapi.db.query('plugin::users-permissions.role').findMany(); // Fetch all roles from the database
    const role = roles.find((r: any) => r.name.toLowerCase() === requested); // Find the role object that matches the requested role name
    if (!role) return ctx.badRequest('Role not found');

    const existing = await strapi.db                                          // Check if a user with the same email or username already exists
      .query('plugin::users-permissions.user')
      .findOne({ where: { $or: [{ email: email.toLowerCase() }, { username }] } });
    if (existing) return ctx.badRequest('Email or Username are already taken');

    const user = await strapi                                               // Create the new user
      .plugin('users-permissions')
      .service('user')
      .add({
        username,
        email: email.toLowerCase(),
        password,
        provider: 'local', //provider: 'local' means email/password login
        confirmed: true,    //confirmed: true skips email confirmation
        role: role.id,     //role: role.id links the user to the role you found in previous step
      });

    const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id }); // Generate a JWT token for the newly created user

    const sanitizedUser = await strapi.contentAPI.sanitize.output(                      // Sanitize the user object before sending it in the response
      user,
      strapi.getModel('plugin::users-permissions.user'),
      { auth: ctx.state.auth }      // Pass the authentication state to the sanitize function
    );

    ctx.body = { jwt, user: sanitizedUser };                                            // Send the JWT token and sanitized user object in the response
  },
};
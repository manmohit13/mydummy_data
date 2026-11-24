export default {
  routes: [
    {
      method: 'POST',
      path: '/register-with-role',
      handler: 'api::register-with-role.auth-role.register',
      config: { auth: false },
    },
  ],
};
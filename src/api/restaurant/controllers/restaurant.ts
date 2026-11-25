/**
 * restaurant controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::restaurant.restaurant', ({ strapi }) => ({
    async find(ctx) {
        console.log('someone requested the restaurant list');
        return await super.find(ctx);   
    },
}));

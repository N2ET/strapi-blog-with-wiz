'use strict';

/**
 * wiz-note-share.js controller
 *
 * @description: A set of functions called "actions" of the `wiz-note-share` plugin.
 */

// const { sanitizeEntity } = require('strapi-utils');

function getService () {
  return strapi.plugins['wiz-note-share'].services['wiz-note-share'];
}

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },

  findConfig: async (ctx) => {

    const service = getService();
    const config = await service.getStoreData();

    return config;
  },

  find: async (ctx) => {
      return strapi.controllers.article.find(ctx);
  },

  findOneBySlug: async (ctx) => {
    return strapi.controllers.article.findOneBySlug(ctx);
  },

  updateConfig: async (ctx) => {
    const body = ctx.request.body;

    if (!body.server || typeof(body.enabled) === 'undefined') {
      throw new strapi.errors.badRequest('ValidationError', {
        errors: ['server & enabled required']
      })
    }

    const service = getService();

    const config = await service.getStoreData();

    await service.setStoreData({
      ...config,
      enabled: body.enabled,
      server: body.server
    });

    return {

    };
  },

  create: async (ctx) => {

    const body = ctx.request.body;
    if (!body.url || !body.userId) {
      throw new strapi.errors.badRequest('ValidationError', {
        errors: ['url required']
      })
    }

    const service = getService();

    let result;

    try {
    
      result = await service.createWizArticle({
        url: body.url,
        userId: body.userId
      });

      return {
        data: {
          id: result.data.id,
          title: result.data.title
        }
      };

    } catch (e) {
      
      // 2种形式，一种是判断 error，一种是使用catch，应该使用哪种风格？？
      // 好像必须使用try了，否则走不到这个判断这里的代码里吧？
      if (result.error) {
        throw new strapi.erros.badRequest(null, {
          errors: ['create failed']
        })
      }

    }

  },

  findWriters: async (ctx) => {
    const data = await strapi.controllers.writer.find(ctx);
    const ret = data.map(item => ({
      label: item.name,
      value: item.id
    }));
    return ret;
  }
};

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

  findOne: async (ctx) => {
    return strapi.controllers.article.findOne(ctx);
  },

  create: async (ctx) => {

    if (!ctx.request.body?.url) {
      throw new strapi.errors.badRequest('ValidationError', {
        errors: ['url is required']
      })
    }

    const service = getService();

    let result;

    try {
    
      result = await service.createWizArticle({
        url: ctx.request.body.url
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

  }
};

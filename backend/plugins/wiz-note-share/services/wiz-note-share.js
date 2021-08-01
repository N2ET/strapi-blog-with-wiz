'use strict';

/**
 * wiz-note-share.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const axios = require('axios');

const AGENT = 'strapi-plugin-wiz-note-share 1.0';
const TIMEOUT = 60 * 1000;

function getWizArticlePathname (url) {
    return new URL(url).pathname;
}

function getWizArticleDataUrl (url) {
    
    let pagePath = getWizArticlePathname(url);
    let id = pagePath.match(/[^/]+$/)[0];

    return url.replace(pagePath, `/share/api/shares/${id}`);
}

// 去除根目录
function formatCategory (category) {
    let list = category.split('/');
    return list.length >= 3 ? list.splice(2) : list;
}

function formatTitle (title) {
    return title.replace(/\.[^.]+$/, '');
}

function getSlug (text) {
    return new Date().getTime().toString();
}

const service = module.exports = {

    async createWizArticle ({ url }) {

        let text  = await service.getWizNoteArticle({ url });
        let data = await service.getWizNoteArticleData({ url });

        if (!text.data || !data.data) {
            return {
                error: new Error('createWizAritcle fetch article failed')
            };
        }

        try {
            return await service.createArticle({
                url: url,
                data: data.data,
                text: text.data
            });

        } catch (e) {

            return {
                error: e
            };
        }
    },

    async getWizNoteArticle ({ url }) {

        try {
        
            let res = await axios({
                method: 'get',
                url: url,
                timeout: TIMEOUT,
                headers: {
                    agent: AGENT,
                    accept: '*/*'
                }
            });
    
            return {
                data: res.data
            };
        
        } catch (e) {

            strapi.log.warn(`[wiz-note-share] get WizNoteArtical failed: ${url}`);
            return {
                error: e
            }
        }

    },

    async getWizNoteArticleData({ url }) {

        let pageUrl = getWizArticleDataUrl(url);

        try {
            let data = await axios({
                method: 'get',
                url: pageUrl,
                headers: {
                    agent: AGENT,
                    accept: '*/*'
                }
            });

            let wizData = data.data;
            return {
                data: {
                    created: wizData.doc.created,
                    title: formatTitle(wizData.title),
                    category: formatCategory(wizData.doc.category),
                    userId: wizData.user.id,
                    userName: wizData.user.displayName
                }
            };

        } catch (e) {
            
            return {
                error: e
            };
        }
    },

    async createArticle ({ url, data, text }) {

        let categoryName = data.category[data.category.length - 1] || '默认分类';

        try {
            let category = await strapi.services.category.findOne({ name: categoryName });
        
            if (!category) {
                category = await strapi.services.category.create({
                    name: categoryName,
                    slug: getSlug(categoryName)
                });
            }
    
            let article = await strapi.services.article.findOne({
                wizUrl: url
            });
    
            if (!article) {
    
                article = await strapi.services.article.create({
                    title: data.title,

                    // content: text,
                    content: getWizArticlePathname(url),

                    slug: getSlug(data.title),
                    type: 'wiznote',
                    wizUrl: url,
                    created_at: data.created,
    
                    category: category.id,
                    author: 3
                });
    
            } else {

                article = await strapi.services.article.update({
                    id: article.id
                }, {
                    title: data.title,
                    
                    // content: text,
                    content: getWizArticlePathname(url),

                    slug: getSlug(data.title)
                });
            }

            return {
                data: article
            };

        } catch (e) {

            return {
                error: e
            };
        }

    }

};

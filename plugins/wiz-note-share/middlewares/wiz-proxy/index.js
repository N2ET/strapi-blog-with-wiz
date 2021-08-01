'use strict';

const proxy = require('koa-proxies');

// const util = require('./util');

// 需要在defaults.json里面配置enabled才会运行这个文件
module.exports = strapi => ({
    async initialize () {

        const service = strapi.plugins['wiz-note-share'].services['wiz-note-share'];
        const config = await service.getStoreData();

        if (!config.server || !config.proxyPaths.length) {
            strapi.log.info('[wiz-proxy] no server or no proxyPaths configured')
            return;
        }

        config.proxyPaths.forEach(item => {
            strapi.app.use(
                proxy(item, {
                    target: config.server,
                    changeOrigin: true,
                    logs: true,
                    // events: {
                    //     proxyRes (proxyRes, req, res) {
                    //         
                    //     },
                    //     error (err, req, res) {
                    //        
                    //     }
                    // }
                })
            );
        });

        strapi.log.info(`[wiz-proxy] running, proxy to ${config.server}`);
    }
});
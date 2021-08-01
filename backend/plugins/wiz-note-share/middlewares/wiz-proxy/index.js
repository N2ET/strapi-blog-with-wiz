'use strict';

const proxy = require('koa-proxies')

const proxyPaths = [
    '/wapp',
    '/lang',
    '/api',
    '/share'
];

// 需要在defaults.json里面配置enabled才会运行这个文件
module.exports = strapi => ({
    async initialize () {

        // try {
        //     const config = await strapi.plugins['wiz-note-share'].controllers['wiz-note-share'].findConfig();

        //     if (!config) {
        //         return;
        //     }
        // } catch (e) {
        //     debugger;
        // }


        proxyPaths.forEach(item => {
            strapi.app.use(
                proxy(item, {
                    target: 'https://objs.net:4430',
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

    }
});
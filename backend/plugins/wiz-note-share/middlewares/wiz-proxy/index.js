'use strict';

const path = require('path');
const fs = require('fs');
const proxy = require('koa-proxies');

// const util = require('./util');

// 需要在defaults.json里面配置enabled才会运行这个文件
module.exports = strapi => ({
    async initialize () {

        const service = strapi.plugins['wiz-note-share'].services['wiz-note-share'];
        const config = await service.getStoreData();

        if (!config || !config.server || !config.proxyPaths.length) {
            strapi.log.info('[wiz-note-share] no server or no proxyPaths configured')
            return;
        }

        const catchDir = path.join(
            __dirname,
            'static'
        );

        if (!fs.existsSync(catchDir)) {
            fs.mkdirSync(catchDir);
        }


        function isCacheable (url) {
            
            return false;

            // return /\.js$/.test(url);
        }

        function getFilePath (url) {
            let targetFile = url.replace(/\//g, '_');
            targetFile = path.join(
                catchDir,
                targetFile
            );
            return targetFile;
        }

        function getCacheFile (url) {

            let targetFile = getFilePath(url);

            if (fs.existsSync(targetFile)) {

                return fs.readFileSync(
                    targetFile,
                    {
                        encoding: 'utf-8'
                    }
                );

                // return fs.createReadStream(targetFile);
            }
        }

        function cacheFile (url, res) {
            
            let file = getFilePath(url);

            const stream = fs.createWriteStream(file, {
                encoding: 'utf-8'
            });

            res.pipe(stream);
        }

        config.proxyPaths.forEach(item => {
            strapi.app.use(
                proxy(item, {
                    target: config.server,
                    changeOrigin: true,
                    logs: true,
                    events: {
                        proxyReq (proxyReq, req, res) {

                            const url = req.url;
                            if (isCacheable(url)) {

                                let stream = getCacheFile(url);  
                                if (stream) {
                                    // stream.pipe(res);
                                    res.body = stream;
                                    // res.end();
                                }

                            }

                        },

                        proxyRes (proxyRes, req, res) {
                            
                            const url = req.url;
                            if (isCacheable(url)) {
                                if (!fs.existsSync(
                                    getFilePath(url)
                                )) {
                                    cacheFile(url, proxyRes);
                                }
                            }

                        },


                        // error (err, req, res) {
                           
                        // }
                    }
                })
            );
        });

        strapi.log.info(`[wiz-proxy] running, proxy to ${config.server}`);
    }
});
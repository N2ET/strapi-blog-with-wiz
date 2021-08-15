module.exports = async () => {

    const service = strapi.plugins['wiz-note-share'].services['wiz-note-share'];

    const store = service.getStore();

    let config = await service.getStoreData(store);

    if (!config) {
        config = strapi.plugins['wiz-note-share'].config.defaultConfig || {};
        await service.setStoreData(config, store);
    }

};
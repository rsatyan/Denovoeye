
Ext.define('kharidy.store.Search', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'kharidy.model.Transaction',

        proxy: {
            noCache: false,
            type: 'jsonp',
            url:'/search'
        }
    }
});
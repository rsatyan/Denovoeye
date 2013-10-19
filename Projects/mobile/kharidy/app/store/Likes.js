
Ext.define('kharidy.store.Likes', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'kharidy.model.Likes',

        proxy: {
        	noCache: false,
            type: 'jsonp',
            url:'/likes'
        }
    }
});

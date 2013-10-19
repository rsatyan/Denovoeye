
Ext.define('kharidy.store.Comments', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'kharidy.model.Comments',

        proxy: {
        	noCache: false,
            type: 'jsonp',
            url:'/comments'
        }
    }
});
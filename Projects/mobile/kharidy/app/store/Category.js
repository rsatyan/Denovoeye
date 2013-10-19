
Ext.define('kharidy.store.Category', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'kharidy.model.Category',        
        proxy: {
            type: 'jsonp',
            url:'/category'
        }
    }
});

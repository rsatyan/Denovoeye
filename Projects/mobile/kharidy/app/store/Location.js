
Ext.define('kharidy.store.Location', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'kharidy.model.Transaction',

        proxy: {
        	noCache: false,        	
            type: 'jsonp',
            url:'/location'
        }
    }
});
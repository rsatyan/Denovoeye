
Ext.define('kharidy.store.Merchant', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'kharidy.model.Merchant',

        proxy: {
        	noCache: false,        	
            type: 'jsonp',
            url:'/merchant'
        }
    }
});
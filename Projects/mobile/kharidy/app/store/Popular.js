
Ext.define('kharidy.store.Popular', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'kharidy.model.Transaction',

        proxy: {
        	noCache: false,        	
            type: 'jsonp',
            url:'/popular'
        }
    }
});
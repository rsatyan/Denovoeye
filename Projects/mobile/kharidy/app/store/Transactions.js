
Ext.define('kharidy.store.Transactions', {
    extend  : 'Ext.data.Store',

    config: {
        model: 'kharidy.model.Transaction',

        proxy: {
        	noCache: false,
            type: 'jsonp',
            url:'/runs'
        }
    }
});
        	
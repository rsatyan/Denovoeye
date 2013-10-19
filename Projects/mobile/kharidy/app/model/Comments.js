
Ext.define('kharidy.model.Comments', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            { name: 'name',  type:'string' },
            { name: 'message', type: 'string' },
            { name: 'createdAt', type: 'date' },
            { name: 'profileId', type: 'string' }
        ]
    }
});
 
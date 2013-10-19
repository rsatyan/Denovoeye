
Ext.define('kharidy.model.Likes', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            { name: 'name',  type:'string' },
            { name: 'profileId', type: 'string' }
        ]
    }
});
 
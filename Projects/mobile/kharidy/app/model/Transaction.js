/**
*
* Transaction Model
*
**/

Ext.define('kharidy.model.Transaction', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: '_id', //note this maps to an actual field below
        fields: [
            { name: '_id',       type: 'string' },
            { name: 'location',  type: 'string' },
            { name: 'item',      type: 'string' },
            { name: 'statusmsg', type: 'string' },
            { name: 'category',  type: 'string' },
            { name: 'price',     type: 'number' },
            { name: 'date',      type: 'date'   },
            { name: 'profileId', type: 'string' },
            { name: 'image',     type: 'string' },
            { name: 'name',      type: 'string' },
            { name: 'likes',     type: 'auto'   },
            { name: 'merchant',  type: 'string' },
            { name: 'merchantId',type: 'string' },
            { name: 'geo',       type: 'auto'   },            
            { name: 'comments',  type: 'auto'   }
        ]
    }
});
 
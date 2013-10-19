/**
*
* Merchant Model
*
**/

Ext.define('kharidy.model.Merchant', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'name'          , type:'string' },
            { name: 'logo'          , type:'string' },
            { name: 'address1'      , type:'string' },
            { name: 'address2'      , type:'string' },
            { name: 'city'          , type:'string' },
            { name: 'state'         , type:'string' },
            { name: 'zipcode'       , type:'number' },
            { name: 'rating_count'  , type:'number' },
            { name: 'rating_avg'    , type:'number' }

        ],
        
        hasMany  : { model: 'kharidy.model.Transaction', 
                     name: 'purchases' ,
                     associationKey: 'runs' 
        }       
    }
});

Ext.define('kharidy.view.business.MerchantView', {
    
    extend: 'Ext.Container',
    xtype:'merchantview',
 
    config: {
        layout:'vbox',
    	items:[
    		{
                docked: 'top',
                xtype: 'toolbar',
                title: 'Business',
                cls:'kharidyBar',
                items: [                 
                    {
                        xtype: 'button',       
                        ui:'kharidy',                 
                        iconCls:'backBtn',                        
                        id: 'merchantviewBackBtn'
                    }             
                ]
            },
            {                
                xtype:'merchantInfo',
                scrollable: false,
                flex:1
            },          
            {
                xtype: 'merchantPurchases',
                flex: 2                
            }            
    	]
    }

});        
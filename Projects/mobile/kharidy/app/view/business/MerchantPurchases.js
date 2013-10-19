 
Ext.define('kharidy.view.business.MerchantPurchases', {
    extend: 'Ext.List',
    xtype:'merchantPurchases',
    config: {
    	disableSelection: true,
    	selectedItemCls:'',
        pressedCls:'',
        items : [
			{
                xtype:'toolbar',
                cls:'sortB',
                docked:'top',
                layout:{
                    pack: 'center',
                    type: 'hbox'
                },

                items: [
                    {
                        xtype: 'segmentedbutton',                        
                        flex: 1,

                        layout: {
                            pack: 'center'
                        },

                        defaults: {
                            xtype: 'button',
                            flex: 1
                        },

                        items: [
                            { text: 'Call' },
                            { text: 'Website' },
                            { text: 'Map' }
                        ]
                    }                    
                ]                
            },
            {
                xtype:'component',
                cls:'dark',
                html:'Purchases Or Services at this business',
                docked:'top',
                height:25
            }
        ],
    	cls: 'merchantPurchases',
        itemTpl:Ext.create('Ext.XTemplate', 
         '<div class="item">',
         		'<tpl if="image.length &gt; 0">',
				'<div class="itempic" style="background-image: url({image});"></div>',
				'</tpl> <tpl if="image.length == 0">',
				'<div class="itempic" style="background-image: url(resources/images/Nologo.png);"></div>',
				'</tpl>',
				'<div class="price">{[this.formatCurrency(values.price)]}</div>',
				'<h3 class="itemname">{item}</h3>',
				'<h4 class="msg">{statusmsg}</h4>',
			'</div>',
			{
				formatCurrency:function(num) {
					return  kharidy.util.Util.formatCurrency(num);
				}
			}
		 ),
         emptyText: 'No purchases found, be the first one make one!'    	
    }
});		
Ext.define('kharidy.controller.Merchant', {
    extend: 'Ext.app.Controller',

    requires: [
        
    ],

    config: {

        refs : {        		
        	'#merchantviewBackBtn' : {
                tap: 'hideMerchantView'
            }
        },

        hideMerchantView: function() {
      		Ext.Viewport.animateActiveItem(Ext.getCmp('runForm'),
            	    {type: 'slide', direction: 'right'}); 
      		Ext.getCmp('merchantview').hide();
    	}

    }    

});   
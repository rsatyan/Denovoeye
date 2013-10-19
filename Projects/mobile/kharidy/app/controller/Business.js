Ext.define('kharidy.controller.Business', {
    extend: 'Ext.app.Controller',

    requires: [
        
    ],

    config: {

        refs : {
        },
    

	    control : {	    	

	        '#registerMerchantSubmit' : {
                tap:'OnRegisterBusinessSubmit'
            },

            '#closeBusiness' : {
                    tap:'onCloseBusiness'
            },

            '#merchantBackBtn' : {
                tap: 'hideMerchantForm'
            },

            'button[action=onBusinessRegister]':{
	                tap:'OnShowBusinessRegister'
	        },

	          'button[action=onBusinessLogin]':{
	                tap:'onShowBusinessLogin'
	        },

            '#merchantviewBackBtn' : {
                tap: 'hideMerchantView'
            }

	    }
	},



    hideMerchantView: function() {
        Ext.Viewport.animateActiveItem(Ext.getCmp('main'),
                {type: 'slide', direction: 'right'}); 
        Ext.getCmp('merchantview').hide();
    },

 	OnShowBusinessRegister:function() {
    
        if(!this.showBusinessRegister) {
            this.showBusinessRegister = Ext.create('kharidy.view.business.Merchant', {
                id: 'showBusinessRegister'
            });
        }        

        Ext.Viewport.animateActiveItem(this.showBusinessRegister,
            {type: 'slide', direction: 'left'});             
    },

 	onCloseBusiness: function() {        
        Ext.Viewport.animateActiveItem(Ext.getCmp('login'),
                {type: 'slide', direction: 'right'});        
        Ext.getCmp('showBusinessOwner').hide();
    },

  	hideMerchantForm: function() {
      Ext.Viewport.animateActiveItem(Ext.getCmp('showBusinessOwner'),
                {type: 'slide', direction: 'right'}); 
      Ext.getCmp('showBusinessRegister').hide();
    },

    OnRegisterBusinessSubmit:function() {

        var name = Ext.getCmp('merchantName').getValue(),
            address1 = Ext.getCmp('address1').getValue(),
            address2 = Ext.getCmp('address2').getValue(),
            city = Ext.getCmp('city').getValue(),
            state = Ext.getCmp('state').getValue(),
            zipCode  =  Ext.getCmp('zipCode').getValue(),
            email  = Ext.getCmp('email').getValue(),   
            phone = Ext.getCmp('phone').getValue();
        

        Ext.Viewport.setMasked({
            xtype:'loadmask',
            message:'Loading..'
        });


        Ext.Ajax.request({
            url: '/merchant',
            method: 'POST',
            params: {
                name:name,
                address1:address1,
                address2:address2,
                city:city,
                state:state,
                zipCode:zipCode,
                email:email,
                phone:phone
            },
            success: function(o, r, n){
                Ext.Viewport.setMasked(false);
                Ext.device.Notification.show({
                    title: 'Company Registered!',
                    message: 'You company has been succesfully registered, please check your email (' + email + ') for confirmation.',
                    buttons: Ext.MessageBox.OK,
                    callback: function(button) {                    
                        Ext.Viewport.animateActiveItem(Ext.getCmp('showBusinessOwner'),
                				{type: 'slide', direction: 'right'}); 
      					Ext.getCmp('showBusinessRegister').hide();                     
                    }
                });                   
            },
            scope: this
        });        

    }
});   
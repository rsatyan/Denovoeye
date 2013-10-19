 /**
 * The Form that is shows when a user wants to add a new Run to the database.
 */
Ext.define('kharidy.view.business.Merchant', {
    extend: 'Ext.form.Panel',
    xtype:'merchantform',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Spinner',
        'Ext.field.DatePicker',
        'kharidy.view.util.Fileup',
        'kharidy.view.util.Rating'
    ],

    config: {

        padding: '5 5 15 5',
        scrollable: {
            indicators: false  
        },

        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                title: 'Register',
                cls:'kharidyBar',
                items: [                 
                    {
                        xtype: 'button',       
                        ui:'kharidy',                 
                        iconCls:'backBtn',                        
                        id: 'merchantBackBtn'
                    }            
                ]
            },            
            {
                xtype: 'fieldset',
                title: 'Business Name & Category',
                instructions: 'Put your name out there and grow your reputation & business',
                items: [                          	
                    {
                        xtype:'textfield',
                        id:'merchantName',
                        placeHolder:'Company Name'
                    },                    
                    {
                        xtype: 'autocompletefield',
                        id   : 'categoryField',                         
                        autoComplete :false,  
                        placeHolder: 'Category',
                        config: {
                            proxy: {
                                type:'ajax',
                                url: '/category',
                                reader: { type:'json'}
                            },
                            resultsHeight:300,
                            needleKey:'term',
                            valueKey:'name',
                            labelKey:['_id','name'],
                            itemTpl: '{name}'
                        }
                    }                    
                ]
            },
            {
            	xtype: 'fieldset',
                instructions: 'Consumers trust Kharidy to find the best service providers in their city',
                title: 'Business address',
                items: [                          	
                    {
                        xtype:'textfield',
                        id:'address1',
                        placeHolder:'Address'
                    },
                    {
                        xtype:'textfield',
                        id:'address2',
                        placeHolder:'Address'
                    },
                    {
                        xtype: 'textfield',
                        id   : 'city',
                        placeHolder: 'City'
                    },
                    {
                        xtype: 'textfield',
                        id   : 'state',
                        placeHolder: 'State'
                    },
                    {
                        xtype: 'numberfield',
                        id   : 'zipCode',
                        placeHolder: 'ZipCode'
                    }                                     
                ]
            },
            {
            	xtype: 'fieldset',
                instructions: 'Make it easy for consumers to contact you',
                title: 'Business contact',
                items: [                          	
                    {
                        xtype:'textfield',
                        id:'email',
                        placeHolder:'Email'
                    },
                    {
                        xtype:'textfield',
                        id:'phone',
                        placeHolder:'Phone Number'
                    }
                ]
            },
            {
                xtype: 'button',
                text: 'Register',
                ui: 'facebook',
                id: 'registerMerchantSubmit'
            }
        ]
    }
});

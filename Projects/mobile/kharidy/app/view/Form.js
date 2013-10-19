/**
 * The Form that is shows when a user wants to add a new Run to the database.
 */
Ext.define('kharidy.view.Form', {
    extend: 'Ext.form.Panel',
    xtype:'mainform',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Spinner',
        'Ext.field.DatePicker',
        'kharidy.view.util.Fileup'
    ],

    config: {

        padding: '5 5 20 5', // TRBL    
        scrollable: {
            direction: 'vertical',
            directionLock: true,
            indicators: false
        },

        // scrollable: {
        //     indicators: false  
        // },
        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                title: 'New Kharidy',
                cls:'kharidyBar',
                items: [
                    {
                        xtype: 'button',                        
                        iconCls:'backBtn',   
                        ui:'kharidy',                     
                        id: 'addKharidyBackBtn'
                    },

                    {
                        xtype:'spacer'
                    },
                    {
                        xtype: 'fileupload',
                        cls:'camera',
                        autoUpload: true,
                        align : 'right',
                        ui:'kharidy',
                        url: 'upload',
                        itemId: 'addKharidyCameraBtn'                        
                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId:'photoFieldSet',
                hidden:true,
                items: [                    
                    {
                        xtype:'image',
                        hidden:true,
                        itemId:'photo',
                        height:120,
                        width:320
                    },
                    {
                        xtype:'image',                        
                        itemId:'map',
                        height:120,
                        width:320
                    }
                ]   
            },

            {
                xtype: 'fieldset',
                title: 'Find & Rate Business (If known)',
                instructions: 'Please enter Business ID if know it or use the fields below to input business name',
                items: [                            
                    {
                        xtype:'autocompletefield',
                        id:'merchantId',
                        autoComplete :false,
                        autoCorrect:false,
                        clearIcon:true,
                        placeHolder:'Business ID',
                        config: {
                            proxy: {
                                type:'ajax',
                                url:'/businessid',
                                reader: { type:'json'}
                            },
                            resultsHeight:300,                            
                            needleKey:'term',
                            valueKey:'merchantId',
                            labelKey:['_id','merchantId'],
                            itemTpl: '{name}<br>{merchantId}',
                            onFocus: function() {
                                pnl = Ext.getCmp('runForm');
                                scr = pnl.getScrollable().getScroller();
                                scr.scrollTo(0,50);                                                                    
                            }
                        },
                        listeners: {                            
                            onSelect: function(record) {                                
                                loc = record.get('city')  + ', ' + record.get('state');                                
                                Ext.getCmp('locationField').setValue(loc);
                                Ext.getCmp('merchantField').setValue(record.get('name'));                                
                                rfld = Ext.getCmp('merchantRating');
                                rfld.setHidden(false);
                            }
                        }
                    },                    
                    {
                        xtype:'ratingfield',                        
                        id:'merchantRating',
                        value: 1,
                        hidden:true,
                        listeners: {
                            onRated:function(){
                                pnl = Ext.getCmp('runForm');
                                scr = pnl.getScrollable().getScroller();
                                scr.scrollTo(0,310);
                                Ext.getCmp('itemField').focus();
                            }
                        }
                    }
                ]
            },

            {
                xtype: 'fieldset',
                title:'Purchase or Services received',
                items: [          
                    {
                        xtype:'textfield',
                        id :'imageField',
                        hidden:true
                    },
                    {
                        xtype:'textfield',
                        id:'merchantField',
                        placeHolder:'Business Name?'
                    },
                    {
                        xtype: 'textfield',
                        id   : 'locationField',
                        placeHolder: 'Street, City?'
                    },
                    {
                        xtype: 'textfield',
                        id   : 'itemField',
                        placeHolder: 'What did you buy?'
                    },
                    {
                        xtype: 'textfield',
                        id   : 'priceField',
                        placeHolder: 'How much did you pay?'
                    },
                    {
                        xtype: 'textareafield',
                        id   : 'statusmsgField',
                        maxRows: 4,                        
                        placeHolder: 'Message?'
                    },
                    {
                        xtype: 'autocompletefield',
                        id   : 'categoryField',                         
                        autoComplete :false,  
                        clearIcon:true,
                        autoCorrect:false,
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
                            itemTpl: '{name}',
                            onFocus: function() {
                                pnl = Ext.getCmp('runForm');
                                scr = pnl.getScrollable().getScroller();
                                scr.scrollTo(0,450); 
                            }
                        }
                    }                    
                ]
            },
            {
                xtype: 'button',
                text: 'Add Kharidy',
                ui: 'facebook',
                id: 'addKharidyButton'
            }
        ]
    }
});

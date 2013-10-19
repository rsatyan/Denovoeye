/**
 * This screen is displayed once a user has logged in to Facebook and authorized our app.
 */
Ext.define('kharidy.view.Main', {
    extend: 'Ext.Container',
    xtype:'main',
    requires: [
        'kharidy.view.run.List',
        'kharidy.view.NoFriends'
    ],

    config: {
        layout: 'card',

        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                id: 'mainToolbar',
                cls: 'jogToolbar',
                items: [
                    {   xtype: 'spacer'   },         
                    {
                        xtype: 'button',                        
                        ui:'kharidy',
                        iconCls: 'signoutBtn',
                        id: 'signout'
                    },           
                    {
                        xtype: 'button',            
                        ui:'kharidy',        
                        enableToggle: true,
                        iconCls:'searchFormBtn',                        
                        itemId: 'searchButton'
                    },
                    {
                        xtype: 'button',
                        iconCls: 'showFormBtn',
                        ui:'kharidy',                        
                        id: 'showFormButton'
                    }/*,
                    {
                        xtype: 'button',
                        iconCls: 'notifyFormBtn',
                        ui:'kharidy',                        
                        id: 'showNotifyButton'
                    }                                        
                    {
                        xtype: 'component',
                        cls: 'fbProfilePic',
                        id: 'fbProfilePic',
                        tpl: '<img src="https://graph.facebook.com/{profileId}/picture?type=square" />'
                    }
                    */
                ]
            }
        ]
    },

    initialize: function() {
        this.callParent();

        // Enable the Tap event on the profile picture in the toolbar, so we can show a logout button
        var meta = Ext.getCmp('signout');
        if (meta) {
            meta.element.on('tap', function(e) {
                meta.fireEvent('tap', meta, e);
            });
        }
    }
});

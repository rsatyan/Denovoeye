/**
 * The Form that is shows when a user wants to add a new Run to the database.
 */
Ext.define('kharidy.view.Comment', {
    extend: 'Ext.form.Panel',
    xtype:'commentform',
    requires: [
        'Ext.form.FieldSet'
    ],

    config: {

    	title:'Comment',
        padding: '15 15 15 15',
        scrollable: true,

        items: [
        	{
 				docked: 'top',
                xtype: 'toolbar',
                title: 'Comment',
                cls:'kharidyBar',
                items: [
                    {
                        xtype: 'button',                        
                        iconCls:'backBtn',   
                        ui:'kharidy',
                        itemId: 'addCommentBackBtn'
                    }
                ]
        	},
            {
                xtype: 'fieldset',
                items: [          
                    {
                        xtype:'textareafield',
                        maxRows: 4,                        
                        itemId:'commentfield'                       
                    }   
        		]
        	},
        	{
        		xtype:'button',
        		text:'Add Comment',
        		itemId : 'commentpost'
        	}
        ]
    } 	
});
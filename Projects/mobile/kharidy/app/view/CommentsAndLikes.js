
Ext.define('kharidy.view.CommentsAndLikes', {

    extend: 'Ext.TabPanel',
    xtype:'commentsandlikes',
    requires: [
        'Ext.form.FieldSet'
    ],

    config: {
        fullscreen: true,        
        tabBar: { 
            layout: { pack: 'center' },
            ui:'gray'
        },
        items: [
            {
                docked: 'top',
                xtype: 'toolbar',  
                cls:'kharidyBar',
                title: 'Comment',
                items: [
                    {                    
                        xtype: 'button',                        
                        iconCls:'backBtn',   
                        ui:'kharidy',                     
                        itemId: 'likesCommentBackBtn'
                    },
                    {   xtype: 'spacer'   },         
                    {
                        xtype: 'button',
                        iconCls: 'showFormBtn',
                        ui:'kharidy',
                        itemId:'replyToComment'
                    }
                ]
            },            
            {
                xtype:'list',
                title:'Comments',
                cls:'comments-list',
                disableSelection: true,
                itemTpl:Ext.create('Ext.XTemplate',
                 '<div>',
                 '  <img class="user-picture" src="https://graph.facebook.com/{profileId}/picture?type=square" />',
                 '  <div class="user-name">{name}</div>',
                 '  <div class="content">{message}</div>',
                 '  <div class="creation-time">{[this.timeAgoInWords(values.createdAt)]}</div>',
                 '</div>',
                 {
                    timeAgoInWords: function(date) {
                        try {

                            var now = Math.ceil(Number(new Date()) / 1000),
                                dateTime = Math.ceil(Number(date) / 1000),
                                diff = now - dateTime,
                                str;

                            if (diff < 0) diff = -diff;

                            if (diff < 86400) {
                                return 'Today';
                            } else if (diff < 60*60*24*365) {
                                str = String(Math.ceil(diff / (60 * 60 * 24)));
                                return str + (str == "1" ? ' day' : ' days') + ' ago';
                            } else {
                                return Ext.Date.format(new Date(date), 'jS M \'y');
                            }
                        } catch(e) {
                            return '';
                        }
                    }
                }),
                emptyText: 'No comments found, be the first one to comment!',
                store:'Comments'
            },
            {
                xtype: 'list',
                title:'Likes',
                cls:'likes-list',
                disableSelection: true,
                itemTpl:Ext.create('Ext.XTemplate',
                 '<div>',
                 '  <img class="user-picture" src="https://graph.facebook.com/{profileId}/picture?type=square" />',
                 '  <div class="user-name">{name}</div>',                 
                 '</div>'),
                 emptyText: 'No likes found, be the first one to like!',
                 store:'Likes'
            }
        ]
    }
});
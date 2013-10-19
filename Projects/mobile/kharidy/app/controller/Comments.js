/**
 * The class controls the adding of new Runs to the database.
 */
Ext.define('kharidy.controller.Comments', {
    extend: 'Ext.app.Controller',

    config: {

        refs : {

        	addCommentBackBtn:'commentform #addCommentBackBtn',
            commentPost:'commentform #commentpost',
            commentfield:'commentform #commentfield',
            commentPostView :'commentform',
            likesCommentBackBtn: 'commentsandlikes #likesCommentBackBtn',
            replytocomment:'commentsandlikes #replyToComment'

        },

        control:{

        	addCommentBackBtn : {
                tap : 'hideCommentForm'
            },

            commentPost : {
                tap:'postComment'
            },

            likesCommentBackBtn: {
                tap:'hidelikesAndComments'
            },

            replytocomment: {
            	tap:'addComment'
            }

        }

    },


    addComment: function() {
    	this.reply = true;
    	tc = kharidy.app.getController('Transactions');
		tc.showComment();
    },

	hidelikesAndComments: function() {

        Ext.Viewport.animateActiveItem(Ext.getCmp('main'),
                {type: 'slide', direction: 'right'});

        //Ext.Viewport.setActiveItem(Ext.getCmp('main'));
        Ext.getCmp('viewcommentandlike').hide();
    },    

    hideCommentForm: function() {

    	if(this.reply)
    	{
    		console.log('xxx'+this.reply);
			Ext.Viewport.animateActiveItem(Ext.getCmp('viewcommentandlike'),
                {type: 'slide', direction: 'right'});

			this.reply = false;

    	} else {
        	Ext.Viewport.animateActiveItem(Ext.getCmp('main'),
                {type: 'slide', direction: 'right'});
        }
     
        Ext.getCmp('commentForm').hide();
    },

    postComment: function() {
    
        dataid = kharidy.app.getController('Transactions').dataid;

        Ext.Ajax.request({
            url: '/comment/' + dataid,
            method: 'POST',
            params: { 
                message:this.getCommentfield().getValue()
            },
            success: function(o, r, n){
                console.log(o);
            },
            callback: function(message) {               
               if(message.success){
                    Ext.Viewport.setActiveItem(Ext.getCmp('main'));
                    Ext.getCmp('commentForm').hide();
                    Ext.getStore('Transactions').load();
               }
            },
            scope: this
        });      
    }

});

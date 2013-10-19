/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'kharidy': 'app'
});
//</debug>

Ext.application({
    name: 'kharidy',

    api: 'http://secret-escarpment-9934.herokuapp.com/',

    requires: [
        'Ext.MessageBox',
        'kharidy.util.Util'
    ],

    models: [
        'Transaction',
        'Category',
        'Comments',
        'Likes',
        'Merchant'
    ],

    views: [
        'Main',
        'Form',
        'Login',
        'Comment',
        'CommentsAndLikes',
        'SearchBar',
        'SortBar',

        'business.Merchant',
        'business.Business',
        'business.MerchantView',
        'business.MerchantInfo',
        'business.MerchantPurchases',

        'util.Fileup',
        'util.Rating',
        'util.AutocompleteField',
        'util.Slidenavigation'
    ],

    controllers: [
        'Facebook',
        'Transactions',
        'Business',
        'Comments'        
    ],

    stores: [
        'Category',
        'Transactions',
        'Search',
        'Comments',
        'Likes',
        'Popular',
        'Location',
        'Merchant'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {

        // Initialize the main view
        this.facebookAppId = '203519769808871';

        if (this.facebookAppId === '') {
            Ext.create('Ext.Component', {
                fullscreen: true,
                padding: 20,
                html: [
                    'Shit out of luck sunny!'
                ].join('')
            });
        }

    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

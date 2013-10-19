/**
 * Handles Facebook interactions, specifically Login and Logout.
 *
 * When a user logs in, we display their profile picture and a list of Runs.
 */
Ext.define('kharidy.controller.Facebook', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.MessageBox'],

    config: {
        control: {
            '#signout': {
                tap: 'onUserTap'
            },
            '#logoutButton': {
                tap: 'logout'
            }
        }
    },

    /**
     * Load the Facebook Javascript SDK asynchronously
     */
    init: function() {

        window.fbAsyncInit = Ext.bind(this.onFacebookInit, this);

        (function(d){
            var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "https://connect.facebook.net/en_US/all.js";
            d.getElementsByTagName('head')[0].appendChild(js);
        }(document));
    },

    onFacebookInit: function() {
        

        if (kharidy.app.facebookAppId === '') {
             Ext.Logger.error('No Facebook Application ID set.');
            return;
        }

        FB.init({
            appId  : kharidy.app.facebookAppId,
            cookie : true,
            frictionlessRequests: true
        });

        var me = this;
        me.hasCheckedStatus = true;

        FB.Event.subscribe('auth.logout', function() { //Ext.bind(me.onLogout, me));
                if(me.hasCheckedStatus){
                    //me.fireEvent('logout');
                    me.onLogout();
                }
        });

        FB.getLoginStatus(function(response) {
            
            clearTimeout(me.fbLoginTimeout);

            me.hasCheckedStatus = true;
            Ext.Viewport.setMasked(false);

            // Destroy the #appLoadingIndicator element
            //Ext.fly('appLoadingIndicator').destroy();
            //Ext.get('splashLoader').destroy();
            //Ext.get('rwf-body').addCls('greyBg');
            Ext.get('loading').destroy();

            if (response.status == 'connected') {
                me.onLogin();
            } else {
                me.login();
            }
        });

        me.fbLoginTimeout = setTimeout(function() {

            Ext.Viewport.setMasked(false);

            Ext.create('Ext.MessageBox', {
                title: 'Facebook Error',
                message: [
                    'Facebook Authentication is not responding. ',                    
                    'Please check your network and try again.'
                ].join('')
            }).show();

        }, 10000);
    },

    login: function() {
        Ext.Viewport.setMasked(false);
        var splash = Ext.getCmp('login');
        if (!splash) {
            Ext.Viewport.add({ xclass: 'kharidy.view.Login', id: 'login' });
        }
        Ext.getCmp('login').showLoginText();
    },

    onLogin: function() {

        var me = this,
            errTitle;

        FB.api('/me', function(response) {

            if (response.error) {
                FB.logout();

                errTitle = "Facebook " + response.error.type + " error";
                Ext.Msg.alert(errTitle, response.error.message, function() {
                    me.login();
                });
            } else {
                kharidy.userData = response;
                kharidy.app.userData = kharidy.userData;
                if (!me.main) {
                    me.main = Ext.create('kharidy.view.Main', {
                        id: 'main'
                    });
                }                
                Ext.Viewport.setActiveItem(me.main);
                Ext.getStore('Transactions').load();
            }
        });
    },

    logout: function() {
        Ext.Viewport.setMasked({xtype: 'loadmask', message: 'Logging out...'});
        FB.logout();
    },

    /**
     * Called when the Logout button is tapped
     */
    onLogout: function() {

        if (!this.hasCheckedStatus) return;

        this.login();

        Ext.Viewport.setMasked(false);
        Ext.Viewport.setActiveItem(Ext.getCmp('login'));
        Ext.getStore('Transactions').removeAll();

        this.logoutCmp.destroy();
    },

    /**
     * When the user profile picture is tapped, create a Logout button and pop it up next to the
     * avatar.
     */
    onUserTap: function(cmp) {

        if (!this.logoutCmp) {
            this.logoutCmp = Ext.create('Ext.Panel', {
                width: 120,
                top: 0,
                left: 0,
                padding: 5,
                modal: true,
                hideOnMaskTap: true,
                items: [
                    {
                        xtype: 'button',
                        id: 'logoutButton',
                        text: 'Logout',
                        ui: 'decline'
                    },
                    {
                        xtype:'button',
                        id:'notifications',
                        text:'Notifications'
                    }
                ]
            });
        }

        this.logoutCmp.showBy(cmp);
    }
});


Ext.define('kharidy.view.Login', {
    extend: 'Ext.Container',
    xtype:'login',
    config: {
        padding: 20,
        layout: 'fit',
        cls:'loggedOut',

        items: [
            {
                xtype: 'container',
                cls: 'loginScreen',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },                
                items : [
                    {       
                        cls:'logintext',                 
                        html: 'You will be asked for permission to access your facebook account; data will be accessed solely for display to you in Kharidy. <br><br>Our privacy policy is available at <a class="ppolicy" href="#">Privacy Policy</a>'                        
                    },
                    {
                        xtype: 'button',
                        text: 'Login with Facebook',
                        id: 'fbLogin',
                        cls: 'fbLogin',
                        handler:function() {

                            var redirectUrl = Ext.Object.toQueryString({
                                redirect_uri: window.location.protocol + "//" + window.location.host + window.location.pathname,
                                client_id: kharidy.app.facebookAppId,
                                response_type: 'token'
                            });

                            flink = 'https://m.facebook.com/dialog/oauth?' + redirectUrl
                            window.location.href = flink;                         
                        }                  
                    },
                    {
                        xtype:'button',
                        cls:'registermerchant',                        
                        text:'Business Owner?',
                        id:'businessowner'                     
                    }            
                ]
            }
        ]
    },

    
    showLoginText: function() {    
        this.setHtml([
            '<div class="fb-facepile" data-app-id="' + kharidy.app.facebookAppId + '" data-max-rows="2" data-width="300"></div>'
        ].join(''));

         FB.XFBML.parse(document.getElementById('splash'));
    }
    
});
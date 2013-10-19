    Ext.define('kharidy.view.business.Business', {
    extend: 'Ext.Container',
    xtype: 'business',    

    config: {               
        //padding: '15 15 15 15',        
        fullscreen: true,
        layout: 'vbox',             
        style: 'background:white',
        items : [    
            {
                docked: 'top',
                xtype: 'toolbar',
                title:'Business Owners',             
                cls:'kharidyBar',
                items: [
                    {
                        xtype: 'button',                        
                        iconCls:'backBtn',   
                        ui:'kharidy',                     
                        id: 'closeBusiness'
                    }                    
                ]
            },
  
            {                            
                xtype : 'panel',                          
                flex : 2,                            
                scrollable: {
                    direction: 'vertical',
                    directionLock: true,
                    indicators: false
                },
                styleHtmlContent:true,
                html: "<h3>The Easiest Way to Grow Your business</h3>" 
                +   "<p >You have the control to completely tailor a campaign to fit your unique business needs, whether you want to reach new customers up front or bring in a steady flow of customers over time.</p>" 
                +   "<h3>You Get Advertising That Actually Works and Makes You Money</h3>" 
                +   "<p>Radio, print, TV, billboards—nothing delivers customers with the speed, reach, and power of a Kharidy campaign.</p>"
                +   "<h3>Your Business Gets Talked About</h3>"  
                +   "<p>Kharidy promotes what’s great about your business to thousands of prospective customers. Your new customers sing your praises on Kharidy, recommend your business via likes and comments, and users bring friends along.  That's not something you see with newspaper or radio ads.</p>"                                 
                +   "<h3>Your Business Gets the Spotlight</h3>" 
                +   "<p>Just using Kharidy increases community awareness of your business. And it puts you in the most positive light.</p>"
                +   "<h3 style='color:#653f99'> Register now to get started!</h3>"                        
            },
            {
                xtype:'panel',
                layout:'hbox',    
                style: 'background:#f6f6f6',                    
                defaults : {
                    xtype:'button',
                    flex:1,
                    margin:15    
                },
                items : [
                    {
                        height:40,                                
                        text:'Register',                                
                        action:'onBusinessRegister'
                    }/*,
                    {                                                            
                        height:40,
                        ui:'kharidy',
                        text:'Login',
                        action:'onBusinessLogin'
                    }*/
                ],                        
                docked: 'bottom',                    
                height: 80,
                flex: 1
            }            
        ]
    }    
});

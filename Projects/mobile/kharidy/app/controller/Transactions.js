/**
 * The class controls the adding of new Runs to the database.
 */
Ext.define('kharidy.controller.Transactions', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.device.Camera'
    ],

    config: {

        refs : {
            addKharidyCameraBtn : 'mainform #addKharidyCameraBtn',
            addLocationBtn : 'mainform #addLocationBtn',
            map:'mainform #map',
            photo : 'mainform #photo',
            photoFieldSet : 'mainform #photoFieldSet',
            mainList : 'mainlist',
            sortBar: 'kharidySortBar',
            searchBar: 'kharidySearchBar',
            searchButton: 'main #searchButton',
            locationMap : 'mainlist #locationMap',
            merchantInfo: 'merchantview merchantInfo',     
            merchantPurchases: 'merchantview merchantPurchases'    
        },

        control: {              

            '#businessowner' : {
                tap:'OnShowBusiness'
            },
           
            '#addKharidyButton': {
                tap: 'addKharidy'
            },
            '#showFormButton': {
                tap: 'showForm'
            },
            '#addKharidyBackBtn': {
                tap: 'hideForm'
            },                    

            '#sortBy': {
                toggle: 'onSortToggle'
            },

            '#searchField': {
                action: 'onSearch',
                change: 'onSearch',
                clearicontap: 'onSearchClear'
            },

            addLocationBtn : {
                tap:'checkIn'
            },


            addKharidyCameraBtn: { 
                success: 'onPhotoUploadSuccess',
                failure: 'onPhotoUploadFailure'    
            },

            mainList: {
                itemtap:'onListTapped'
            },

            searchButton: {
                tap:'onSearchButton'
            },

            '#runForm' : {
                activate :'onRunActivate'
            }
        }
    },   


    onRunActivate: function () {
        console.log("Run activated!");
    },

    OnShowBusiness:function() {
    
        if(!this.showBusinessOwner) {
            this.showBusinessOwner = Ext.create('kharidy.view.business.Business', {
                id: 'showBusinessOwner'  
            });
        }        

        Ext.Viewport.animateActiveItem(this.showBusinessOwner,
            {type: 'slide', direction: 'left'});             
    },

    onSortToggle: function(segBtn, btn, isPressed){
                
        if(isPressed){
        
            var index = segBtn.getItems().indexOf(btn);
            toggle = btn.getText();            
        
            this.getMainList().setMasked({ xtype: 'loadmask' });

            if(index == 0){                
                var map = this.getMainList().down('#locationMap');
                if(!map.getHidden()) map.hide();
                
                this.getMainList().setStore(Ext.getStore('Transactions'));
                this.getMainList().setMasked(false);                

            } else if (index == 1){
                
                var map = this.getMainList().down('#locationMap');
                if(!map.getHidden()) map.hide();

                var searchStore = Ext.getStore('Popular');
                searchStore.load({                
                    callback: function() { 
                        this.getMainList().setStore(searchStore);
                        this.getMainList().setMasked(false);
                    },
                    scope: this 
                });
            } else if (index == 2) {

                // Wishlist 

                
                /*
                var searchStore = Ext.getStore('Location');
                Ext.device.Geolocation.getCurrentPosition({
                    success: function(position) { 
                        var coords  = position.coords.latitude+","+position.coords.longitude;
                        var map = this.getMainList().down('#locationMap');
                        map.setSrc('http://maps.googleapis.com/maps/api/staticmap?center='+ coords + "&zoom=15&size=340x120&sensor=false&markers=color:navy|" + coords);
                        if(map.getHidden()){
                            map.show({type: 'fade'});
                        }
                        searchStore.load({        
                            params: { geo: coords },        
                            callback: function() {
                                this.getMainList().setStore(searchStore);
                                this.getMainList().setMasked(false);
                            },
                            scope: this
                        });

                    },
                    failure: function() {
                        console.log('Could not get device location!');
                    },
                    scope: this
                });
                */           
            }
        }
    },


    onSearchButton : function() {        
        var bar = this.getMainList().down('kharidySearchBar');
         if(bar.getHidden()){
            bar.show({type: 'fade'});
        }else{
            bar.hide();
        }
    },

    onSearch: function(searchField) {

        var searchStore = Ext.getStore('Search'),
            value = searchField.getValue();

        if (value != '') {
            this.getMainList().setMasked({ xtype: 'loadmask' });
            searchStore.load({
                params: { q: searchField.getValue() },
                callback: function() {
                    this.getMainList().setStore(searchStore);
                    this.getMainList().setMasked(false);
                },
                scope: this
            });
        }
    },

    onSearchClear: function() {
        this.getMainList().setStore(Ext.getStore('Transactions'));
    },    

    onListTapped:function(list, index, element, record, evt){

         this.dataid = record.data._id;

         setTimeout(function(){list.deselect(index);},500);

         if(evt.getTarget('.like-count')) {
                list.setMasked({ xtype: 'loadmask' });
                Ext.Ajax.request({
                    url: '/like/' + record.data._id,
                    method: 'POST',
                    success: function(o, r, n){
                       console.log("ok");
                    },
                    callback: function(message) {                       
                       if(message.success){                                        
                         Ext.getStore('Transactions').load();
                       }                 
                    },
                    scope: this
                });  
         } else if(evt.getTarget('.comment-count')) {
            //Comment
            this.showComment();

         } else if(evt.getTarget('.view-count')) { 
            // View 
            if(!this.viewCommentAndLikes) {
                this.viewCommentAndLikes = Ext.create('kharidy.view.CommentsAndLikes', {
                    id: 'viewcommentandlike'  
                });
            }

            this.loadStores(this.dataid);  

            Ext.Viewport.animateActiveItem(this.viewCommentAndLikes,
                {type: 'slide', direction: 'left'});            
         } else if ( evt.getTarget('.merchant')) {

            //list.setMasked({ xtype: 'loadmask' });
            merchantId = record.data.merchantId;
            merchantName = record.data.name;
            this.showMerchantRating(merchantId,merchantName,list);            

         } else if ( evt.getTarget('.location')) {
            
           // TODO: Need to show something different 

         } else if ( evt.getTarget('.wish-count')) {
            list.setMasked({ xtype: 'loadmask' });
            Ext.Ajax.request({
                url: '/wishlist/' + record.data._id,
                method: 'POST',
                success: function(o, r, n){
                   console.log("ok");
                },
                callback: function(message) {                       
                   if(message.success){
                     console.log("ok");
                     list.setMasked(false);                     
                   }                 
                },
                scope: this
            }); 
        }
    },


    showMerchantRating: function(merchid,merchantName,list) {

        Ext.Viewport.setMasked({
            xtype:'loadmask',
            message:'Retreiveing business details..'
        });

        // Merchant Rating
        if (!this.merchantRating) {
            this.merchantRating = Ext.create('kharidy.view.business.MerchantView', {
                id: 'merchantview',merchantId : merchid
            });
        }      

        stor = Ext.getStore('Merchant');
        stor.setProxy({ url:'/merchant/' + merchid + '/' + merchantName, noCache: false} );
        stor.load({                
            callback: function(record, options, success) {
                if(record) {
                    if(record.length > 0) {
                        this.getMerchantInfo().setRecord(record[0]);                
                        this.getMerchantPurchases().setStore(record[0].purchasesStore);
                        Ext.Viewport.setMasked(false);
                        Ext.Viewport.animateActiveItem(this.merchantRating,
                            {type: 'slide', direction: 'left'});
                        
                    }
                }
                Ext.Viewport.setMasked(false);
            },
            scope: this 
        });                
                     
    },

    showComment:function() { 

        //Comment
        if (!this.addCommentForm) {
            this.addCommentForm = Ext.create('kharidy.view.Comment', {
                id: 'commentForm'
            });
        }            
        Ext.Viewport.animateActiveItem(this.addCommentForm,
                {type: 'slide', direction: 'left'});

    },

    loadStores: function(id) { 


        commentStore = Ext.getStore('Comments');
        likeStore = Ext.getStore('Likes');

        commentStore.setProxy({ url:'/comments/' + id, noCache: false} );
        likeStore.setProxy({ url:'/likes/' + id, noCache: false} );

        commentStore.load();
        likeStore.load();
    },

    init: function() {
        this.callParent();        
        Ext.getStore('Transactions').on('load', this.onRunsLoad);
    },


    checkIn: function(){
        kharidy.app.lat = 0; kharidy.app.lon =0;
        Ext.device.Geolocation.getCurrentPosition({
            success: function(position) {
                kharidy.app.lat = position.coords.latitude;
                kharidy.app.lon = position.coords.longitude;                                
                //gapi = 'http://maps.googleapis.com/maps/api/staticmap?center='+ kharidy.app.lat + "," + kharidy.app.lon + "&zoom=15&size=300x120&sensor=false&markers=color:navy|" + kharidy.app.lat + "," + kharidy.app.lon;                                
                //this.getMap().setSrc(gapi);                
            },
            failure: function() {
                console.log('something went wrong!');
            }
        });
    },

    onPhotoUploadFailure: function(message) {
        console.log("here");
    },

    onPhotoUploadSuccess: function(message){
        if(message.success) {
            Ext.getCmp('imageField').setValue(message.url);
            this.getPhoto().setSrc(message.url);          
            this.getPhoto().setHidden(false);    
            this.getPhotoFieldSet().setHidden(false);    
        }
    },

    onRunsLoad: function(store) {
        
        Ext.getStore('Category').load();

        var main = Ext.getCmp('main'),
            runList = Ext.getCmp('runList'),
            noFriends = Ext.getCmp('noFriends');

        if (store.getCount()) {
            if (!runList) {
                runList = Ext.create('kharidy.view.run.List', {
                    id: 'runList'
                });
            }
            main.setActiveItem(runList);
        } else {
            if (!noFriends) {
                noFriends = Ext.create('kharidy.view.NoFriends', {
                    id: 'noFriends',
                    data: kharidy.userData
                });
            }
            main.setActiveItem(noFriends);
        }
    },

    showForm: function() {
        if (!this.addRunForm) {
            this.addRunForm = Ext.create('kharidy.view.Form', {
                id: 'runForm'
            });
        }
        this.checkIn();
        Ext.Viewport.animateActiveItem(this.addRunForm,
                {type: 'slide', direction: 'left'});
    },



    hideForm: function() {        
        Ext.Viewport.animateActiveItem(Ext.getCmp('main'),
                {type: 'slide', direction: 'right'});
        Ext.getCmp('runForm').hide();
    },

    addKharidy: function() {        

        var location = Ext.getCmp('locationField').getValue(),
            item = Ext.getCmp('itemField').getValue(),
            category = Ext.getCmp('categoryField').getValue(),
            statusmsg = Ext.getCmp('statusmsgField').getValue(),
            image  =  Ext.getCmp('imageField').getValue(),
            merchant  = Ext.getCmp('merchantField').getValue(),
            caption = kharidy.userData.first_name + ' made a kharidy for ' + price ;
            geo = kharidy.app.lat +',' + kharidy.app.lon,
            rating = Ext.getCmp('merchantRating').getValue(),
            businessId = Ext.getCmp('merchantId').getValue();            
        
        // convert string like 10k to number
        var price = this.parseNumber(''+Ext.getCmp('priceField').getValue());
        if (location) {
            caption += ' in ' + location;
        }

        Ext.getCmp('runForm').setMasked({
            xtype: 'loadmask',
            message: 'Adding New Kharidy!...'
        });

        Ext.Ajax.request({
            url: '/kharidy',
            method: 'POST',
            params: {
                location: location,
                price: price,
                item:item,
                statusmsg:statusmsg,
                category:category,
                merchant:merchant,
                image:image,
                geo:geo,
                rating:rating,
                businessId:businessId      
            },
            callback: this.onAddRun,
            scope: this
        });
        
    },

    onAddRun: function(options, success, response) {
        Ext.getCmp('runForm').setMasked(false);
        this.hideForm();
        Ext.getStore('Transactions').load();
    },

    // Utils


    is_numeric:function(string) {
        for(var i = 0; i < string.length; i++) {
            if(string.charAt(i) < '0' || string.charAt(i) > '9') {
                return false;
            }
        }
        return true;
    },

    charValueMultiplier:function(letter) {
        switch(letter) {
            case 'M':
            case 'm': return 1000000;
            case 'k':
            case 'K': return 1000;
            default: return 0;
        }
    },

    // parse string like 1.5M or 10k and return the number
    parseNumber: function (string) {
        string = string.replace(/ /g, ''); // remove spaces
        var total           = 0;
        var partial         = 0;
        var partialFraction = 0;
        var fractionLength  = 0;
        var isFraction      = false;

        // process the string; update total if we find a unit character
        for(var i = 0; i < string.length; i++) {
            var c = string.substr(i, 1);
            if(c == '.' || c == ',') {
                isFraction = true;
            }
            else if(this.is_numeric(c)) {
                if(isFraction) {
                    partialFraction = partialFraction * 10 + parseInt(c, 10);
                    fractionLength++;
                }
                else {
                    partial = partial * 10 + parseInt(c, 10);
                }
            }
            else {
                total += this.charValueMultiplier(c) * partial + this.charValueMultiplier(c) * partialFraction / Math.pow(10, fractionLength);

                partial         = 0;
                partialFraction = 0;
                fractionLength  = 0;
                isFraction      = false;
            }
        }

        return Math.round(total + partial + partialFraction / Math.pow(10, fractionLength));
    }



});


Ext.define('kharidy.view.run.List', {
    extend: 'Ext.List',
    requires: [
        'Ext.form.Panel',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh',
        'kharidy.view.SearchBar',
        'kharidy.view.SortBar'
    ],
    xtype:'mainlist',
    config: {
        store: 'Transactions',
        cls:'news-feed',
        plugins: [
         { xclass: 'Ext.plugin.PullRefresh' }
        ],
        disableSelection: true,
        selectedItemCls:'',
        pressedCls:'',
        items: [
            { xtype: 'kharidySortBar' , docked:'top'},
            { xtype: 'kharidySearchBar' , docked:'top' , hidden:true},
            { xtype: 'image', 
              style: 'background-repeat: no-repeat;background-size: auto 100%;background-position: center',
              width: '100%',
              height: '120px',
              docked:'top',
              itemId:'locationMap', 
             hidden:true}           
        ],
        itemTpl: Ext.create('Ext.XTemplate',
            '<div class="story"><div class="frame">',
                '<img height="35px" height="35px" class="story-profile-picture" src="https://graph.facebook.com/{profileId}/picture?type=square" />',
                '<div class="story-title">',
                '   <div class="inner">', 
                '    <div class="story-title-actor">{name} <span style="color:gray"> at <span class="merchant" style="color:black">{merchant}</span> in <span class="location" style="color:black">{location}</span></span></div>',
                '    <div class="story-title-description"></div>',
                '   </div>',
                '</div>',    
                '<div class="story-creation-time">{[this.timeAgoInWords(values.date)]}</div>',
                '<div class="story-body">',
                '   <div class="inner">', 
                    '<div class="story-message"><p>Paid Rs.<b>{price}</b> for {item}</p><p>{statusmsg}</p></div>',
                    '<div class="story-attachment has-attachment">',
                    ' <div class="inner">',
                    '  <tpl if="image.length &gt; 0">',
                    '    <div class="attached-photo sized image" ',
                    '       style="width:300px; height: 220px; background-image: url({image});">',
                    '    </div>',
                    '  </tpl>',
                    ' </div>',
                    '</div>',
                 '</div>',
                '</div>',
                '<div class="story-actions">',
                ' <div class="inner">', 
                    '<div class="like-count actbtn">{[values.likes.length]}</div>',
                    '<div class="comment-count actbtn">{[values.comments.length]}</div>',
                    '<tpl if="likes.length &gt; 0 || comments.length &gt; 0">',
                    '  <div class="view-count actbtn">View</div>',
                    '</tpl>',
                    '<tpl if="profileId == kharidy.app.userData.id">',
                    '<tpl else>',
                    '   <div class="wish-count actbtn">Wishlist</div>',
                    '</tpl>',
                 '</div>',   
                '</div>',                
            '</div></div>',
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
                },

                abbrNum:function(n,d){x=(''+n).length,p=Math.pow,d=p(10,d)
                    x-=x%3
                    return Math.round(n*d/p(10,x))/d+" kMGTPE"[x/3]
                }
            }
        ),

        emptyText: 'Make some kharidy, then invite your friends!'
    }
});

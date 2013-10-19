Ext.define('kharidy.view.business.MerchantInfo', {

	extend: 'Ext.Container',
	xtype: 'merchantInfo',

	config: {
		cls: 'merchantInfo',
		tpl: [
			'<div class="header">',
				'<div class="logo" style="background:url(resources/images/storelogo.png) no-repeat center center;"></div>',
				'<h3 class="name">{name}</h3>',
				'<h4 class="addr">{address1} {address2} {city} {state}</h4>',				
				'{[this.getRating(values.rating_avg,values.rating_count)]}',
			'</div>',
			{
				getRating : function(rating,totalcnt){
					return kharidy.util.Util.getRating(rating,5,false,totalcnt);
				}	
			}
		]
	}
});
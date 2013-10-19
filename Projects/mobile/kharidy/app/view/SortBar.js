Ext.define('kharidy.view.SortBar', {

	extend: 'Ext.Toolbar',
	xtype: 'kharidySortBar',

	config: {

		cls: 'sortB',
		id: 'sortContainer',
		//style: 'visibility: hidden',

		items: [
			{
				xtype: 'segmentedbutton',
				id: 'sortBy',
				flex: 1,

				layout: {
					pack: 'center'
				},

				defaults: {
		    		xtype: 'button',
		    		flex: 1
				},

				items: [
		    		{ text: 'Feed', pressed: true },
		    		{ text: 'Popular' },
		    		{ text: 'Wishlist' }
				]
			}
		]
	}
});
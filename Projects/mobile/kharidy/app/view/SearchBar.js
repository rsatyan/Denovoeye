
Ext.define('kharidy.view.SearchBar', {

	extend: 'Ext.form.Panel',
	xtype: 'kharidySearchBar',

	config: {

    	scrollable: false, // Override the form panel
    	//style: 'visibility: hidden',
        cls: 'searchBar',
        id: 'searchContainer',

        items: [
        	{
        		xtype: 'textfield',
        		clearIcon: true,
        		labelWidth: 0,
		        inputCls: 'searchField',
        		placeHolder: 'Search for ?',
        		id: 'searchField'
        	}
        ]
	}
});
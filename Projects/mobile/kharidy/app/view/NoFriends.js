/**
 * This screen is displayed if the user has no friends.
 */
Ext.define('kharidy.view.NoFriends', {
    extend: 'Ext.Container',

    config: {
        cls: 'noFriends',
        tpl: [
            '<div class="welcomeNoFriends">',
                '<img src="https://graph.facebook.com/{id}/picture?type=square" />',
                '<p>Welcome to Kharidy with Friends, <b>{first_name}</b>!</p>',
            '</div>'
        ]
    }
});

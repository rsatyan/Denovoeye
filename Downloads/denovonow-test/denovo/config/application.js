var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy  = require('passport-twitter').Strategy
  , LocalStrategy    = require('passport-local').Strategy
  , WithingsStrategy = require('passport-withings').Strategy
  , FitbitStrategy   = require('passport-fitbit').Strategy
  , RunKeeperStrategy= require('passport-runkeeper').Strategy
  , cors = require('cors')
  , GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

var fs = require('fs')
var CONFIG = require('config')
global._ = require('underscore')
var bcrypt = require('bcrypt-nodejs')

var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {

        User.find({provideruid:profile.id.toString()}, function (err, user) {
        
            if (user) {
                return done(null, user);
            } else {

                User.create({
                    provider     : profile.provider,
                    provideruid  : profile.id.toString(),
                    name         : profile.displayName,
                    activated    : "Y",
                    user_level   :1,
                    rewardpoints : 0,
                    challengesCompleted : 0,
                    pointsDonated : 0
                }).done(function (err, user) {
                        if (err) {
                            console.log(user);
                            throw err;
                        }
                        return done(null, user);
                    });
            }
        })
    })
};


passport.serializeUser(function (user, done) {
    console.log("passport.serializeUser : "+user);
    done(null, user.id);
});

passport.deserializeUser(function (uid, done) { 
    console.log("passport.deserializeUser : "+uid);
    User.find({id:uid}, function(err, user) {
        done(err, user);
    });     
});

module.exports = {
	
	// Name of the application (used as default <title>)
	appName: CONFIG.APP.NAME,

    // Name of the subdomain to which sails is deployed to Nodejitsu
    host: CONFIG.APP.SUBDOMAIN,

	// Port this Sails application will live on
	port: process.env.PORT || 1337,

	// The environment the app is deployed in 
	// (`development` or `production`)
	//
	// In `production` mode, all css and js are bundled up and minified
	// And your views and templates are cached in-memory.  Gzip is also used.
	// The downside?  Harder to debug, and the server takes longer to start.
	environment: CONFIG.APP.ENV,

	// Logger
	// Valid `level` configs:
	// 
	// - error
	// - warn
	// - debug
	// - info
	// - verbose
	//
	log: {
		level: CONFIG.APP.LOGLEVEL
	},

    

    express: {
        customMiddleware: function(app)
        {

            passport.use(new FacebookStrategy({
                clientID: global.CONFIG.Facebook.CONSUMERKEY,
                clientSecret: global.CONFIG.Facebook.CONSUMERSECRET,
                callbackURL: CONFIG.APP.URL+":"+CONFIG.APP.PORT+CONFIG.Facebook.CALLBACKURL
               },
               verifyHandler
            ));


            passport.use(new TwitterStrategy({
                consumerKey: CONFIG.Twitter.CONSUMERKEY,
                consumerSecret: CONFIG.Twitter.CONSUMERSECRET,
                callbackURL: CONFIG.APP.URL+":"+CONFIG.APP.PORT+CONFIG.Twitter.CALLBACKURL
              },
              verifyHandler
            ));

            passport.use(new GoogleStrategy({
                clientID: CONFIG.Google.CONSUMERKEY,
                clientSecret: CONFIG.Google.CONSUMERSECRET,
                callbackURL: CONFIG.APP.URL+":"+CONFIG.APP.PORT+CONFIG.Google.CALLBACKURL
              },
              verifyHandler
            ));


            passport.use(new FitbitStrategy({
                consumerKey: CONFIG.FitBit.CONSUMERKEY,
                consumerSecret: CONFIG.FitBit.CONSUMERSECRET,
                callbackURL: CONFIG.APP.URL+":"+CONFIG.APP.PORT+CONFIG.FitBit.CALLBACKURL
              },
              verifyHandler
            ));



            passport.use(new LocalStrategy(function(username, password, done) {    
                process.nextTick(function () { 
                    User.find({username:username}, function (err, user) {
                        if (err) { return done(err); }
                        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
                        if (user.activated === "N") { return done(null, false, { message: ' user ' + username +' needs to be activated'}); }
                        if (!bcrypt.compareSync(password, user.password)) { return done(null, false, { message: 'Invalid password' }); }
                        return done(null, user);
                    })

                })
            }));

            app.use(passport.initialize());
            app.use(passport.session());

            app.use(function noCachePlease(req, res, next) {
                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                res.header("Pragma", "no-cache");
                res.header("Expires", 0);
                next();
            });
            
            app.use(cors())

            

        },

        // serverOptions: {
        //     key: fs.readFileSync(CONFIG.SSL.KEY),
        //     cert: fs.readFileSync(CONFIG.SSL.CERTIFICATE)
        // }
    }

};

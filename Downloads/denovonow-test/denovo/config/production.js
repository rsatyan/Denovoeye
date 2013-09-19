module.exports = {
    Facebook : {
      CONSUMERKEY    : "607446919285789",
      CONSUMERSECRET : "6ebe0e9365d755658c7172641fba7d17",
      CALLBACKURL    : "/auth/facebook/callback"
    },

    Twitter : {
      CONSUMERKEY    : "KGGhuivh8UmCRamIKOB6w",
      CONSUMERSECRET : "3yFh7QyOsrL3FeAQ9E1bJ00l0AgvPrToIjPkhK6bk",
      CALLBACKURL    : "/auth/twitter/callback"
    },

    Google : {
      CONSUMERKEY    : "79592550250.apps.googleusercontent.com",
      CONSUMERSECRET : "tVvywW7TkwgQC8T47mM5s_YQ",
      CALLBACKURL    : "auth/google/callback"
    },

    FitBit : {
      CONSUMERKEY    : "FITBIT_CONSUMER_KEY",
      CONSUMERSECRET : "FITBIT_CONSUMER_SECRET",
      CALLBACKURL    : "/auth/fitbit/callback"
    },

    Admin : {
      USERNAME : "rsatyan",
      PASSWORD : "miend0g",
      NAME : "Satyan Avatara"
    },
    Twilio : {
      TWILIO_ACCOUNT_SID : "AC8afd2e47d56657ba7b935f15d1760a63",
      TWILIO_AUTH_TOKEN : "10c60cca65d40659627fea479931727c",
      TWILIO_NUMBER : "+14025270415"
    },

    Mailer : {
      TRANSPORT_PROTOCOL : "SMTP",
      MAILER_SERVICE : "Gmail",
      USER : " denovonow.mailer@gmail.com",
      PASSWORD : "denovohealth",
      DEFAULT_FROM_ADDRESS : "Denovo Signup <noreply@denovonow.com>"
    },

    APPLE_PUSH_NOTIFICATION : {
      CERTIFICATE : "./apn-ssl/cert.pem",
      KEY : "./apn-ssl/key.pem",
      GATEWAY : "gateway.sandbox.push.apple.com"
    },

    GOOGLE_CLOUD_MESSAGING : {
      APITOKEN : "AIzaSyAkYdBhnLmG2aQbMKe2xEWcjq7AK3e7SPs"
    },

    MONGODB : {
      HOST : "linus.mongohq.com",
      URL : "mongodb://nodejitsu:7c509309023010a368567a440a37dfb6@linus.mongohq.com:10030/nodejitsudb9426908707",
    },

    APP : {
      URL : "http://denovonow-test.jit.su",
      SUBDOMAIN : 'denovonow-test.jit.su',
      NAME : "Denovo Health",
      PORT : 80,
      ENV  : "production",
      LOGLEVEL : "verbose",
    },

    SSL : {
      KEY : "./ssl/key.pem",
      CERTIFICATE : "./ssl/cert.pem"
    }
  };
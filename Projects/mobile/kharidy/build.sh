#!/bin/bash
sencha app build production
rm -rf server-side/public/resources
cp -r build/kharidy/production/ server-side/public
cd server-side
git commit -m "a" -a
git push heroku master
cd ..

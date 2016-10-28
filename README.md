# local-data-carto-shim
This is a simple node express app that acts as a shim between [Local Data](http://www.localdata.com) and Carto. It simply relays shapefile exports (which are background jobs) to Carto.

# How to use

If your LocalData survey is this:
https://app.localdata.com/#surveys/wakefield-cultural-assets-1

Then the link you should use to sync your survey data to Carto is:
https://localdata-carto-shim.herokuapp.com/wakefield-cultural-assets-1

# Deployment (probably best if you run your own infrastructure)

The easiest way to deploy is:

 1. `git clone https://github.com/MAPC/local-data-carto-shim.git`
 2. `git push heroku master`
 
Note: you'll have to set up a Heroku.com app.

# Development

The code is a bit of a sloppy Frankenstein's monster, lifting from LocalData source itself to get the polling functionality working. I think the piping could use some work since it doesn't directly stream the ZIP in the response. I'm not an expert in that technology so any help would be appreciated!

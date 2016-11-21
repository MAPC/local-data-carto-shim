var express = require('express');
var request = require('request');
var _ = require('underscore');
var fs = require('fs');

var router = express.Router();
var exportTimeout = 2 * 60 * 1000; // 2 minutes
var loading = {};
/* GET home page. */
router.get('/:surveyId', function(req, res, next) {
  var url = "https://app.localdata.com/api/slugs/" + req.params.surveyId;
  request(url, function(err, resp, body) {
    console.log(resp.statusCode);
    if (resp.statusCode == 200) {
      var surveyIdUnique = JSON.parse(body).survey;
      getShapefile(surveyIdUnique, res);      
    } else {
      res.send("error");
    }

    // res.send("Ntohing");
  });    
});

module.exports = router;

function getShapefile(id, res) {
  var url = "http://app.localdata.com/api/surveys/" + id + '/responses.csv';
  console.log(url);
  pingExport('csv', url, res);
  // util.track('survey.export.shapefile');
}

function pingExport(type, url, res) {
  var expiration = Date.now() + exportTimeout;

  // We may need to pass in some optional parameters
  var options = {};
  if(type === 'csvLatest') {
    options.latest = true;
  }

  var self = this;

  loading[type] = true;
  // this.render();

  var ping;

  function pingRaw() {
    var final_href = "";
    if (Date.now() > expiration) {
      loading[type] = false;
      self.exportDone(new Error(type + 'export timed out.'));
      return;
    }

    // See if the ping cycle has been stopped.
    if (!loading[type]) {
      return;
    }

    request(url, function (err,resp, body) {
      if (resp.statusCode === 202 && loading[type]) {
        ping();
        return;
      }
      loading[type] = false;
      // self.render();
      // window.location = data.href;
      // console.log("worked!:", body.href);

      var file = JSON.parse(body).href;
      request(file, function(err, resp, body) {
        res.set('Content-Type', 'application/csv');
        res.send(body);
      })
      

    });
  }

  ping = _.throttle(pingRaw, 500, { trailing: true });
  ping();
}

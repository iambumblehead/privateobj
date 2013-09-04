var objectmanager = require('../privateobj');
var baseconstructorVanilla = require('./baseconstructor');

var Views = module.exports = objectmanager.getNew({
  type : {
    vanilla : baseconstructorVanilla
  }
});
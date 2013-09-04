var Views = require('./privateobjmanager.js');

Views.register({ 
  name : 'ViewVanillaFive',
  type : Views.type.vanilla
}, function (view, sess) {

  view.localName = function () {
    return view.name;
  };

  view.privateName = function () {
    return (sess) ? sess.name : null;
  };

});
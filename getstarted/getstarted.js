var objectmanager = require('../objectmanager');

// create two new constructor objects,
// 
// ViewsVanilla_proto
// ViewsChocolate_proto

var ViewsVanilla_proto = (function () {
  var view = {
    sess : null,
    name : "",
    getSessName : function () {
      return this.sess.name;
    }
  };

  return {
    getNew: function (params, obj) {
      var that = Object.create(view);
      that.name = "vanilla";
      that.sess = null;
      return that;
    }
  };
}());

var ViewsChocolate_proto = (function () {
  var view = {
    sess : {},
    name : "",
    getSessName : function () {
      return this.sess.name;
    }
  };

  return {
    getNew: function (params, obj) {
      var that = Object.create(view);
      that.name = "chocolate";
      return that;
    }
  };
}());


// create an object manager, 'Views'
//
var Views = objectmanager.getNew({
  type : {
    vanilla : ViewsVanilla_proto,
    chocolate : ViewsChocolate_proto
  }
});


// construct two new objects with the object manager
//
Views.register({ 
  name : 'ViewVanillaFive',
  type : Views.type.vanilla
}, function (view, sess) {

  view.localName = function () {
    return view.name;
  };

  view.privateName = function () {
    if (sess) return sess.name;
  };

});

Views.register({ 
  name : 'ViewChocolateSix',
  type : Views.type.chocolate
}, function (view, sess) {

  view.localName = function () {
    return view.name;
  };

  view.privateName = function () {
    if (sess) return sess.name;
  };

});

var sess = { name : 'privatename' },
    chocolate = Views(sess).ViewChocolateSix(),
    vanilla = Views(sess).ViewVanillaFive(),
    unknown;




console.log('chocolate  local  name: ' + chocolate.localName());
console.log('chocolate private name: ' + chocolate.privateName());

console.log('vanilla  local  name: ' + vanilla.localName());
console.log('vanilla private name: ' + vanilla.privateName());

unknown = Views().ViewVanillaFive();

console.log('unknown  local  name: ' + unknown.localName());
console.log('unknown private name: ' + unknown.privateName());

console.log(unknown.localName());
console.log(unknown.privateName());

var evil, arr = [];
Array.prototype.push = function (e) {
  evil = e;
};
arr.push('done');
console.log(evil); // done



//      NavTop : viewsObj.ViewNavTop(),
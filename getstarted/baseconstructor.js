// if closure is used for prototype 
// -no benefit from prototypal inheritance
//
// first time constructed... pass app to it.

var ViewsVanilla_proto = module.exports = (function () {

  function getPrototype (sess, proto) {
    return {
      name : "",
      getSessName : function () {
        return (sess) ? sess.name : null;
      }
    };    
  }

  return {
    getConstructor : function () {
      return function (sess) {

        return {
          getPrototype : function (p) {
            return p || (p = getPrototype(sess, {}));
          },
          getNew : function () {
            var prototype = getPrototype(sess),
                that = Object.create(prototype);
            return that;
          }
        };
      };
    }
  };

}());


var constructor = ViewsVanilla_proto.getConstructor();
delete ViewsVanilla_proto.getConstructor;

var constructorBase = constructor({ name : 'privatename' });
var constructorFinal = constructorBase.getNew();

console.log(constructorFinal.getSessName());





// you would need to delete the constructor right after first use...
// or after registering somehow...




var ViewsVanilla_proto = module.exports = (function () {
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


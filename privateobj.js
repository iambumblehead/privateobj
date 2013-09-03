// Filename: privateobj.js
// Timestamp: 2013.09.03-08:34:53 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
// Requires:


// generic object manager
var privateobj = 
  ((typeof module === 'object') ? module : {}).exports = (function () {

  function augmentObj (obj, newObj) {
    for (var o in newObj) {
      if (newObj.hasOwnProperty(o)) obj[o] = newObj[o];
    }
    return obj;    
  };

  function getPrivateObjectManager () {
    var privateSess, gate,
        internCache = {},
        constructors = {};

    gate = function (sess) {
      privateSess = sess;
      return constructors;    
    };

    gate.type = {};

    gate.getNew = function (spec, sess, augmentFn, obj, obj2, obj3) {
      var mngrNew, type = spec.type, constructor = type;
   
      mngrNew = constructor.getNew(spec, obj, obj2, obj3);
      mngrNew.obj = obj || null;

      if (typeof augmentFn === 'function') {
        augmentFn(mngrNew, sess, obj2, obj3);
      }

      return mngrNew;
    };

    // registered objects are only available through this
    // object manager's `get` method, which redefines sess always
    gate.register = function (spec, augmentFn) {
      var that = this, key, priobj, meta = spec.meta;

      constructors[spec.name] = function (obj, obj2, obj3) {           
        key = spec.name;
        if (typeof obj === 'object' && obj && obj.uid) {
          key += obj.uid;
        } else {
          key += Date.now();          
        }

        priobj = internCache[key] || 
          (internCache[key] = that.getNew(spec, privateSess, augmentFn, obj, obj2, obj3));

        priobj.sess = privateSess;
        return priobj;
      };

      // `name`, is already defined on the function, use `oname`.
      constructors[spec.name].oname = spec.name;

      // add meta definitions
      if (meta) augmentObj(constructors[spec.name], meta);
      
      return that;
    };

    // pump out several Models... 
    // or a super model
    gate.getNewConstructor = function (spec, augmentFn, obj, obj2, obj3) {
      var mconstructor = spec.type.getNew(spec),
          prototype, cprototype, upperName;

      mconstructor.name = spec.name;
      augmentFn(mconstructor, obj, obj2, obj3);
      return mconstructor;
    };

    // returns a constructor that has access to session data
    // augmentFn defines 'prototype' and 'constructor'
    // on the model that is passed to it.
    gate.registerConstructor = function (spec, augmentFn) {
      var that = this, key, priobj, meta = spec.meta;      

      constructors[spec.name] = function (obj, obj2, obj3) {
        key = spec.name;

        priobj = internCache[key] || 
          (internCache[key] = that.getNewConstructor(spec, augmentFn, obj, obj2, obj3));

        priobj.sess = privateSess;
        return priobj;        
      };

      // `name`, is already defined on the function, use `oname`.
      constructors[spec.name].oname = spec.name;

      // add meta definitions
      if (meta) augmentObj(constructors[spec.name], meta);
      
      return that;
    };
    
    gate.killAll = function (opts) {
      var exceptionObj;
      if (opts && (exceptionObj = opts.exceptionObj)) {
        for (var o in internCache) {
          if (internCache.hasOwnProperty(o) && !exceptionObj.hasOwnProperty(o)) internCache[o] = null;          
        }
      } else {
        for (var o in internCache) {
          if (internCache.hasOwnProperty(o)) internCache[o] = null;
        }
      }
    };

    return gate;
  }

  return {
    getNew : function (spec) {
      var that = getPrivateObjectManager();
      that.type = spec.type;
      return that;
    }
  };

}());

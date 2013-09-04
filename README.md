privateobj
=============
**(c)[Bumblehead][0], 2013** [MIT-license](#license)

### OVERVIEW:

privateobj:

  1. share data privately among objects
  2. register objects now then construct them later

<!--
Each time an object reference is obtained, private data is given and it is defined on the object that is returned. Valid private data is needed to obtain objects with valid private data.

A breakdown of how it works:

  - A 'views' object returns a reference to registered views:

  ```javascript
  ViewsObjectManager({ secret : 'fire' });
  ```
  
      - it calls the below function:

      ```javascript
      function (sess) {
          privateSess = sess;
          return constructors;    
      };
      ```

  - A 'view' is returned from the registered view function:

  ```javascript
  ViewsObjectManager({ secret : 'fire' }).ViewAccount();
  ```  

      - it calls the below function:  
  
      ```javascript
      function () {
          ...
          priobj.sess = privateSess;
          return priobj;
      };
      ```  

  - Secret data is returned from the 'view':

  ```javascript
  ViewsObjectManager({ secret : 'fire' }).ViewAccount().session.secret; // 'fire'
  ```    


`privateobj` _alone_ does not keep data private. Sandboxed construction of data types is necessary:

  ```javascript
  var evil, arr = [];
  Array.prototype.push = function (e) {
      evil = e;
  };
  arr.push('gotcha');
  console.log(evil); // gotcha
  ```
-->

[0]: http://www.bumblehead.com                            "bumblehead"

<!--

---------------------------------------------------------
#### <a id="install"></a>INSTALL:

privateobj may be downloaded directly or installed through `npm`.

 * **npm**   

 ```bash
 $ npm install privateobj
 ```

 * **Direct Download**
 
 ```bash  
 $ git clone https://github.com/iambumblehead/privateobj.git
 $ cd privateobj && npm install 
 ```

------------------------------------------------------------------------------
#### <a id="test"></a>TEST:

 to run tests, use `npm test` from a shell.

 ```bash
 $ npm test
 ```

---------------------------------------------------------
#### <a id="usage">USAGE:

 A demonstration is available with `npm start`
 
 ```bash
 $ npm start
 ``` 
-->

<!--
A working example can be found in the 'getstarted' directory.

Example, registering a 'view' with an privateobj:

  ```javascript
  ViewsObjectManager.register({
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
  ```

Example, obtaining a reference to a constructed view:

  ```javascript
  var viewvanilla = ViewsObjectManager(sess).ViewVanillaFive();
  
  console.log(vanilla.localName());   // vanilla
  console.log(vanilla.privateName()); // privatename
  ```

Its neccessary to pass the private data to obtain reference to a private-data-accessing 'instance' of `ViewVanillaFive`.

  ```javascript
  var unknown = ViewsObjectManager().ViewVanillaFive();
  
  console.log(unknown.localName());   // vanilla
  console.log(unknown.privateName()); // undefined
  ```
  
`ViewsObjectManager()` calls the below function:

  ```javascript
  function (sess) {
      privateSess = sess;
      return constructors;    
  };
  ```
  
`ViewsObjectManager().ViewVanillaFive()` calls the below function:  
  
  ```javascript
  function () {
      ...
      priobj.sess = privateSess;
      return priobj;
  };
  ```  
  
That's the important part: 'sess' is redefined _each time_ a reference to the view object is returned.
-->

<!--

---------------------------------------------------------
#### <a id="usage"></a>USAGE:

You'll need a four things:

  1. **'base'** constructor
 
  Returns a 'base' object, whose methods and properties may be redefined by the 'final' constructor. The method returning the 'base' object must be named `getNew`.

  ```javascript
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
  ```

  2. **privateobj**
  
  Here, one 'base' constructor is defined as 'type.vanilla'. multiple type of 'base' constructor may be defined.

  ```javascript
  var Views = privateobj.getNew({
      type : {
          vanilla : ViewsVanilla_proto
      }
  });  
  ```

  3. **'final' constructor**
  
  When the final constructor is called properties on the returned object may be redefined. returned object is the first parameter to the provided function (named `view` below).
  
  ```javascript
  Views.register({ 
      name : 'ViewVanillaFive',
      type : Views.type.vanilla
  }, function (view, sess) {
      
      view.privateName = function () {
          if (sess) return sess.name;
      };

  });
  ```  

  4. **finish**
  
  finish registering any 'final' constructors needed then delete the `register` method.

  ```javascript
  delete Views.register
  ```
  
  Construct objects. Store references to private data and objects in a closure. 
  
  ```javascript
  (function () {
      var sess = { secret : 'secret' },
          viewvanilla = ViewsObjectManager(sess).ViewVanillaFive();  
  }());
  ```

---------------------------------------------------------
#### <a id="more-usage"></a>MORE USAGE:

---------------------------------------------------------
#### <a id="thought"></a>THOUGHT:

Defining private data on a property is dangerous. Could we pass the private data as a function parameter only?

  ```javascript
  Views.register({ 
      name : 'ViewVanillaFive',
      type : Views.type.vanilla
  }, function (view, sess) {
      
      view.privateName = function () {
          if (sess) return sess.name;
      };

  });
  ```  

One thing makes this difficult: caching.

If fully constructed 'views' are cached -how is a reference to them obtained later? A key would be needed, but how would the key be hidden or made secure?

A cached namespace could be passed as well as the private data, but this would add more complexity to the process.
  
 
---------------------------------------------------------
#### <a id="usage">USAGE:

 A demonstration is available with `npm start`
 
 ```bash
 $ npm start
 ``` 
 
 1. Create



---------------------------------------------------------
#### <a id="license">LICENSE:

(The MIT License)

Copyright (c) 2013 [Bumblehead][0] <chris@bumblehead.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-->
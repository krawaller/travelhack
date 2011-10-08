var ws = require('./webservice');

// creates a handler middleware, function(req, resp, next)
var createHandler = exports.createHandler = function ( module, options ){
  var router = ws.createRouter( module, options || {});
  return function (request, response, next) {
	//console.log(module);
    router.handle(request, request.body, function (result) {
	

                 
      /*
      if (request.headers && typeof request.headers.accept === 'string' 
          && request.headers.accept.search('text/html') > -1) {
        contentType = "text/html";            
      }
      else {
        contentType = "application/json";            
      }
      */

      if (result.status === 404 && next ) {
        if(next.length>1){
          return next(request, response, result);
        }
        else{
          return next();
        }
      }


		if(result.bodyBuffer && result.contentType){
			response.writeHead(200, {
	        	"Content-Type": result.contentType
	        });
	        response.write(result.bodyBuffer, "binary");
	        response.end();
			return;
		}

		

		var contentType;
		
		if(result._contentType){
			contentType = result._contentType;
			delete result._contentType;
		} else {
			contentType = /^\s*</.test(result.body) ? 'text/html' : "application/json; charset=utf-8"; 
		}
		
		 

      response.writeHead(result.status, {'Content-Type': contentType}, result.headers);
      response.end(result.body);

    });
  };
}
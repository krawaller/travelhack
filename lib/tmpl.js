$.tmpl = (function(){
	var _ = {},
		cache = {};
	// By default, Underscore uses ERB-style template delimiters, change the
	// following template settings to use alternative delimiters.
	_.templateSettings = {
	  evaluate    : /<%([\s\S]+?)%>/g,
	  interpolate : /<%=([\s\S]+?)%>/g,
	  escape      : /<%-([\s\S]+?)%>/g
	};

	// JavaScript micro-templating, similar to John Resig's implementation.
	// Underscore templating handles arbitrary delimiters, preserves whitespace,
	// and correctly escapes quotes within interpolated code.
	_.template = function(str, data) {
	  var c  = _.templateSettings;
	  var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
	    'with(obj||{}){__p.push(\'' +
	    str.replace(/\\/g, '\\\\')
	       .replace(/'/g, "\\'")
	       .replace(c.escape, function(match, code) {
	         return "',_.escape(" + code.replace(/\\'/g, "'") + "),'";
	       })
	       .replace(c.interpolate, function(match, code) {
	         return "'," + code.replace(/\\'/g, "'") + ",'";
	       })
	       .replace(c.evaluate || null, function(match, code) {
	         return "');" + code.replace(/\\'/g, "'")
	                            .replace(/[\r\n\t]/g, ' ') + "__p.push('";
	       })
	       .replace(/\r/g, '\\r')
	       .replace(/\n/g, '\\n')
	       .replace(/\t/g, '\\t')
	       + "');}return __p.join('');";
	  var func = new Function('obj', tmpl);
	  return data ? func(data) : func;
	};
	
	return function(name, data){
		var fn, str;

		if(!(fn = cache[name])){
			str = ($('#' + name).html() || "").trim();
			fn = cache[name] = _.template(str);
		}
		return fn($.tmpl.utils ? $.extend({}, $.tmpl.utils, widget[name.replace(/\-tmpl$/, '')] || {}, data) : data);
	};
})();

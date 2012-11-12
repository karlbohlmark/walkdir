var fs = require('fs');
var path = require('path');

var Walker = function(dir, ignore){
	this.startDir = dir;
	this.ignore = ignore;
	this.handlers = {};
};

Walker.prototype.on = function(ev, handler){
	if(!this.handlers[ev]) this.handlers[ev] = [];
	this.handlers[ev].push(handler);
};

Walker.prototype.emit = function(ev, data){
	(this.handlers[ev] || []).forEach(function(handler){
		handler.call(this, data);
	}.bind(this));
};

Walker.prototype.walk = function(d){
	d = d || this.startDir;
	var files = fs.readdirSync(d);
	files.forEach(function(file){
		var f = path.join(d, file);
		var stat = fs.statSync(f);
		if(stat.isDirectory && stat.isDirectory() && ! this.ignore(f)){
			this.emit('dir', f);
			this.walk(f);
		}else{
			this.emit('file', f);
		}
	}.bind(this));
};

module.exports = Walker;
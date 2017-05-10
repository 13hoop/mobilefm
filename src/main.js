requirejs.config({
	baseUrl:'../js',
	paths:{
		'jquery':'lib/bower_comonents/jquery/dist/jquery-3.2.1.min'
	}
});

requirejs(['app/index'])
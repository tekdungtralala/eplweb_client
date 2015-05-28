module.exports = function(grunt) {

	var angularJsFiles = [
		// Firstly, init app module 
		'webapp/app/app.module.js',
		// Then all sub module
		'webapp/app/**/*.module.js',
		// Core app
		'webapp/app/core/**/*.js',
		// And the last is all other .js
		'webapp/app/**/*.js',
	];

	var jsVendorFiles = [
		'bower_components/jquery/dist/jquery.min.js',
		'bower_components/jquery-ui/jquery-ui.min.js',
		'bower_components/jquery-validation/dist/jquery.validate.min.js',
		'bower_components/jquery-validation/dist/additional-methods.min.js',
		'bower_components/bootstrap/dist/js/bootstrap.min.js',
		'bower_components/angular/angular.min.js',
		'bower_components/angular-animate/angular-animate.min.js',
		'bower_components/angular-cookies/angular-cookies.min.js',
		'bower_components/angular-ui-router/release/angular-ui-router.min.js',
		'bower_components/angular-google-maps/dist/angular-google-maps.min.js',
		'bower_components/angular-busy/dist/angular-busy.min.js',
		'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
		'bower_components/underscore/underscore.js',
		'bower_components/moment/moment.js',
		'bower_components/slimScroll/jquery.slimscroll.js',
		'bower_components/fastclick/lib/fastclick.js',
		'bower_components/ng-file-upload/angular-file-upload-shim.min.js',
		'bower_components/ng-file-upload/angular-file-upload.min.js',

		'webapp/eplweb_components/js/highcharts.js',
		'webapp/eplweb_components/js/exporting.js',
		'webapp/eplweb_components/js/slider.js',
		'webapp/eplweb_components/js/app.js', //Admin LTE
	];

	var customCss = 'webapp/eplweb_components/css/index.css';

	var cssFiles = [
		'bower_components/jquery-ui/themes/smoothness/jquery-ui.css',
		'bower_components/bootstrap/dist/css/bootstrap.css',
		'bower_components/font-awesome/css/font-awesome.min.css',
		'bower_components/ionicons/css/ionicons.min.css',
		'bower_components/angular-busy/dist/angular-busy.min.css',
		'webapp/eplweb_components/css/AdminLTE.css',
		'webapp/eplweb_components/css/skin-purple.css',
		'webapp/eplweb_components/css/epl-animate.css',
		customCss
	];

	var fontFiles = [
		'bower_components/bootstrap/dist/fonts/**',
		'bower_components/font-awesome/fonts/**',
	];

	var jqueryUiImages = ['bower_components/jquery-ui/themes/base/images/**']

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			angularJs: {
				files: angularJsFiles,
				tasks: ['concat:appjs']
			},
			customCss: {
				files: [customCss],
				tasks: ['concat:css']
			}
		},
		copy: {
			fonts: {
				expand: true,
				flatten: true,
				src: fontFiles,
				dest: 'webapp/eplweb_components/fonts',
				filter: 'isFile'
			},
			jqueryUiImages: {
				expand: true,
				flatten: true,
				src: jqueryUiImages,
				dest: 'webapp/eplweb_components/css/images',
				filter: 'isFile'
			}
		},
		concat: {
			options: {
				separator: '\n\n'
			},
			vendorjs: {
				src: jsVendorFiles,
				dest: 'webapp/eplweb_components/js/vendors.js'
			},
			appjs: {
				src: angularJsFiles,
				dest: 'webapp/eplweb_components/js/eplweb.js'
			}, 
			css: {
				src: cssFiles,
				dest: 'webapp/eplweb_components/css/eplweb.css'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', []);

	grunt.registerTask('all', [
		'concat:vendorjs',
		'concat:appjs',
		'concat:css',
		'copy:fonts',
		'copy:jqueryUiImages'
	]);

}
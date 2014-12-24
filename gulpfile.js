var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');

var watchFiles = {
		serverViews: ['app/views/**/*.*'],
		serverJS: ['server.js', 'config/**/*.js', 'app/**/*.js'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
		clientCSS: ['public/modules/**/*.css'],
		mochaTests: ['app/tests/**/*.js']
	};

var changedFiles;

gulp.task('watch', function () {
	livereload.listen(); 
	gulp.watch(watchFiles.serverViews, ['reload'])
		.on('change', function() {
			changedFiles = watchFiles.serverViews;
		});
	gulp.watch(watchFiles.serverJS, ['jshint', 'reload'])
		.on('change', function() {
			changedFiles = watchFiles.serverJS;
		});	
	gulp.watch(watchFiles.clientViews, ['reload'])
		.on('change', function() {
			changedFiles = watchFiles.clientViews;
		});	
	gulp.watch(watchFiles.clientJS, ['jshint','reload'])
		.on('change', function() {
			changedFiles = watchFiles.clientJS;
		});
	gulp.watch(watchFiles.clientCSS, ['csslint','reload'])
		.on('change', function() {
			changedFiles = watchFiles.clientCSS;
		});
});

gulp.task('reload', function () {
	return gulp.src(changedFiles)
		.pipe(livereload());
});

gulp.task('lint', ['jshint', 'csslint'], function() {
});

gulp.task('jshint', function () {
	return gulp.src(watchFiles.clientJS.concat(watchFiles.serverJS))
    	.pipe(jshint())
    	.pipe(jshint.reporter('default', { verbose: true }));
});

gulp.task('csslint', function () {
	gulp.src(watchFiles.clientCSS)
	.pipe(csslint('.csslintrc'))
    .pipe(csslint.reporter());
});

gulp.task('default', ['lint', 'watch', 'serve'], function() {
});

gulp.task('serve', function () {
	nodemon({ 
		script: 'server.js',
		ext: 'html js',
		watch: watchFiles.serverViews.concat(watchFiles.serverJS),
		nodeArgs: ['--debug']})
    .on('change', ['jslint'])
    .on('restart', function () {
      console.log('restarted!')
    })
});

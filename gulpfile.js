var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');

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
	gulp.watch(watchFiles.serverJS, ['reload'])
		.on('change', function() {
			changedFiles = watchFiles.serverJS;
		});	
	gulp.watch(watchFiles.clientViews, ['reload'])
		.on('change', function() {
			changedFiles = watchFiles.clientViews;
		});	
	gulp.watch(watchFiles.clientJS, ['reload'])
		.on('change', function() {
			changedFiles = watchFiles.clientJS;
		});
	gulp.watch(watchFiles.clientCSS, ['reload'])
		.on('change', function() {
			changedFiles = watchFiles.clientCSS;
		});
});

gulp.task('reload', function () {
	return gulp.src(changedFiles)
		.pipe(livereload());
});

gulp.task('default', ['watch', 'serve'], function() {
});

gulp.task('serve', function () {
	nodemon({ 
		script: 'server.js',
		ext: 'html js',
		watch: watchFiles.serverViews.concat(watchFiles.serverJS),
		nodeArgs: ['--debug']})
    .on('change', [])
    .on('restart', function () {
      console.log('restarted!')
    })
});

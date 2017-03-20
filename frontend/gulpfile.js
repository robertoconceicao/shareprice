// Aqui nós carregamos o gulp e os plugins através da função `require` do nodejs
var gulp = require('gulp');
//var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

//Criando tarefa para copiar as imagens para dentro do build
gulp.task("images", function(done) {
    return watch(["src/assets/images/*"])
        .pipe(gulp.dest("www/build/images"))
        .on('end', done);
});

gulp.task('watch', function(done){
  runSequence(
    ['images','sass', 'html', 'fonts', 'scripts'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      gulpWatch('app/**/*.png', function(){ gulp.start('images'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});
var browserSync = require ("browser-sync");
var cleanCss = require ("gulp-clean-css");
var gulp = require ('gulp');
var sass = require ("gulp-sass");
var uglify = require ("gulp-uglify");
var mergeStream = require ("merge-stream");


gulp.task("default", ["watch"])

gulp.task("watch", ['browsersync', 'css', 'uglify'], function(){

    gulp.watch('./assets/scss/*.scss', ['css']).on("change", browserSync.reload);
    gulp.watch('./assets/js/*.js', ['uglify']).on("change", browserSync.reload);
    gulp.watch('./*.html').on("change", browserSync.reload);
})



gulp.task("style",function(){
    gulp.src("./node_modules/materialize-css/dist/css/materialize.min.css")
        .pipe(gulp.dest("./dist/css"));
           
})

gulp.task("script", function(){
    var getjQuery = gulp.src("./node_modules/jquery/dist/jquery.min.js")
        .pipe(gulp.dest("./dist/js"));
    
        var getMaterialize = gulp.src("./node_modules/materialize-css/dist/js/materialize.min.js")
        .pipe(gulp.dest("./dist/js"));
    return mergeStream(getjQuery, getMaterialize);


})

gulp.task("css",function(){
     return gulp.src("./assets/scss/*.scss")
     .pipe(sass())
    //  .pipe(cleanCss())
     .pipe(gulp.dest("./dist/css"));
           
})

gulp.task("uglify",function(){

    gulp.src('./assets/js/*.js')
    // .pipe(uglify())
    .pipe(gulp.dest("./dist/js"))
    
})


gulp.task("browsersync",function(){

    browserSync.init({
        server: "./"
    })
})
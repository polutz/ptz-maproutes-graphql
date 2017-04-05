var gulp = require("gulp");
var ts = require("gulp-typescript");

gulp.task("js", function () {
    var tsProject = ts.createProject(__dirname + "/tsconfig.json");

    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest("dist/"));
});

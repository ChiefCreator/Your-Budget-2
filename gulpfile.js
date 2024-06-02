const gulp = require("gulp");
require("./gulp/dev.js");

gulp.task("default", gulp.series(
    "clean:dev",
     gulp.parallel("html:dev", "scss:dev", "images:dev", "icons:dev", "video:dev", "js:dev"),
     gulp.parallel("server:dev", "watch:dev")
));
var gulp;
try {
    gulp = require("gulp");
} catch (e) {
    gulp = require("gulp-4.0.build");
}
var template = require("gulp-template");
var _ = require("lodash");
var rename = require("gulp-rename");
var glob = require("glob");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var rev = require("gulp-rev");
var revCollector = require("gulp-rev-collector");
var del = require("del");
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require("gulp-autoprefixer");
var minifyInline = require("gulp-minify-inline");
var minifyCss = require("gulp-minify-css");
var templateCache = require("gulp-angular-templatecache");
var fontmin = require('gulp-fontmin');
var ngAnnotate = require('gulp-ng-annotate');
var changed = require('gulp-changed');
var svgSprite = require('gulp-svg-sprite');

// apiEndpoint must have the trailing slash
var buildConfigs = {
    local: {
        bundle: false,
        apiEndpoint: "https://localhost:44300/",
        urlCanonical: false
    },
    dev: {
        bundle: false,
        apiEndpoint: "https://lgbt-api.keylol.com/",
        urlCanonical: false
    },
    lgbt: {
        bundle: true,
        apiEndpoint: "https://lgbt-api.keylol.com/",
        urlCanonical: false
    },
    prod: {
        bundle: true,
        apiEndpoint: "https://api.keylol.com/",
        urlCanonical: true
    }
};

var vendorScripts = [
    "node_modules/jquery/dist/jquery.js",
    "node_modules/ms-signalr-client/jquery.signalr-2.2.0.js",
    "node_modules/svgxuse/svgxuse.js",
    "node_modules/moment/moment.js",
    "node_modules/moment/locale/zh-cn.js",
    "node_modules/moment-timezone/builds/moment-timezone-with-data.js",
    "node_modules/angular/angular.js",
    "node_modules/angular-i18n/angular-locale_zh.js",
    "node_modules/angular-ui-router/release/angular-ui-router.js",
    "node_modules/angular-animate/angular-animate.js",
    "node_modules/angular-moment/angular-moment.js",
    "node_modules/ngstorage/ngStorage.js",
    "node_modules/ng-file-upload/dist/ng-file-upload.js",
    "node_modules/angular-utf8-base64/angular-utf8-base64.js",
    "node_modules/angulartics/src/angulartics.js",
    "node_modules/simple-module/lib/module.js",
    "node_modules/simple-hotkeys/lib/hotkeys.js",
    "node_modules/simple-uploader/lib/uploader.js",
    "node_modules/simditor/lib/simditor.js"
];

var babelScripts = [
    "keylol-app.js",
    "root-controller.js",
    "src/**/*.js"
];

var appScripts = [
    "temporary/keylol-app.js",
    "temporary/environment-config.js",
    "temporary/root-controller.js",
    "temporary/**/*.js"
];

var stylesheets = [
    "assets/stylesheets/normalize.css",
    "node_modules/simditor/styles/simditor.css",
    "temporary/*.css"
];

var sassStylesheets = [
    "assets/scss/predefined/!(fonts.template).scss",
    "assets/scss/!(style).scss",
    "src/**/*.scss"
];

var keylolTextList = "`{}>▾▴其乐推荐据点客务中心讯息轨道评测好资差模组感悟请无视游戏与艺术之间的空隙提交注册申登入发布文章由你筛选变更函会员研谈档邮政服私信蒸汽动力进社区噪音零死角讨论独特鼓励机制志同合琴瑟曲即日内欲知情关联意成功错误认可索取表单开设此阅读搜结果传送装置已就位个人从兴趣始慢搭建一条收到出未能撞到处理这位用户尚或任何当前投稿厂商类型平台剧透警告简完编辑确料定太瞎了获不态了跳过步正在生首页并立案稍候糕块里如也连蛋都没有需验证陆加现解分享放公篇被封存科退通职团队惩教萃撤销录兌換品广场专题器网口令哨所性玩家焦扉报坑仁近畿集数目时驻流派基本渠程原语言华度像界面化硬件对私公函缺失作新脉订友听众安全醒互";

var lisongTextList = "/评测好差模组资讯会员注册表单连接游戏平台昵称账户头像登录口令确认电子邮箱人机验证声明桌面类蒸汽第一称射击时空枪使命召唤侠盗猎车手橘子孢子上帝视角文明红色警戒拟城市塔防即时策略折扣原声控僵尸末日泰拉瑞亚独立用户识别码玩家标签个人据点横幅信息变更函提示守则平台账户分享社区动态当前确新录保护件订阅简通知等待添加成为友收到验证码绑定功平台连接向导邀请内列中名英章数读者操作开设型唯商店链背景图关联偏（能暂未放）输入残缺不堪的料完索引介绍补充善于期发行厂流派特性系次要封大匹配题语言抓取同步周器加社区其乐抚鳞品预览说力编号架间冷衫";

var getFiles = function (arr) {
    return _.union.apply(this, _.map(arr, function (path) {
        return glob.sync(path);
    }));
};

function fontKeylol() {
    return gulp.series(function cleanFontKeylol() {
        return del("assets/fonts/keylol-rail-sung-subset-*");
    }, function generateFontKeylol() {
        return gulp.src("assets/fonts/keylol-rail-sung-full.ttf")
            .pipe(rename("keylol-rail-sung-subset.ttf"))
            .pipe(fontmin({
                text: keylolTextList
            }))
            .pipe(rev())
            .pipe(gulp.dest("assets/fonts"))
            .pipe(rev.manifest("keylol.manifest.json"))
            .pipe(gulp.dest('assets/fonts'));
    });
}

function fontLisong() {
    return gulp.series(function cleanFontLisong() {
        return del("assets/fonts/lisong-subset-*");
    }, function generateFontLisong() {
        return gulp.src("assets/fonts/lisong-full.ttf")
            .pipe(rename("lisong-subset.ttf"))
            .pipe(fontmin({
                text: lisongTextList
            }))
            .pipe(rev())
            .pipe(gulp.dest("assets/fonts"))
            .pipe(rev.manifest("lisong.manifest.json"))
            .pipe(gulp.dest('assets/fonts'));
    })
}

gulp.task("store-font", function () {
    return gulp.src(['assets/fonts/*.json', 'assets/scss/predefined/fonts.template.scss'])
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(rename("fonts.scss"))
        .pipe(gulp.dest('assets/scss/predefined/'));
});

gulp.task("font-keylol", gulp.series(fontKeylol(), "store-font"));

gulp.task("font-lisong", gulp.series(fontLisong(), "store-font"));

gulp.task("font", gulp.series(gulp.parallel(fontKeylol(), fontLisong()), "store-font"));

gulp.task("clean", function () {
    return del(["bundles/!(web.config)", "index.html", "temporary/*"]);
});

gulp.task('build-svg', gulp.series(
    function cleanSVGSprite() {
        return del("assets/images/sprite-*.svg");
    }, function generateSVGSprite() {
        return gulp.src('assets/icons/*.svg')
            .pipe(svgSprite({
                mode: {
                    symbol: {
                        dest: '.',
                        sprite: 'sprite.svg'
                    }
                },
                shape: {
                    id: {separator: '-'},
                    transform: ['svgo']
                }
            }))
            .pipe(rev())
            .pipe(gulp.dest('assets/images'));
    }));

function compileSass(bundle) {
    return gulp.series(function importSass () {
        var stylesheetFiles = getFiles(sassStylesheets);
        return gulp.src("assets/scss/style.scss.ejs")
            .pipe(template({ stylesheets: stylesheetFiles }))
            .pipe(rename("style.scss"))
            .pipe(gulp.dest("assets/scss/"))
    }, function compileFromStyle () {
        var stream = gulp.src("assets/scss/style.scss");
        if(!bundle){
            stream = stream.pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
                .pipe(sourcemaps.write());
        } else {
            stream = stream.pipe(sass().on('error', sass.logError));
        }
        return stream.pipe(gulp.dest('temporary'));
    });
}
function compileES6(bundle) {
    return function compile () {
        var stream = gulp.src(babelScripts);
        if(!bundle){
            stream = stream.pipe(sourcemaps.init())
                .pipe(changed('temporary'))
                .pipe(babel({
                    presets: ['es2015']
                }))
                .pipe(sourcemaps.write('.'))
        } else {
            stream = stream.pipe(babel({
                presets: ['es2015']
            }));
        }
        return stream.pipe(gulp.dest('temporary'));
    }
}

gulp.task("sass", compileSass());

gulp.task("scss:bundle", compileSass(true));

gulp.task("babel", compileES6());

gulp.task("babel:bundle", compileES6(true));

var getBuildTask = function (configName) {
    var config = buildConfigs[configName];
    return gulp.series("clean", function buildEnvironmentConfig() {
        return gulp.src("environment-config.js.ejs")
            .pipe(template(config))
            .pipe(rename("environment-config.js"))
            .pipe(gulp.dest("temporary/"));
    }, config.bundle ? gulp.parallel("scss:bundle", "babel:bundle") : gulp.parallel("sass", "babel"),
        config.bundle ? gulp.parallel(function buildVendorScriptBundle() {
        return gulp.src(vendorScripts)
            .pipe(concat("vendor.min.js"))
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest("bundles"));
    }, function buildAppScriptBundle() {
        return gulp.src(appScripts)
            .pipe(concat("app.min.js"))
            .pipe(ngAnnotate())
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest("bundles"));
    }, function buildTemplateBundle() {
        return gulp.src("src/**/*.html")
            .pipe(minifyInline({
                css: {
                    keepSpecialComments: 0
                }
            }))
            .pipe(templateCache("templates.min.js", {
                root: "src/",
                module: "KeylolApp"
            }))
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest("bundles"));
    }, function buildStylesheetBundle() {
        return gulp.src(stylesheets)
            .pipe(autoprefixer())
            .pipe(minifyCss({
                keepSpecialComments: 0,
                relativeTo: "bundles",
                target: "bundles"
            }))
            .pipe(concat("stylesheets.min.css"))
            .pipe(rev())
            .pipe(gulp.dest("bundles"));
    }) : function skipBundles(done) {
        done();
    }, function buildEntryPage() {
        var scriptFiles, stylesheetFiles;
        if (config.bundle) {
            scriptFiles = getFiles(["bundles/vendor-*.min.js", "bundles/app-*.min.js", "bundles/templates-*.min.js"]);
            stylesheetFiles = getFiles(["bundles/stylesheets-*.min.css"]);
        } else {
            scriptFiles = getFiles(vendorScripts.concat(appScripts));
            stylesheetFiles = getFiles(stylesheets);
        }
        var stream = gulp.src("index.html.ejs")
            .pipe(template({
                scripts: scriptFiles,
                stylesheets: stylesheetFiles,
                urlCanonical: config.urlCanonical
            }))
            .pipe(rename("index.html"));
        if (config.bundle) {
            stream = stream.pipe(minifyInline({
                    css: {
                        keepSpecialComments: 0
                    }
                }));
        }
        return stream.pipe(gulp.dest("./"));
    });
};

gulp.task("prod", getBuildTask("prod"));

gulp.task("dev", getBuildTask("dev"));

gulp.task("lgbt", getBuildTask("lgbt"));

gulp.task("local", getBuildTask("local"));

gulp.task("default", getBuildTask("dev"));

gulp.task("dev:watch", gulp.series("dev", function watch () {
    gulp.watch(sassStylesheets, compileSass());
    gulp.watch(babelScripts, compileES6());
}));

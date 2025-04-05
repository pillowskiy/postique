import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import changed from 'gulp-changed';
import gulpClean from 'gulp-clean';
import cleanCSS from 'gulp-clean-css';
import purgecss from 'gulp-purgecss';
import rename from 'gulp-rename';
import gulpSass from 'gulp-sass';
import uglify from 'gulp-uglify';
import { rollup } from 'rollup';
import cjs from 'rollup-plugin-cjs-es';
import { terser } from 'rollup-plugin-terser';
import * as sass from 'sass';

const isProduction = process.env.NODE_ENV === 'production';

const DEST_DIR = '_static';

const paths = /** @type {const} */ {
    views: {
        src: 'views/**/*.ejs',
    },
    styles: {
        changed: DEST_DIR,
        src: 'public/**/*.{css,scss}',
        dest: DEST_DIR,
    },
    scripts: {
        changed: DEST_DIR,
        src: 'public/**/*.js',
        dest: DEST_DIR,
    },
};

/**
 * @param {() => void} done
 */
function clean(done) {
    if (!isProduction) {
        return done();
    }

    return gulp
        .src(DEST_DIR, { read: false, since: gulp.lastRun(clean) })
        .pipe(gulpClean());
}

function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(changed(paths.styles.changed, { extension: '.min.css' }))
        .pipe(gulpSass(sass)())
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cleanCSS())
        .pipe(
            rename({
                suffix: '.min',
            }),
        )
        .pipe(
            purgecss({
                content: [paths.views.src],
                safelist: {
                    standard: [/^ql/],
                    deep: [/^ql/],
                    greedy: [/^ql/],
                },
            }),
        )
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp
        .src(paths.scripts.src, {
            since: gulp.lastRun(scripts),
            sourcemaps: true,
        })
        .pipe(changed(paths.scripts.changed, { extension: '.js' }))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dest));
}

async function bundle() {
    const res = await rollup({
        input: 'public/js/quill/index.js',
        plugins: [
            resolve(),
            cjs({ nested: true }),
            terser(),
            alias({
                entries: [
                    { find: 'quill', replacement: 'quill/dist/quill.js' },
                ],
            }),
        ],
        treeshake: true,
    });

    return res.write({
        file: `_static/js/quill.min.js`,
        format: 'iife',
        sourcemap: true,
        compact: true,
    });
}

const build = gulp.parallel(styles, scripts, bundle);

export default gulp.series(clean, build);

const { src, dest, task } = require('gulp');
const { watch } = require('gulp');
const rename = require('gulp-rename');

// Task principale di build
function build() {
    return src([
        // Include i file compilati TypeScript
        'dist/**/*',
        // File necessari per n8n
        'package.json',
        'README.md',
        'LICENSE',
        // Icone e descrittori dei nodi
        'nodes/**/*.{png,svg}',
        'nodes/**/*.json',
        // Esclude i file sorgente TypeScript
        '!**/*.ts',
        '!**/*.map'
    ])
    .pipe(dest('build'));
}

// Task per copiare i file di produzione
function copyProductionFiles() {
    return src([
        'package.json',
        'README.md',
        'LICENSE'
    ])
    .pipe(dest('build'));
}

exports.build = build;
exports.copyProductionFiles = copyProductionFiles;
exports.default = build;

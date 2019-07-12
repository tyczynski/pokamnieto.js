const { watchDocs, buildDocs } = require('./gulp-tasks/docs');
const { watchLib, buildLib } = require('./gulp-tasks/lib');

// lib tasks
exports['build:lib'] = buildLib;
exports['watch:lib'] = watchLib;

// docs taskcs
exports['watch:docs'] = watchDocs;
exports['build:docs'] = buildDocs;

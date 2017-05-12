'use strict';

// Require your application JS files here


function requireAll(r) { r.keys().forEach(r); }

requireAll(require.context('./pages/', true, /\.(js|css|html)$/));
requireAll(require.context('./views/', true, /\.(js|css|html)$/));
requireAll(require.context('./dist/compiled/', true, /\.(js|css|html)$/));


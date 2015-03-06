// Lodash complains about missing 'global'
window.global = window;
require('lodash-compat/collection/some');
require('../../index');

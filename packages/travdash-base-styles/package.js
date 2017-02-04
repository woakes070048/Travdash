Package.describe({
  name: "travdash:base-styles",
  summary: "Travdash basic styles package",
  version: "0.0.0",
  git: "https://github.com/TelescopeJS/Telescope.git"
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.0']);

  api.use([
    'nova:core@0.27.5-nova',
    'travdash:assets',
    'fourseven:scss'
  ]);

  api.addFiles([
    'lib/scss/toolkit.scss',
    'lib/js/bootstrap/alert.js',
    'lib/js/bootstrap/button.js',
    'lib/js/bootstrap/carousel.js',
    'lib/js/bootstrap/collapse.js',
    'lib/js/bootstrap/dropdown.js',
    'lib/js/bootstrap/modal.js',
    'lib/js/bootstrap/popover.js',
    'lib/js/bootstrap/scrollspy.js',
    'lib/js/bootstrap/tab.js',
    'lib/js/bootstrap/tooltip.js',
    'lib/js/bootstrap/util.js'
  ], ['client']);

});

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
    'fourseven:scss'
  ]);

  api.addFiles([
    'lib/scss/toolkit.scss'
  ], ['client']);

});

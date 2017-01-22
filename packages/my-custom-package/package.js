Package.describe({
  name: "my-custom-package",
  summary: "Example package",
  version: "0.0.0"
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'fourseven:scss',
    'nova:core',
    'nova:base-components',
    'nova:posts',
    'nova:users',
    'travdash:base-styles'
  ]);

  api.addFiles([
    'lib/modules.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/server/templates.js'
  ], ['server']);

  api.addAssets([
    'lib/server/emails/customNewPost.handlebars',
    'lib/server/emails/customEmail.handlebars'
  ], ['server']);
});

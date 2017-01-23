Package.describe({
  name: 'travdash:assets',
  version: '0.0.0',
});


Package.onUse(function (api) {

  api.addAssets([
    'fonts/toolkit-entypo.eot',
    'fonts/toolkit-entypo.ttf',
    'fonts/toolkit-entypo.woff',
    'fonts/toolkit-entypo.woff2'
  ], ['client']);

});

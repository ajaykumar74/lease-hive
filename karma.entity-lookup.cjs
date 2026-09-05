module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [require('karma-jasmine'), require('karma-chrome-launcher'), require('@angular-devkit/build-angular/plugins/karma')],
    reporters: ['progress'],
    browsers: ['ChromeHeadlessEntityTests'],
    customLaunchers: {
      ChromeHeadlessEntityTests: { base: 'ChromeHeadless', flags: ['--disable-gpu', '--disable-software-rasterizer', '--no-sandbox'] }
    },
    singleRun: true
  });
};

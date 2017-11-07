let mix = require('laravel-mix');
let webpack = require('webpack');
let Path = require('path');
let PrerenderSpaPlugin = require('prerender-spa-plugin');

mix.js('src/js/app.js', 'dist/js/')
    .autoload({
        jquery: ['$', 'jQuery', 'window.$', 'window.jQuery']
    })
   .sass('src/sass/app.scss', 'dist/css/')
   .setPublicPath('dist')
   .copyDirectory('src/img', 'dist/img')
   .webpackConfig({
        plugins: [
            new webpack.ProvidePlugin({
                Popper: ['popper.js', 'default']
            })
        ]
    })

if(mix.inProduction()) {
    mix.webpackConfig({
        plugins: [
            new webpack.ProvidePlugin({
                Popper: ['popper.js', 'default']
            }),
            new PrerenderSpaPlugin(
                Path.join(__dirname, './dist'),
                [
                    '/',

                    '/budget',
                    '/income',
                    '/loan',
                    '/saving',
                    '/expense',
                    '/settings'
                ],
                {
                    indexPath: path.join(__dirname, './src/index.html'),
                    captureAfterTime: 500
                }
            )
        ]
    })
}
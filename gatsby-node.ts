const path = require('path')
const webpack = require('webpack')

exports.onCreateWebpackConfig = ({ stage, loaders, actions,plugins }:any) => {
    if (stage === "build-html" || stage === "develop-html") {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /firebase/,
              use: loaders.null(),
            },
            {
              test: [/\.js$/,/\.tsx?$/,/\.ts?$/],
              exclude: [
                path.resolve(__dirname, './functions/')
              ]
            },
          ],
        },
        resolve: { 
          modules:['node_modules'],
          alias: 
           { 
            stream: path.resolve('node_modules/stream-browserify/index.js'), 
            zlib: path.resolve('node_modules/browserify-zlib/lib/index.js'), 
            path: path.resolve('node_modules/path-browserify/index.js'), 
           },
         fallback: { fs: false, crypto: false, }, 
        }, 
        plugins: [ plugins.provide({ process: 'process/browser', Buffer: ['buffer', 'Buffer'], }),]
      })
    }
      else actions.setWebpackConfig({
        module:{
           rules:[{
            test: [/\.js$/,/\.tsx?$/,/\.ts?$/],
            exclude: [
              path.resolve(__dirname, './functions/')
            ]
          },],
        },
        resolve: { 
          modules:['node_modules'],
          alias: 
           { 
            stream: path.resolve('node_modules/stream-browserify/index.js'), 
            zlib: path.resolve('node_modules/browserify-zlib/lib/index.js'), 
            path: path.resolve('node_modules/path-browserify/index.js'), 
           },
         fallback: { fs: false, crypto: false, zlib: path.resolve('node_modules/browserify-zlib/lib/index.js'),}, 
        }, 
        plugins: [ plugins.provide({ process: 'process/browser', Buffer: ['buffer', 'Buffer'], }),]
      })

  }
  //exports.onCreateWebpackConfig = ({ actions, plugins }) => { actions.setWebpackConfig({ resolve: { alias: { stream: require.resolve('stream-browserify'), zlib: require.resolve('browserify-zlib'), path: require.resolve('path-browserify'), }, fallback: { fs: false, crypto: false, }, }, plugins: [ plugins.provide({ process: 'process/browser', Buffer: ['buffer', 'Buffer'], }), ], }); };
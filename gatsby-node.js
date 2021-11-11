const path = require('path');
exports.onCreateWebpackConfig = ({ stage, loaders, actions,plugins }) => {
    if (stage === "build-html" || stage === "develop-html") {
      actions.setWebpackConfig({
        module: {
          rules: [
            {
              test: /firebase/,
              use: loaders.null(),
            },
            {
              test: /\.js$/,
              exclude: [
                path.resolve(__dirname, './functions/')
              ]
            },
          ],
        },
        resolve: { 
          alias: 
           { 
             stream: require.resolve('stream-browserify'), 
             zlib: require.resolve('browserify-zlib'), 
             path: require.resolve('path-browserify'), 
           },
         fallback: { fs: false, crypto: false, }, 
        }, 
       plugins: [ plugins.provide({ process: 'process/browser', Buffer: ['buffer', 'Buffer'], }),]
      })
    }
      else actions.setWebpackConfig({
        module:{
           rules:[{
            test: /\.js$/,
            exclude: [
              path.resolve(__dirname, './functions/')
            ]
          },],
        },
        resolve: { 
          alias: 
           { 
             stream: require.resolve('stream-browserify'), 
             zlib: require.resolve('browserify-zlib'), 
             path: require.resolve('path-browserify'), 

           },
         fallback: { fs: false, crypto: false, }, 
        }, 
       plugins: [ plugins.provide({ process: 'process/browser', Buffer: ['buffer', 'Buffer'], }),]
      })

  }
  //exports.onCreateWebpackConfig = ({ actions, plugins }) => { actions.setWebpackConfig({ resolve: { alias: { stream: require.resolve('stream-browserify'), zlib: require.resolve('browserify-zlib'), path: require.resolve('path-browserify'), }, fallback: { fs: false, crypto: false, }, }, plugins: [ plugins.provide({ process: 'process/browser', Buffer: ['buffer', 'Buffer'], }), ], }); };
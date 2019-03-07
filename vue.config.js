const path = require('path')
const appData = require('./mock/data.json')
const goods = appData.goods

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  
  devServer: {
    // before(app) {
    //   app.get('/api/goods', function (req, res) {
    //     res.json({
    //       errno: 0,
    //       data: goods
    //     })
    //   })
    // },
    proxy:{
      '/retest': {
        target:'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/retest:': ''
        }
      },
      '/retest/*': {
        target:'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/retest:': ''
        }
      },
      '/users/*': {
        target:'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/users:': ''
        }
      }
    }
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('cmp', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('api'))
      .set('static',resolve('static'))
      .set('views', resolve('src/views'))
  }
}
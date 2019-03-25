import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { initUserInfo } from './util/user'
import Toasted from 'vue-toasted'
import { checkUpdate } from '@/update'
import http from './http'
import FastClick from 'fastclick' //使用 fastclick 解决移动端 300ms 点击延迟
import filters from './filters' //将全部过滤器放在 filters/index.js 中便于管理
//技巧 同时 use 多个插件 被依赖的插件应放在偏后方
import '@/assets/js/protocol'
import '@/assets/js/nano-websocket-client'
// import { emoji } from './util/emoji.js'
import '@/assets/css/lib/reset.css'
import '@/assets/css/lib/border.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import '@/assets/js/share'
import '@/assets/js/share1'
Vue.use(VueAwesomeSwiper)
Vue.prototype.http = http
// 注册全局过滤器
filters(Vue)

Vue.use(Toasted, {
  position: 'bottom-center',
  singleton: true
})
// 给所有路由加上当页面加载的时候滚动条置顶
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
Vue.config.productionTip = false
// FastClick.attach(document.body)

Vue.mixin({
  computed: {
    plusReady() {
      return this.$store.state.isplusReady
    }
  }
})

function renderApp() {
  new Vue({
    router,
    store,
    created() {
      wsStart()
    },
    render: h => h(App)
  }).$mount('#app')
}

function plusReady() {
  checkUpdate()
  // 设置一个全局plusready状态
  store.state.isplusReady = true
  store.state.storageEngine = plus.storage
  plus.screen.lockOrientation('portrait')
  plus.navigator.setFullscreen(false)

  // 设置一个全局plusready状态
  store.state.isplusReady = true
  store.state.storageEngine = plus.storage

  // 监听返回按键
  let now = false
  let time = null
  plus.key.addEventListener('backbutton', function() {
    // 如果是首页则执行退出操作
    if (
      router.currentRoute.path === '/home' ||
      router.currentRoute.path === '/my-center'
    ) {
      time = null
      if (now) {
        now = false
        plus.runtime.quit()
      } else {
        now = true
        plus.nativeUI.toast('再按一次退出', { duration: 'short' })
        time = setTimeout(() => {
          now = false
        }, 1000)
      }
      // 如果是内页则执行路由返回操作
    } else {
      router.go(-1)
    }
  })

  if (process.env.NODE_ENV === 'production') {
    //初始化登录信息
    initUserInfo()

    renderApp()
  }
}

if (window.plus) {
  plusReady()
} else {
  document.addEventListener('plusready', plusReady, false)
}

console.log(window.navigator.appVersion)
if (
  process.env.NODE_ENV === 'development' ||
  window.navigator.appVersion.indexOf('Html5Plus') === -1
) {
  //初始化登录信息
  initUserInfo()

  renderApp()
}

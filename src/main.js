import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import './styles/theme/index.css'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'

import store from './vuex/store'
import Vuex from 'vuex'
import { Toast } from 'vant';
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import router from './routes'
import 'font-awesome/css/font-awesome.min.css'
import echarts from 'echarts'

// 时间格式化
import moment from 'moment'//导入文件
import uploader from 'vue-simple-uploader'

//瀑布流
import {VueMasonryPlugin} from 'vue-masonry'
import VueMasonry from 'vue-masonry-css'

Vue.prototype.$moment = moment;//赋值使用
Vue.prototype.$echarts = echarts;

Vue.use(uploader)
Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(Toast)
Vue.use(VueMasonryPlugin)
Vue.use(VueMasonry);

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')


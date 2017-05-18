// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from 'router';
import store from 'store';
import VueRouter from 'vue-router'
import Lockr from 'lockr';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import 'assets/custom-theme/index.css'; // https://github.com/PanJiaChen/custom-element-theme
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'normalize.css/normalize.css';
import 'styles/index.scss';
import 'components/Icon-svg/index';
import 'assets/iconfont/iconfont';
import * as filters from './filters';
import Multiselect from 'vue-multiselect';
import Sticky from 'components/Sticky';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import vueWaves from './directive/waves';
import vueSticky from './directive/sticky';
import errLog from 'store/errLog';
//import './mock/index.js';
import _g from './assets/js/global'
import 'vue-xlsx-table/dist/style.css'
import vueXlsxTable from 'vue-xlsx-table'
import axios from 'axios'
Vue.use(vueXlsxTable, {rABS: true})

// import './styles/mixin.scss';

// register globally
Vue.component('multiselect', Multiselect);
Vue.component('Sticky', Sticky);
Vue.use(ElementUI);
Vue.use(vueWaves);
Vue.use(vueSticky);
Vue.use(VueRouter)

axios.defaults.baseURL = HOST
axios.defaults.timeout = 1000 * 15
axios.defaults.headers.authKey = Lockr.get('authKey')
axios.defaults.headers.sessionId = Lockr.get('sessionId')
axios.defaults.headers['Content-Type'] = 'application/json'

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true;
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
// register global progress.
const whiteList = ['/login', '/authredirect', '/reset', '/sendpwd'];// 不重定向白名单


router.beforeEach((to, from, next) => {
  NProgress.start();
  if (store.getters.token) {
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (to.meta && to.meta.role) {
        if (hasPermission(store.getters.roles, to.meta.role)) {
          next();
        } else {
          next('/401');
        }
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
});



router.afterEach(() => {
  NProgress.done();
});

// window.onunhandledrejection = e => {
//     console.log('unhandled', e.reason, e.promise);
//     e.preventDefault()
// };

// 生产环境错误日志
if (process.env === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    console.log(err, window.location.href);
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  };
}

window.store = store
window.HOST = HOST
window.axios = axios
window.Lockr = Lockr
window.pageSize = 15
window._g = _g
// window.onerror = function (msg, url, lineNo, columnNo, error) {
//     console.log('window')
// };
//
// console.error = (function (origin) {
//     return function (errorlog) {
//         // handler();//基于业务的日志记录及数据报错
//         console.log('console'+errorlog)
//         origin.call(console, errorlog);
//     }
// })(console.error);

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  render: h => h(App)
}).$mount('#app');



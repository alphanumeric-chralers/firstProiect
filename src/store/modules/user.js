import {logout} from 'api/login';
import { requestLogin,getUserInfo} from 'api/api';
import Cookies from 'js-cookie';

const user = {
  state: {
    user: '',
    status: '',
    username: '',
    code: '',
    uid: undefined,
    auth_type: '',
    token: Cookies.get('X-Ivanka-Token'),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_AUTH_TYPE: (state, type) => {
      state.auth_type = type;
    },
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_UID: (state, uid) => {
      state.uid = uid;
    },
    SET_EMAIL: (state, email) => {
      state.email = email;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    }
  },

  actions: {
    //登录
    requestLogin({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        requestLogin(userInfo).then(response => {
          //const data = response.data;
            console.log(response);
          if(response.code !=200){
              reject(response.message);
              return;
          }
          Cookies.set('X-Ivanka-Token', response.user.username);
          commit('SET_TOKEN', response.user.username);
          commit('SET_EMAIL', response.user.username);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },


     // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
          let para = {
              token: state.token
          };
          getUserInfo(para).then((res) => {
            console.log(res);
            const datas= {

            };
           // data.role=['admin'],
           // data.token= 'admin',
            //data.introduction='我是超级管理员',
           // data.avatar='http://baike.wdzj.com/uploads/201505/143166128711UCnrCf.jpg',
           // data.name='我控制不住我记几啊'
            //const data = response.data;
            commit('SET_ROLES', res.data.data.role);
            commit('SET_NAME', res.data.data.realName);
            commit('SET_AVATAR', res.data.data.avatar);
            commit('SET_INTRODUCTION', res.data.data.introduction);
            resolve(res);
        }).catch(error => {
            reject(error);
        });
      });
    },
    // 第三方验证登录
    LoginByThirdparty({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
          commit('SET_TOKEN', response.data.token);
          Cookies.set('X-Ivanka-Token', response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },


    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          Cookies.remove('X-Ivanka-Token');
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

        // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('X-Ivanka-Token');
        resolve();
      });
    }
  }
};

export default user;

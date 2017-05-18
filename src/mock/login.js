const userMap = {
  admin: {
    role: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'http://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E6%88%91%E6%8E%A7%E5%88%B6%E4%B8%8D%E4%BD%8F%E6%88%91%E8%AE%B0%E5%87%A0%E5%95%8A%E8%A1%A8%E6%83%85&step_word=&hs=2&pn=142&spn=0&di=55386575530&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&istype=0&ie=utf-8&oe=utf-8&in=&cl=2&lm=-1&st=undefined&cs=1937414508%2C2042682881&os=4224435371%2C4235760277&simid=3388590106%2C332491056&adpicid=0&lpn=0&ln=1960&fr=&fmq=1494382397014_R&fm=&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&ist=&jit=&cg=&bdtype=0&oriquery=&objurl=http%3A%2F%2F2t.5068.com%2Fuploads%2Fallimg%2F141209%2F30_141209144910_8.gif&fromurl=ippr_z2C%24qAzdH3FAzdH3Fdp_z%26e3Bcamb_z%26e3Bv54AzdH3Fg6AzdH3Fda89AzdH3F8dalAzdH3F8db00m_z%26e3Bip4s&gsm=96&rpstart=0&rpnum=0',
    name: '超级管理员小潘'
  },
  editor: {
    role: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wdl.wallstreetcn.com/48a3e1e0-ea2c-4a4e-9928-247645e3428b',
    name: '普通编辑小张'

  },
  developer: {
    role: ['develop'],
    token: 'develop',
    introduction: '我是开发',
    avatar: 'https://wdl.wallstreetcn.com/48a3e1e0-ea2c-4a4e-9928-247645e3428b',
    name: '工程师小王'
  }
}

export default {
  loginByEmail: config => {
    const { email } = config.params;
    return new Promise((resolve, reject) => {
      if (userMap[email.split('@')[0]]) {
        setTimeout(() => {
          resolve([200, {
            data: userMap[email.split('@')[0]]
          }]);
        }, 500);
      } else {
        reject('账号不正确')
      }
    })
  },
  getInfo: config => {
    const { token } = config.params;
    return new Promise((resolve, reject) => {
      if (userMap[token]) {
        setTimeout(() => {
          resolve([200, {
            data: userMap[token]
          }]);
        }, 100);
      } else {
        reject('获取失败')
      }
    })
  },
  logout: () => new Promise(resolve => {
    setTimeout(() => {
      resolve([200, { data: 'success' }]);
    }, 100);
  })
};

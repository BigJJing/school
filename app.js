//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var that=this
        var code=res.code;
        var appId = "wxfb03ac0f5300b25d";
        var appSecret = "4d5052c2243d76369fc1e0b8ce63ec2e";
        var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + appSecret + '&js_code='+code+'&grant_type=authorization_code'
        wx.request({
          url: url,
          success(res){ 
            that.globalData.openId = res.data.openid;
            //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
            if (that.useropenIdReadyCallback) {
              that.useropenIdReadyCallback(res)
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openId:"",
    fileIdPre:"cloud://zb-database-cd1fc2.7a62-zb-database-cd1fc2/"    //云文件id前缀
  }
})

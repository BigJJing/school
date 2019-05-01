//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () { 
    try {
      const value = wx.getStorageSync('identity')
      if ("landlord") {
        // Do something with return value
        wx.redirectTo({
          url: '../landlord/landlord'
        })
      }
      else if("renter"){
        console.log(value)
      }
      else{
        console.log(value)
      }
    } catch (e) {
      // Do something when catch error
    }
  /****以下代码是回调函数(为了使app.js中的onLaunch中的success先于onload函数执行，以便防止异步时获取数据错误) ****/
    //如果userinfo已经获取过了，就直接跳转到对应身份的页面
    //通过openId找到对应身份信息
    if (app.globalData.userInfo) {

    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        app.globalData.userInfo=res;
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
        }
      })
    }
    //open_ID
    if (app.globalData.openId) {
      app.globalData.openId = res;
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.useropenIdReadyCallback = res => {
        app.globalData.openId = res.data.openid;
      }
    }
    /*******回调函数  end *****/
  },
  onReady:function(){
    console.log(2)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.rawData
    this.setData({
      userInfo: e.detail.rawData,
      hasUserInfo: true
    })

  },
/********自定义函数********/
  toLandlord: function (e) {
    wx.setStorageSync('identity', 'landlord')
    wx.redirectTo({
      url: '../landlord/landlord'
    })
  },



})

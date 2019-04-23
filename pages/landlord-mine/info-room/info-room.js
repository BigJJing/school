// pages/landlord-mine/info-room/info-room.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取数据库中所有openid的房间类型
    var that = this;
    wx.cloud.init();
    const db = wx.cloud.database();
    db.collection('roomType').where({
      _openid: app.globalData.openId
    }).get({
      success(res) {
        //that.data.id=res.data[0]._id;
        //db.collection('roomType').doc(res.data[0]._id)
        that.setData({
          roomData: res.data
        })
      }
    })
  },

  /** 
  *自定义函数
  */
  toAddPage:function(){
    wx.navigateTo({
      url: '/pages/landlord-mine/modify-room/modify-room?pageType=add',
    })
  }
})
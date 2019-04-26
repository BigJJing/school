// pages/landlord-community/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments:[]   //[["Jan","content...",[..]]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //得到此条说说的评论
    var id=options.id;
    wx.cloud.init();
    const db=wx.cloud.database();
    db.collection('community_articles').doc(id).get({
      success(res){
        console.log(res.data)
        var comments=res.data.comments;
        if(comments==undefined){
          comments=[]
        }
      }
    })
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
    //基本设置
    wx.setNavigationBarColor({
      backgroundColor: "#fff",
      frontColor: "#000000",
      animation: {}
    })
    wx.setNavigationBarTitle({
      title: '评论'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
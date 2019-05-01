// pages/landlord-community/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments:[],   //[["Jan","content...",[..]]
    commentPanel:"small-panel",  //small-panel/big-panel
    isOpen:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
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
        that.setData({
          comments: comments
        })
        var title = res.data.author + " ( " + comments.length+" 评论)"
        //基本设置
        wx.setNavigationBarColor({
          backgroundColor: "#fff",
          frontColor: "#000000",
          animation: {}
        })
        wx.setNavigationBarTitle({
          title: title
        })
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
    
  },
  //自定义事件

  openComment:function(){
    var that=this;
    that.setData({
      commentPanel:"big-panel",
      isOpen:true
    })
  }
})
// pages/landlord-community/writeArticle/writeArticle.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    article:"",
    images_fileID:[]
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
    //基本设置
    wx.setNavigationBarColor({
      backgroundColor: "#fff",
      frontColor: "#000000",
      animation: {}
    })
    wx.setNavigationBarTitle({
      title: '发表说说'
    })
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  deleteImage:function(e){
    var index=e.target.dataset.index;
    var files=this.data.files;
    files.splice(index-1,1);
    this.setData({
      files:files
    })
  },
  publishArticle:function(e){
    //时间，文章内容，图片
    console.log(e)
    console.log(app.globalData.userInfo)
    var that = this;
    var imageFiles = that.data.files;
    if (e.detail.value.article===""){
      wx.showToast({
        title: '内容不能为空哟',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    else if (imageFiles.length>6){
      wx.showToast({
        title: '图片不能超过六张哟',
        icon: 'none',
        duration: 1000
      });
      return false
    }
    else{
      var date = new Date();
      var now = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
      wx.cloud.init();
      const db = wx.cloud.database()
      for (var i = 0; i < imageFiles.length; i++) {
        var imageUrl = imageFiles[i].split("/");
        var name = imageUrl[imageUrl.length - 1]
        var images_fileID = that.data.images_fileID
        wx.cloud.uploadFile({
          cloudPath: "community/article_images/" + name,
          filePath: imageFiles[i],
          success: res => {
            images_fileID.push(res.fileID);
            that.setData({
              images_fileID: images_fileID
            })
            if (images_fileID.length === imageFiles.length) {
              db.collection("community_articles").add({
                data: {
                  time: now,
                  article: e.detail.value.article,
                  images: imageFiles,
                  images_fileID: that.data.images_fileID,
                  author:app.globalData.userInfo.nickName,
                  avatar:app.globalData.userInfo.avatarUrl
                },
                success(res) {
                  wx.showToast({
                    title: '发表成功',
                    icon: 'success',
                    duration: 1000
                  });
                  setTimeout(function () {
                    wx.navigateBack({
                      detal: 1
                    })
                  }, 1000)
                },
                fail(res) {

                }
              })
            }
          }
        })
      }
    }
  }
  

  
})
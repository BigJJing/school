// pages/landlord-community/writeActive/writeActive.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date_start: "",
    time_start: "",
    date_end: "",
    time_end: "",
    activeDetail:{
      length:0
    },
    form:{
      title_success:true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date=new Date();
    var month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth(date.getMonth().length)
    var day=date.getDate() < 10 ? '0'+ date.getDate() : date.getDate()
    var nowDate = date.getFullYear() + "-" + month + "-" + day;
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var nowTime = hour + ":" + minute
    this.setData({
      date_start: nowDate,
      time_start: nowTime,
      date_end: nowDate,
      time_end: nowTime
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
      title: '发起活动'
    })
  },
  bindStartDateChange: function (e) {
    this.setData({
      date_start: e.detail.value
    })
  },
  bindEndDateChange: function (e) {
    this.setData({
      date_end: e.detail.value
    })
  },
  bindStartTimeChange: function (e) {
    this.setData({
      time_start: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      time_end: e.detail.value
    })
  },
  contentChange:function(e){
    var len = e.detail.value.length
    this.setData({
      activeDetail: {
        length: len
      }
    })
  },
  submitForm:function(e){
    var that=this
    if(e.detail.value.title==""){
      wx.showToast({
        title: '活动标题不能为空',
        icon: 'none',
        duration: 1000
      });
      that.setData({
        form: {
          title_success: false
        }
      })
      return false;
    }
    else{
      wx.cloud.init();
      const db=wx.cloud.database();
      var startTime = that.data.date_start
      console.log(startTime)
      db.collection("community_actives").add({
        data:{
          title:e.detail.value.title,
          content:e.detail.value.content,
          start_time:that.data.date_start+" "+that.data.time_start,
          end_time:that.data.date_end+" "+that.data.time_end
        },
        success(res){
          console.log(res);
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
        fail(err){
          console.log(err)
        }
      })
    }
  }
})
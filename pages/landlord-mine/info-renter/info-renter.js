// pages/landlord-mine/info-renter/info-renter.js
var app = getApp(); //使用app全局变量，app.globalData.openId：调用全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: app.globalData.openId,
    id:"",  //在没有数据的情况下,id=""
    renterName:"真实的姓名",
    //renterSex=sexArray[index],
    renterTel:"租客能更快联系上你",
    idCard:"身份证完整审核通过率更高",
    sexArray:["男","女"],
    index:0    //通过改变index切换性别
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //通过openid取id
    wx.cloud.init();
    const db = wx.cloud.database();
    db.collection('renter').where({
      _openid: that.data.openId
    }).get({
      success(res) {
        if (res.data !== "") {
          that._changeData(res.data[0])
          that.data.id = res.data[0]._id
        }
      },
      fail(res){
        console.log(res)
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
      backgroundColor: "#f8f8f8",
      frontColor: "#000000",
      animation: {}
    })
    wx.setNavigationBarTitle({
      title: '房东基本信息'
    })
  },
  /**
  * 自定义函数
  */

  // 根据数据库里的数据改变显示文字
  _changeData: function (data) {
    var that = this
    if (data.name !== "" && data.name !== undefined) {
      that.setData({
        renterName: data.name
      })
    }
    if (data.tel !== "" && data.tel !== undefined) {
      that.setData({
        renterTel: data.tel
      })
    }
    if (data.sex !== "" && data.sex !== undefined) {
      that.setData({
        renterSex: data.sex
      })
    }
    if (data.idCard !== "" && data.idCard !== undefined) {
      that.setData({
        idCard: data.idCard
      })
    }
  },
  //切换性别
  sexChange:function(e){
    var that=this;
    var id = that.data.id;
    var sex = that.data.sexArray[e.detail.value];
    console.log(id)
    const db = wx.cloud.database()
    //没有数据，则直接插入
    if (id == "") {
      db.collection('renter').add({
        data: {
          sex: sex
        },
        success(res) {
          console.log(res);
          //修改id为此时_id的值
          db.collection('renter').where({
            _openid: that.data.openId
          }).get({
            success(res) {
              if (res.data !== "") {
                that.data.id = res.data[0]._id
              }
            }
          })
        }
      })
    }
    //有数据则更新
    else {
      db.collection('renter').doc(id).update({
        data: {
          sex: sex
        },
        success(res) {
          console.log(res)
        }
      })
    }
    //更新性别
    that.setData({
      index:e.detail.value
    })
  },
  //单个更新显示数据
   _updateName: function (value) {
    this.setData({
      renterName: value
    })
  },
  _updateTel: function (value) {
    this.setData({
      renterTel: value
    })
  },
  _updateIdCard: function (value) {
    this.setData({
      idCard: value
    })
  }
})
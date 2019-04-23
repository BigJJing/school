// pages/landlord-mine/info-apartment/info-apartment.js
var app = getApp(); //使用app全局变量，app.globalData.openId：调用全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:app.globalData.openId,
    id:"",    //在没有任何数据的情况下 ， id=""
    apartmentName: "公寓名",
    region: ["全部", "全部", "全部"],
    detailAddress: "详细地址",
    apartmentTel: "公寓电话"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通过openid取id
    var that=this;
    wx.cloud.init();
    const db = wx.cloud.database();
    db.collection('roomType').where({
      _openid: that.data.openId
    }).get({
      success(res) {
        if(res.data !== ""){
          that._changeData(res.data[0])
          that.data.id = res.data[0]._id
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
      backgroundColor: "#f8f8f8",
      frontColor: "#000000",
      animation: {}
    })
    wx.setNavigationBarTitle({
      title: '公寓基本信息'
    })
  },
  /**
  *自定义函数
  */
  //改变省县区
  regionChange:function(e){
    //获取id -> 根据id更新
    var id=this.data.id;
    console.log(id)
    const db = wx.cloud.database()
    //没有数据，则直接插入
    if(id==""){
      db.collection('apartment').add({
        data:{
          region: e.detail.value
        },
        success(res){
          console.log(res);
          //修改id为此时_id的值
          db.collection('apartment').where({
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
    else{
      db.collection('apartment').doc(id).update({
        data: {
          region: e.detail.value
        },
        success(res) {
          console.log(res)
        }
      })
    }
    this.setData({
      region:e.detail.value
    })
  },
  // 根据数据库里的数据改变显示文字
  _changeData:function(data){
    var that=this
    if (data.name !== "" && data.name !== undefined) {
      that.setData({
        apartmentName: data.name
      })
    }
    if (data.tel !== "" && data.tel !== undefined){
      that.setData({
        apartmentTel: data.tel
      })
    }
    if (data.region !== "" && data.region !== undefined){
      that.setData({
        region:data.region
      })
    }
    if (data.detailAddress !== "" && data.detailAddress !== undefined) {
      that.setData({
        detailAddress: data.detailAddress
      })
    }
  },
  _updateName:function(value){
    this.setData({
      apartmentName: value
    })
  },
  _updateTel: function (value) {
    this.setData({
      apartmentTel: value
    })
  },
  _updateAddress: function (value) {
    this.setData({
      detailAddress: value
    })
  }

  

})
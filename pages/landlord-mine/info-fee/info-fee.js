// pages/landlord-mine/info-fee/info-fee.js
var app = getApp(); //使用app全局变量，app.globalData.openId：调用全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: app.globalData.openId,
    id: 0,    //在没有任何数据的情况下 ， id=""
    waterFee: "",
    electricityFee: "",
    managementFee: "",
    networkFee: "",
    waterFeeArray: [[0,1,2,3,4,5,6,7,8,9],[0,1,2,3,4,5,6,7,8,9]],
    managementFeeArray: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
    windex:[0,0],
    eindex:[0,0],
    mindex:[0,0,0],
    nindex:[0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通过openid取id
    var that = this;
    wx.cloud.init();
    const db = wx.cloud.database();
    db.collection('apartment').where({
      _openid: that.data.openId
    }).get({
      success(res) {
        console.log(res)
        if (res.data !== "") {
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
      title: '费用信息'
    })
  },

  /**
   * 自定义函数
   */
  // 根据数据库里的数据改变显示文字
  _changeData: function (data) {
    var that = this
    if (data.waterFee !== "" && data.waterFee !== undefined) {
      //水费为6.0 ,分解成6和0
      var feeArr = data.waterFee.split(".");
      console.log(feeArr)
      that.setData({
        windex: [feeArr[0], feeArr[1]]
      })
    }
    if (data.electricityFee !== "" && data.electricityFee !== undefined) {
      var feeArr = data.electricityFee.split(".");
      console.log(feeArr)
      that.setData({
        eindex: [feeArr[0], feeArr[1]]
      })
    }
    if (data.managementFee !== "" && data.managementFee !== undefined) {
      //管理费为120，分解成1,2,0
      var hundred = parseInt(data.managementFee / 100);      
      var ten = parseInt((data.managementFee - hundred * 100) / 10);
      var single = data.managementFee - hundred * 100 - ten * 10;
      that.setData({
        mindex: [hundred, ten, single]
      })
    }
    if (data.networkFee !== "" && data.networkFee !== undefined) {
      var hundred = parseInt(data.networkFee / 100);
      var ten = parseInt((data.networkFee - hundred * 100) / 10);
      var single = data.networkFee - hundred * 100 - ten * 10;
      that.setData({
        nindex: [hundred, ten, single]
      })
    }
  },

  //修改水费
  changeWaterFee:function(e){
    var arr=e.detail.value;
    var str=arr[0]+"."+arr[1];
    console.log(str)
    //将str存入数据库
    console.log(this.data.id)
    this._changeDatabase({waterFee:str})
    this.setData({
      windex: [e.detail.value[0], e.detail.value[1]]
    })
  },
  //修改电费
  changeElectricityFee: function (e) {
    var arr = e.detail.value;
    var str = arr[0] + "." + arr[1];
    console.log(str)
    //将str存入数据库
    this._changeDatabase({ electricityFee: str })
    this.setData({
      eindex: [e.detail.value[0], e.detail.value[1]]
    })
  },
  //修改管理费
  changeManagementFee: function (e) {
    var arr = e.detail.value;
    var str = ""+arr[0]+arr[1]+arr[2]
    console.log(str)
    //将str存入数据库
    this._changeDatabase({ managementFee: str })
    this.setData({
      mindex: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    })
  },
  //修改网费
  changeNetworkFee: function (e) {
    var arr = e.detail.value;
    var str = "" + arr[0] + arr[1] + arr[2]
    console.log(str)
    //将str存入数据库
    this._changeDatabase({ networkFee: str })
    this.setData({
      nindex: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    })
  },
  //将数据存入数据库
  _changeDatabase:function(opt){
    var that=this;
    var db=wx.cloud.database();
    var id=that.data.id;
    //id为空时，add数据
    if(id==""){
      db.collection('apartment').add({
        data:opt,
        success(res){
          console.log(res);
          //找到此时的id
          db.collection('apartment').where({
            _openid:that.data.openId
          }).get({
            success(res){
              console.log(res.data);
              that.data.id=res.data._id;
            }
          })
        }
      })
    }
    //id不为空时，update数据
    else{
      db.collection('apartment').doc(id).update({
        data:opt,
        success(res){
          console.log(res)
        }
      })
    }
  }

})
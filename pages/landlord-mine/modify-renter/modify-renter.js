// pages/landlord-mine/modify-renter/modify-renter.js0
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType: "",   //页面类别:name,tel,detailAddress
    renterName: "",
    renterTel: "",
    idCard: "",
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type
    console.log(type)
    //同步上一页的数据
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];
    console.log(prePage.data)
    this.setData({
      pageType: type,
      renterName: prePage.data.renterName,
      renterTel: prePage.data.renterTel,
      idCard: prePage.data.idCard
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
    var navTitle = ""
    if (this.data.pageType == "name") {
      navTitle = "姓名"
    }
    else if (this.data.pageType == "tel") {
      navTitle = "联系电话"
    }
    else if (this.data.pageType == "idCard") {
      navTitle = "身份证号"
    }
    wx.setNavigationBarTitle({
      title: navTitle
    })
  },

  /**
   * 自定义函数
   */
  inputChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  saveApartmentName: function () {
    var that = this
    var inputValue = that.data.inputValue
    if (inputValue !== "") {
      wx.cloud.init();
      const db = wx.cloud.database();
      //得到apartment表中openid为用户openId的_id
      db.collection('renter').where({
        _openid: app.globalData.openId
      }).get({
        success(res) {
          //没有这个openid的数据  
          if (res.data == "") {

            //直接插入数据
            if (that.data.pageType == "name") {
              that._insert(db, 'renter', { name: inputValue })
            }
            else if (that.data.pageType == "tel") {
              that._insert(db, 'renter', { tel: inputValue })
            }
            else if (that.data.pageType == "idCard") {
              that._insert(db, 'renter', { idCard: inputValue })
            }
          }
          else {
            var id = res.data[0]._id;
            //数据库，集合名，查询的id，{要更新的字段名:值,...}
            if (that.data.pageType == "name") {
              that._updata(db, 'renter', id, { name: inputValue })
            }
            else if (that.data.pageType == "tel") {
              that._updata(db, 'renter', id, { tel: inputValue })
            }
            else if (that.data.pageType == "idCard") {
              that._updata(db, 'renter', id, { idCard: inputValue })
            }
          }
          that._changePrePage(inputValue);
          //成功后的提示
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({
              detal: 1
            })
          }, 1000)
        },
        fail(res) {
          console.log(res)
        }
      })
    }
    else {
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 1000
      })
      return;
    }
  },

  //根据id更新数据
  _updata: function (db, form, id, opt) {   //数据库，集合名，查询的id，data里面的数据{name:'55'}  
    db.collection(form).doc(id).update({
      data: opt,
      success(res) {
        //console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  //插入数据
  _insert: function (db, form, opt) {   //数据库，集合名，data里面的数据{name:'55'}  
    db.collection(form).add({
      data: opt,
      success(res) {
        //console.log(res)
      },
      fail(res) {
        //console.log(res)
      }
    })
  },
  //同步更新上一页的数据  
  _changePrePage(data) {
    var that = this
    var pages = getCurrentPages();
    var prePage = pages[pages.length - 2];   //上一页
    console.log(that.data.pageType)
    if (that.data.pageType == "name") {
      prePage._updateName(data)
    }
    else if (that.data.pageType == "tel") {
      prePage._updateTel(data)
    }
    else if (that.data.pageType == "idCard") {
      prePage._updateIdCard(data)
    }
  },
  globalData: {
    id: ""
  }
})
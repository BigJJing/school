// pages/landlord-mine/modify-room/modify-room.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType:"",
    roomTypeArr:[   //房间类型 N室N厅的选择
      [0,1,2,3,4,5,6,7,8,9],[0,1,2,3,4,5,6,7,8,9]
    ],    
    rindex:[0,0],   //房间类型的value
    dindex:[0,0],    //押付的value
    roomConfig:[],  //房间配置的集合，通过数据库获得
    roomConfigSelected:[], //已选择的房间配置
    roomImages: [], 
    roomImageNum: 0,
    isSubmit:false   //是否提交表单成功
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //拿到所有配置的数据
    wx.cloud.init();
    const db=wx.cloud.database();
    db.collection('roomConfig').get({
      success(res){
        that.setData({
          roomConfig:res.data
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
    var that=this
    var para = that._getUrlPara();  //获取url参数
    if (para.pageType == "add") {
      that.setData({
        pageType: 'add'
      })
      console.log(1)
    }
    else {
      var id = para.roomId;
      //找数据 ，填数据
      wx.cloud.init();
      const db = wx.cloud.database();
      db.collection('roomType').where({
        _id: id
      }).get({
        success(res) {
          var data = res.data[0];
          var roomConfig = that._findSelectedRoomConfig(data.config)
          //获取roomConfigSelected
          that.setData({
            pageType: 'change',
            rindex: data.houseType,
            dindex: data.deposit,    //押付的value
            roomConfigSelected: roomConfig.roomConfigSelected, //已选择的房间配置
            roomConfig: roomConfig.roomConfig,
            roomImages: data.images,
            roomImageNum: data.images.length,
            typeName: data.typeName,
            monthRent: data.monthRent,
            area: data.area,
            publishTitle: data.publishTitle,
            publishDescription: data.publishDescription,
            existenceImage: data.images
          })

        }
      })
    }
  },
  onUnload: function(){
    console.log(this.data.isSubmit)
    //没有提交表单，且点击了返回按钮，则要清除当前已经添加进云文件中的图片
    var that=this
    if (!that.data.isSubmit){
      console.log(that.data.roomImages);
      var nowImages = that.data.roomImages;
      var preImages = that.data.existenceImage;
      var images=[]
      for (var i in nowImages){
        for(var j in preImages){
          if (preImages[j] !== nowImages[i]){
            images.push(nowImages[i])
          }
        }
      console.log(images)
      }
    }
  },
  /**
   * 自定义函数
   */
  //选择房型
  changeRoomType:function(e){
    var that=this;
    that.setData({
      rindex:[e.detail.value[0],e.detail.value[1]]
    })
  },
  //选择押付
  changeDeposit: function (e) {
    var that = this;
    that.setData({
      dindex: [e.detail.value[0], e.detail.value[1]]
    })
  },
  //添加房间配置：点击房间配置中的一个
  addConfig:function(e){
    var id=e.currentTarget.id;
    var roomConfig=this.data.roomConfig;
    var roomConfigSelected=this.data.roomConfigSelected;
    for(var i in roomConfig){
      if(roomConfig[i]._id==id){
        if (roomConfig[i].isSelected){
          roomConfig[i].isSelected = "";
          //将roomConfig[i]从roomConfigSelected中移除
          this._removeByIndex(roomConfigSelected, roomConfig[i])
        }
        else{
          //将roomConfig[i]存入roomConfigSelected
          roomConfig[i].isSelected = true;
          roomConfigSelected[roomConfigSelected.length] = roomConfig[i]
        }
      }
    }
    this.setData({
      roomConfig: roomConfig,
      roomConfigSelected: roomConfigSelected
    })
  },
  //找到数组中值为val的索引
  _findIndex:function(arr,val){
    for(var i in arr){
      if(arr[i]==val){
        return i;
      }
    }
    return -1;
  },
  //根据索引移除数组中的值为val的元素
  _removeByIndex:function(arr,val){
    var index=this._findIndex(arr,val);
    if(index>-1){
      arr.splice(index,1);
    }
  },

  imagesEvent:function(e){
    var roomImages=e.detail.imageData;
    var roomImageNum = roomImages.length;
    console.log(roomImages)
    this.setData({
      roomImages: roomImages,
      roomImageNum: roomImageNum
    })
  },
  //提交表单
  submitForm:function(e){
    var that=this
    var typeName=e.detail.value.type;   //类型名
    var monthRent = e.detail.value.monthRent;   //月租金
    var houseType = that.data.rindex;   //房型
    var deposit = that.data.dindex;     //押付
    var config = that._doDealWithConfig(that.data.roomConfigSelected);
    if (typeName == ""){
      wx.showToast({
        title: '类型名不能为空哟',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (monthRent == "") {
      wx.showToast({
        title: '月租金不能为空哟',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    
    wx.cloud.init();
    const db = wx.cloud.database();
    //添加
    if(that.data.pageType == 'add'){
      db.collection('roomType').where({
        _openid: app.globalData.openId,
        typeName: typeName
      }).get({
        success(res) {
          console.log(res.data.length)
          //类型名不能重复
          if(res.data.length>0){
            wx.showToast({
              title: '类型名不能重复哟',
              icon: 'none',
              duration: 1000
            })
            return;
          }
          else{
            //直接添加
            db.collection('roomType').add({
              data: {
                typeName: typeName,
                monthRent: monthRent,
                houseType: houseType,
                deposit: deposit,
                area: e.detail.value.area,
                config: config,
                images: that.data.roomImages,
                publishTitle: e.detail.value.publishTitle,
                publishDescription: e.detail.value.publishDescription
              },
              success(res) {
                console.log(res)
                that.setData({
                  isSubmit:true
                })
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
              }
            })
          }
          
        },
        fail(res) {
          console.log(res);
        }
      })
    }else{
      //更新数据
      db.collection('roomType').where({
        _openid: app.globalData.openId,
        typeName: typeName
      }).get({
        success(res){
          var id=res.data[0]._id;
          db.collection('roomType').doc(id).update({
            data:{
              typeName: typeName,
              monthRent: monthRent,
              houseType: houseType,
              deposit: deposit,
              area: e.detail.value.area,
              config: config,
              images: that.data.roomImages,
              publishTitle: e.detail.value.publishTitle,
              publishDescription: e.detail.value.publishDescription
            },
            success(res){
              console.log(res)
              that.setData({
                isSubmit: true
              })
              //成功后的提示
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.navigateBack({
                  detal: 1
                })
              }, 1000)
            }
          })
        }
      })
    }
  },
  //将房间配置的id记录
  _doDealWithConfig:function(data){
    var id=[];
    for(var i in data){
      id[i]=data[i]._id;
    }
    return id;
  },
  //获取当前页url的参数
  _getUrlPara:function(){ 
      var pages=getCurrentPages();            //获取加载的页面
      var currentPage=pages[pages.length-1];  //获取当前页面
      var url=currentPage.route;              //获取url
      var options=currentPage.options;        //获取参数
      return options
  }, 
  //通过id找到相应的selectedRoomConfig
  _findSelectedRoomConfig:function(arr){
    var that=this
    var selected = []
    var roomConfig=that.data.roomConfig;
    console.log(roomConfig);    
    for (var i in roomConfig) {
      roomConfig[i].isSelected = "";
    }
    for(var i = 0; i < arr.length; i++){
      for (var j = 0; j < roomConfig.length; j++){
        if (arr[i] == roomConfig[j]._id){
          selected[i] = roomConfig[j];
          selected[i].isSelected ="true";
          roomConfig[j].isSelected="true"
        }
      }
    }
    return {
      roomConfigSelected: selected,
      roomConfig: roomConfig
    }
  },
  deleteRoomType:function(e){
    var that=this;
    wx.cloud.init();
    const db=wx.cloud.database();
    db.collection('roomType').where({
      typeName:that.data.typeName
    }).get({
      success(res){
        var id=res.data[0]._id;
        db.collection('roomType').doc(id).remove({
          success(res){
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.navigateBack({
                detal: 1
              })
            }, 1000)
          }
        })
      }
    })
  }

})
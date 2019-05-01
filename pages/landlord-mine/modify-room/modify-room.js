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
    isSubmit:false,   //是否提交表单成功
    files: [],
    images_fileID:[],
    images_fileID_before:[]
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
          console.log(res)
          var data = res.data[0];
          var roomConfig = that._findSelectedRoomConfig(data.config)
          //获取roomConfigSelected
          that.setData({
            pageType: 'change',
            rindex: data.houseType,
            dindex: data.deposit,    //押付的value
            roomConfigSelected: roomConfig.roomConfigSelected, //已选择的房间配置
            roomConfig: roomConfig.roomConfig,
            typeName: data.typeName,
            monthRent: data.monthRent,
            area: data.area,
            publishTitle: data.publishTitle,
            publishDescription: data.publishDescription,
            files: data.images,
            images_fileID:data.images_fileID,
            images_fileID_before:data.images_fileID
          })

        }
      })
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
  //提交表单
  submitForm:function(e){
    var that=this
    var typeName=e.detail.value.type;   //类型名
    var monthRent = e.detail.value.monthRent;   //月租金
    var houseType = that.data.rindex;   //房型
    var deposit = that.data.dindex;     //押付
    var config = that._doDealWithConfig(that.data.roomConfigSelected);
    var imageFiles = that.data.files;
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
            //上传图片
            for (var i = 0; i < imageFiles.length; i++) {
              var imageUrl = imageFiles[i].split("/");
              var name = imageUrl[imageUrl.length - 1]
              var images_fileID = that.data.images_fileID
              wx.cloud.uploadFile({
                cloudPath: "landlord-mine/apartment/"+app.globalData.openId+"/"+ name,
                filePath: imageFiles[i],
                success: res => {
                  images_fileID.push(res.fileID);
                  that.setData({
                    images_fileID: images_fileID
                  })
                  if (images_fileID.length === imageFiles.length) {
                    //直接添加
                    db.collection('roomType').add({
                      data: {
                        typeName: typeName,
                        monthRent: monthRent,
                        houseType: houseType,
                        deposit: deposit,
                        area: e.detail.value.area,
                        config: config,
                        publishTitle: e.detail.value.publishTitle,
                        publishDescription: e.detail.value.publishDescription,
                        images: imageFiles,
                        images_fileID: that.data.images_fileID
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
                }
              })
            }
            
          }
          
        },
        fail(res) {
          console.log(res);
        }
      })
    }
    else{
      //更新数据
      //删除所有图片

      //上传图片
      console.log(1)
      for (var i = 0; i < imageFiles.length; i++) {
        var imageUrl = imageFiles[i].split("/");
        var name = imageUrl[imageUrl.length - 1]
        var images_fileID = that.data.images_fileID
        wx.cloud.uploadFile({
          cloudPath: "landlord-mine/apartment/"+app.globalData.openId+"/"+ name,
          filePath: imageFiles[i],
          success: res => {
            images_fileID.push(res.fileID);
            that.setData({
              images_fileID: images_fileID
            })
            if (images_fileID.length === imageFiles.length) {
              //数据
              db.collection('roomType').where({
                _openid: app.globalData.openId,
                typeName: typeName
              }).get({
                success(res){
                  console.log(res)
                  var id=res.data[0]._id;
                  db.collection('roomType').doc(id).update({
                    data:{
                      typeName: typeName,
                      monthRent: monthRent,
                      houseType: houseType,
                      deposit: deposit,
                      area: e.detail.value.area,
                      config: config,
                      publishTitle: e.detail.value.publishTitle,
                      publishDescription: e.detail.value.publishDescription,
                      images: imageFiles,
                      images_fileID: that.data.images_fileID
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
          }
        })
      }
     
      
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

})
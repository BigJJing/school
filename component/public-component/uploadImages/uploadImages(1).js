var app=getApp()
// component/public-component/uploadImages/uploadImages.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    images: Array,
    roomId:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 0,     //count=imgUrl.length
    imgUrl: [],   //结束后将imgUrl返回page记录下来
    cloudPath: [], //在云文件中的存储位置：fileId=app.global.fileIdPre+cloudPath
    imageNum:0,    //记录图片数量
  },
  /**
   * 组件所在页面的生命周期
   */
  lifetimes: {
    ready() {
      var that = this;
      var images = that.data.images;
      var imgUrl=[];
      var cloudPath=[];
      for(var i in images){
        imgUrl.push(images[i][0])
        cloudPath.push(images[i][1])
      }
      // 在组件实例进入页面节点树时执行
      that.setData({
        imgUrl: imgUrl,  
        cloudPath: cloudPath,
        count:imgUrl.length
      })
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //上传
    doUpload:function(){
      var that=this;
      var imgLength = that.data.images.length
      var maxLength = 8 - imgLength
      wx.chooseImage({
        count: 8,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(res) {
          var imgUrl = that.data.imgUrl;
          var filePath = res.tempFilePaths;
          if (imgUrl.length !== 0) {
            imgUrl = imgUrl.concat(filePath)
          }
          else {
            imgUrl = filePath
          }
          //将记录传回页面
          that.setData({
            imgUrl: imgUrl
          })
          that.sendDataToPage(filePath)
          /*
          //上传图片
          var cloudPath = [];
          for (var i in filePath) {
            //获取数据库中图片数量count，通过“count.后缀”来添加图片保证图片不覆盖 + "/" +  
            var url = "images-roomType/" + app.globalData.openId + "/" + that.data.roomId + "/" + that.data.count + filePath[i].match(/\.[^.]+?$/)[0];
            cloudPath.push(url);
            that.setData({
              count: that.data.count + 1,
              cloudPath: cloudPath
            })
            wx.cloud.uploadFile({
              cloudPath: url,
              filePath: filePath[i],
              success:res=>{
                console.log("上传成功");
                //将记录传回页面
                that.setData({
                  imgUrl: imgUrl
                })
                that.sendDataToPage(imgUrl)
              },
              fail:res=>{
                console.log(res)
              }
            })
          }
          */
        },
      })
      
    },
    //删除图片 
    doDelete:function(e){
      //数据库中删除
      var that = this;
      var index = e.target.id;
      var imgUrl = that.data.imgUrl;
      imgUrl.splice(index, 1);
      that.setData({
        imgUrl: imgUrl,
        count: that.data.count - 1
      })
      /*
      //云存储中删除：获取此云文件id
      var cloudPath = that.data.cloudPath
      var fileId = app.globalData.fileIdPre + cloudPath[index]
      wx.cloud.deleteFile({
        fileList:[fileId],
        success:res=>{
          console.log("删除成功");
          //将记录传回页面
          that.sendDataToPage(imgUrl)
        },
        fail:res=>{
          console.log(res)
        }
      })     
      */
    },
  
    //将数据传递到页面
    sendDataToPage: function (imgUrl){
      var that=this
      //var cloudPath = that.data.cloudPath;
      //var imageData = []
      /*
      for (var i in imgUrl) {
        //imageData[i] = [imgUrl[i], cloudPath[i]]
      }    
      */
      const myEventDetail = { imgUrl } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      that.triggerEvent('myevent', myEventDetail, myEventOption)
    }
  
  
  /*
    //将[imgUrl,cloudPath]存入数据库
    _saveData:function(){
      var that=this;
      var id="";
      //定义数据
      var data=[];
      var imgUrl = that.data.imgUrl;
      var cloudPath = that.data.cloudPath;
      for (var i in imgUrl){
        data[i] = [imgUrl[i], cloudPath[i]]
      }
      console.log(data)
      //找
      wx.cloud.init();
      const db = wx.cloud.database();
      db.collection('roomType').where({
        _openid:app.globalData.openId
      }).get({
        success(res){
          console.log(res);
          if(res.data==""){
            //直接插入数据 add
            db.collection('roomType').add({
              data: {
                images:data
              },
              success(res){
                console.log(res)
              }
            })
          }
          else{
            //找到id后更新数据
            id=res.data[0]._id;
            db.collection('roomType').doc(id).update({
              data:{
                images:data
              },
              success(res){
                console.log(res);
              }
            })

          }
        }
      })
    }
    */
  }
})

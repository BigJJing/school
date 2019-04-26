var app=getApp();
// component/landlord-component/communityPage-component/communityPage-component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    addBtnClass:"add_short",
    nowPage:"articles",    
    articleData:[],       //保存所有文章数据
    isLike:[],         //是否点赞
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showInput: function () {
      this.setData({
        inputShowed: true
      });
    },
    hideInput: function () {
      this.setData({
        inputVal: "",
        inputShowed: false
      });
    },
    clearInput: function () {
      this.setData({
        inputVal: ""
      });
    },
    inputTyping: function (e) {
      this.setData({
        inputVal: e.detail.value
      });
    },
    tapAdd:function(e){
      if (this.data.addBtnClass =="add_short"){
        this.setData({
          addBtnClass:"add_long"
        })
      }
      else{
        this.setData({
          addBtnClass: "add_short"
        })
      }
    },
    toArticlesPage:function(){
      this.setData({
        nowPage:'articles'
      })
    },
    toActivesPage:function(){
      this.setData({
        nowPage: 'actives'
      })
    },
    //点赞
    doLike:function(e){
      var that=this;
      var isLike=that.data.isLike;
      if(isLike[e.target.dataset.num]===1){
        isLike[e.target.dataset.num]=undefined
      }
      else{
        isLike[e.target.dataset.num]=1
      }
      that.setData({
        isLike:isLike
      })
      console.log(that.data.isLike)
    }
  },
  /*
  *生命周期
  */
  lifetimes: {
    created() {
      wx.setNavigationBarColor({
        backgroundColor: "#f8f8f8",
        frontColor: "#000000",
        animation: {}
      });
     
    },
    attached() {
      // 在组件实例进入页面节点树时执行
      //取数据
      var that = this;
      wx.cloud.init();
      const db = wx.cloud.database();
      db.collection('community_articles').get({
        success(res) {
          console.log(res);
          var data = res.data;
          data.reverse();
          var openId=app.globalData.openId;
          var isLike=[];
          for(var i=0;i<data.length;i++){
            if(data[i].like!==undefined){
              var arr=data[i].like;
              if(arr.indexOf(openId)!==-1){
                isLike[i]=1;
              }
            }
          }
          console.log(isLike)
          that.setData({
            articleData: data,
            isLike:isLike
          })
          console.log(that.data.isLike)
        }
      }) 
      
    },   
    detached() {
      //将点赞记录传入数据库
      var that = this;
      var openId=app.globalData.openId;
      var like = that.data.isLike;
      var articleData = that.data.articleData;
      console.log(articleData)
      console.log(like)
      for (var i = 0; i < like.length; i++) {
        var id = articleData[i]._id;
        var existLike = articleData[i].like;
        if (existLike == undefined) {
          existLike = [];
        }
        var index=existLike.indexOf(openId)
        //传入数据库
        wx.cloud.init();
        const db = wx.cloud.database();
        //增加点赞记录
        if (like[i] === 1) {

          console.log(existLike)
          //用户没有点过赞，就添加该用户的赞        
          if(index==-1){
            existLike.push(app.globalData.openId);
            db.collection('community_articles').doc(id).update({
              data: {
                like: existLike
              },
              success(res) {
                console.log(res)
              }
            })
          }
        }
        //如果是undefined，则判断是不是取消点赞
        else{
          //用户点过赞
          if(index!==-1){
            existLike.splice(index,1);
            db.collection('community_articles').doc(id).update({
              data: {
                like: existLike
              },
              success(res) {
                console.log(res)
              }
            })
          }
        }
      }
    }
  },

  pageLifetimes:{
    show(){
      this.setData({
        addBtnClass: "add_short"
      })
      //取数据
      var that = this;
      wx.cloud.init();
      const db = wx.cloud.database();
      db.collection('community_articles').get({
        success(res) {
          console.log(res);
          var data = res.data;
          data.reverse();
          that.setData({
            articleData: data
          })
        }
      }) 
    }
    
  }
})

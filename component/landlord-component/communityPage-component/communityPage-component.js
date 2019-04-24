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
      console.log(e);
      var that=this;
      var isLike=that.data.isLike;
      if(isLike[e.target.dataset.num]===1){
        isLike[e.target.dataset.num]=""
      }
      else{
        isLike[e.target.dataset.num]=1
      }
      that.setData({
        isLike:isLike
      })
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
          that.setData({
            articleData: data
          })
        }
      }) 
      
    },   
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
    },
    hide(){
      //将点赞记录传入数据库
      var that=this;
      var like=that.data.isLike;
      var articleData=that.data.articleData;
      for(let i=0;i<like.length;i++){
        if(like[i]===1){
          var id=articleData[i]._id;
          //传入数据库
          wx.cloud.init();
          const db=wx.cloud.database();
          var existLike=articleData[i].like;
          if(existLike==undefined){
            existLike=[]
          }
          existLike.push(app.globalData.openId)
          console.log(existLike)
          db.collection('community_articles').doc(id).update({
            data:{
              like:existLike
            },
            success(res){
              console.log(res)
            }
          })
        }
      }
    }
  }
})

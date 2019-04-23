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
    nowPage:"articles"
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
      })
    },
    ready(){
      //取数据
      var that=this;
      wx.cloud.init();
      const db=wx.cloud.database();
      db.collection('community_articles').get({
        success(res){
          console.log(res);
          that.setData({
            articleData:res.data
          })
        }
      })
    }
  },
  pageLifetimes:{
    show(){
      this.setData({
        addBtnClass: "add_short"
      })
    }
  }
})

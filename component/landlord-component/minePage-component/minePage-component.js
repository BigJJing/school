// component/landlord-component/minePage-component/minePage-component.js
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

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  /*
  *生命周期
  */
  lifetimes:{
    created(){
      wx.setNavigationBarColor({
        backgroundColor:"#fff",
        frontColor:"#000000",
        animation:{}
      })
    }
  }
})

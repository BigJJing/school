// pages/landlord/landlord.js
Page({

  /**
   * 页面的初始数据
   * "apartmentPage":"/component/landlord-component/apartmentPage-component/apartmentPage-component",
    "communityPage": "/component/landlord-component/communityPage-component/communityPage-component",
    "minePage": "/component/landlord-component/minePage-component/minePage-component"
   */
  data: {
    nowPage: "firstPage",   //firstPage , apartmentPage , communityPage , minePage
    nowIndex: 0,
    tabBar: [
      {
        "iconClass": "iconfont icon-shouye",
        "text": "首页",
        "tapFunction": "toFirstPage",
        "active": "active"
      },
      {
        "iconClass": "iconfont icon-shafa",
        "text": "公寓管理",
        "tapFunction": "toApartmentPage",
        "active": ""
      },
      {
        "iconClass": "iconfont icon-faxianliulan",
        "text": "社区",
        "tapFunction": "toCommunityPage",
        "active": ""
      },
      {
        "iconClass": "iconfont icon-wode",
        "text": "我的",
        "tapFunction": "toMinePage",
        "active": ""
      }
    ]
  },
  toFirstPage() {
    this.setData({
      nowPage: "firstPage",
      nowIndex: 0
    })
  },
  toApartmentPage() {
    this.setData({
      nowPage: "apartmentPage",
      nowIndex: 1
    })
  },
  toCommunityPage() {
    this.setData({
      nowPage: "communityPage",
      nowIndex: 2
    })
  },
  toMinePage() {
    this.setData({
      nowPage: "minePage",
      nowIndex: 3
    })
  }
})
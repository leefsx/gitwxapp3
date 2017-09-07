
var config = require('../../../common/config.js');
var comm = require('../../../common/common.js');
var bar = require('../../common/bar.js');
var app = getApp();

Page({
    data: {
        topNavs:{
          navList:[],
          isShowBar:false
        },
        config:[],
    },
    onShow: function () {
          let li_width = this.data.li_width
          let that= this
          this.setData({
            config: config,
            page_title:'关于我们',
            page_title_en:'ABOUT US',
            'topNavs.navList':app.globalData.navList
          })
        
          // bar.getCategory(this)
          bar.hideBar(this)
      },
    onLoad(options) {
      
    },
    barSwitchTab(e){
      bar.barSwitchTab(e,this)
    },
    showBar() {
      bar.showBar(this)
    },
    hideBar() {
      bar.hideBar(this)
    },
    pageRedirectTo(e) {
      var url = e.currentTarget.dataset.url;
      if (url) {
        wx.redirectTo({
          url: url,
        })
      }
    }
})
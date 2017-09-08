// page/component/details/details.js
var WxParse = require('../../../common/wxParse.js');
var comm = require('../../../common/common.js');
var config = require('../../../common/config.js');
var bar = require('../../common/bar.js');
var art_bar = require('../../common/article_bar.js');
var app = getApp();
Page({
  data: {
    topNavs:{
      navList:[],
      isShowBar:false
    },
    product_id: '',
    detail_data: [],
    detail_desc: '',
    carts:[],

    fir_ord: 0,
    sec_ord: 0,
    good_ord: 0,
    curIndex: 0,
    duration: 500,
    currentState: false,
    propertys:[],
    tradeRate: [],
    salesRecords: [],
    productMessage: [],
    prevnext: [],
    attr_data: [],
    skulist: [],
    config: [],
    activeIndex: 0,
    scrollLeft:0,
    scrollNum:0,
    li_width:0,
    articalUl:[],
    page_title: '产品中心'
  },
  onShow(){
    let li_width = this.data.li_width
    let that= this
    wx.getSystemInfo({
      success: function (res) {
        li_width = res.windowWidth/750*210
        that.setData({
          li_width:li_width,
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight,
          'topNavs.navList':app.globalData.navList
        })
      }
    })
  
    // bar.getCategory(this)
    this.getProductsCate()
    bar.hideBar(this)
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
  arrowMinus(){
    art_bar.arrowMinus(this)
  },

  arrowPlus(){
    art_bar.arrowPlus(this)
  },
  oTs: function (e) {
    art_bar.oTs(e,this)
  },
  oTe: function (e) {
    art_bar.oTe(e,this)
  },
  getProductsCate(){
    var that = this;
    app.request({
      url: app.domain + '/api/product/catelist',
      data: {},
      method: 'GET',
      success: function (res) {
        if (res.data.result == 'OK') {
          that.setData({
            articalUl: res.data.data
          })
        } else {
          wx.showToast({
            title: '请求失败'
          })
        }
      }
    })
  },
  changActive(e){
    const id = parseInt(e.currentTarget.dataset.id);
    this.setData({
        activeIndex: id
    })
    wx.navigateTo({
      url:"/pages/component/product/product?id="+id
    })
  },






  onLoad(options){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    comm.get_cuser({
      success: function (cuser) {}
    })
    if (!options.id) options.id = app.globalData.firstPid
    if (options.id) {
      var that = this;
      that.setData({
        carts: app.globalData.carts,
        config: config,
        page_title: config.products_title,
        page_title_en:'PRODUCTS'
      })
      app.request({
        url: app.domain + '/api/product/detail',
        dataType: 'json',
        data: {
          id: options.id
        },
        method: 'GET',
        success: function (res) {
          var detail = res.data.data.description;
          WxParse.wxParse('detail_desc', 'html', detail, that, 0);
          
          that.setData({
            detail_data: res.data.data,
            product_id: options.id,
            tradeRate: res.data.tradeRate,
            salesRecords: res.data.salesRecords,
            productMessage: res.data.productMessage,
            prevnext: res.data.PrevNext,
            propertys: res.data.newsku,
            skulist: res.data.skulist
          })
          
        },
        fail: function () {
          console.log('fail');
        },
        complete: function () {
          console.log('complete!');
          wx.hideLoading()
        }
      })

    } else {
      wx.navigateBack()
    }
  },


  // bindTap(e) {
  //   const index = parseInt(e.currentTarget.dataset.index);
    
  //   this.setData({
  //     curIndex: index
  //   })
  // },

  currentChange(e) {
    
    this.setData({
      curIndex: e.detail.current
    })
  },

  prevnext(e) {
    var id = e.target.dataset.id
    if(id){
      wx.navigateTo({
        url: '../details/details?id=' + id
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: config.logo_title +' '+ this.data.detail_data['name'],
      path: 'pages/component/details/details?id=' + this.data.product_id
    }
  }

})
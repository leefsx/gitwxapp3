
var config = require('../../../common/config.js');
var art_bar = require('../../common/article_bar.js');


var comm = require('../../../common/common.js');
var bar = require('../../common/bar.js');
var app = getApp();

Page({
    data: {
        topNavs:{
          navList:[],
          isShowBar:false
        },
        activeIndex: 0,
        config:[],
        prompt:{
          hidden:true,
        },
        scrollLeft:0,
        scrollNum:0,
        li_width:0,
        articalUl:[],
        products: []
    },
    onShow: function () {
          let li_width = this.data.li_width
          let that= this
          this.setData({
            config: config,
            page_title:'产品中心',
            page_title_en:'PRODUCTS'
          })
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
          this.getProductsFromServer(10,1)
          bar.hideBar(this)
      },
    onLoad(options) {
      var aid = ''
      if (options.id) aid = options.id
      else if (options.activeIndex) aid = options.activeIndex
        if (aid) {
            var that = this;
            that.setData({
                activeIndex: aid,
            })
        }
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
    changActive(e){
        const id = parseInt(e.currentTarget.dataset.id);
        this.setData({
            activeIndex: id
        })
        this.getProductsFromServer(10, 1)

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
    getProductsFromServer(list_num, page) {
      var that = this;
      var product_category = that.data.activeIndex
      that.setData({
        loading: true
      })
      app.request({
        url: app.domain + '/api/product/catelist',
        data: {
          
        },
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
      app.request({
        url: app.domain + '/api/product/list',
        data: {
          list_num: list_num,
          product_category: product_category,
          p: page
        },
        method: 'GET',
        success: function (res) {
          if (res.data.result == 'OK') {
            var resdata = res.data.data
            if (page > 1 && resdata.length > 0) {
              var this_products = that.data.products
              this_products = this_products.concat(resdata)
            }else{
              var this_products = resdata
            }
            that.setData({
              products: this_products,
              list_page: page,
              loading: false
            })
          }
          if (that.data.products.length==0){
            that.setData({
              'prompt.hidden':false
            })
          }
        },
        fail: function () {
          console.log('fail');
        },
        complete: function () {
          console.log('complete!');
        }
      })
    },
    load_more() {
      var this_page = this.data.list_page
      if (this_page > 0) {
        this.getProductsFromServer(6, this_page + 1)
      }
    },
    onReachBottom: function(){
      if (!this.data.loading) {
        this.load_more()
      }
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
var comm = require('../../common/common.js');
var config = require('../../common/config.js');
var WxParse = require('../../common/wxParse.js');
var bar = require('../common/bar.js');
var app = getApp();
Page({
  data: {
    topNavs:{
      navList:[],
      isShowBar:false
    },
    imgUrls: [],
    products:[],
    goodsXX: [],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    website_name: '',
    list_page: 1,
    index_middle_img: [],
    index_middle2_img: '',
    config: [],
    product1:[],
    article:[]
  },
  showBar() {
    bar.showBar(this)
  },
  hideBar() {
    bar.hideBar(this)
  },
  onShow: function () {
    var that = this
    that.setData({
        navImgUrls:['/image/top-slider1.jpg','/image/top-slider2.jpg','/image/top-slider3.jpg','/image/top-slider4.jpg'],
        config: config,
        index_autoplay_imgurl: config.index_autoplay_imgurl,
        'topNavs.navList':app.globalData.navList,
        service_img:[
          {
            img:'/image/service1.jpg',
            url:'/pages/component/product/product'
          },
          {
            img:'/image/service2.jpg',
            url:'/pages/component/product/product'
          },
          {
            img:'/image/service3.jpg',
            url:'/pages/component/product/product'
          },
          {
            img:'/image/service4.jpg',
            url:'/pages/component/product/product'
          }
        ],
        news_img:['/image/news-img1.jpg','/image/news-img2.jpg']
      })

    bar.hideBar(this)
    this.getArticlesFromServer(6,1)
    this.getProductsFromServer(4,1)
    console.log(that.data.article)
  },
  getArticlesFromServer(list_num, page) {
    var that = this
    var article_category = that.data.activeIndex
    app.request({
      url: comm.parseToURL('article', 'list'),
      data: {
        list_num: list_num,
        page: page,
        article_category: article_category
      },
      success: function (res) {
        if (res.data.result == 'OK') {
          that.setData({
            article: res.data.data,
            articalUl: res.data.category
          })
        } else {

        }
      }
    })
  },

  onPullDownRefresh(){
    var list_page = this.data.list_page
    var list_num = 6 * (list_page)
    this.getProductsFromServer(list_num, 1)
    wx.stopPullDownRefresh()
  },
  load_more(){
    var this_page = this.data.list_page
    if (this_page>0){
      var new_list = this.getProductsFromServer(4, this_page+1)
    }
  },
  onReachBottom() {
        this.load_more()
  },
  getProductsFromServer(list_num, page) {
    var that = this;
    app.request({
      url: app.domain + '/api/product/list',
      data: {
        list_num: list_num,
        product_category: 0,
        p: page
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        var resdata = res.data.data
        if (page > 1 && resdata.length > 0) {
          var this_products = that.data.products
          this_products = this_products.concat(resdata)
          that.setData({
            products: this_products,
            list_page: page
          })
          
          return resdata;
        }else{
          that.setData({
            products: resdata,
            website_name: config.website_name
          })
          if (resdata.length > 0) {
            app.globalData.firstPid = resdata[0].id
          }
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
  onShareAppMessage: function () {
    return {
      title: config.logo_title,
      path: 'pages/component/index'
    }
  }
})
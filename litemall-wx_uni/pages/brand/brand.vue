<template>
<view class="container">
  <view class="brand-list">
    <navigator :key="id" :url="'../brandDetail/brandDetail?id=' + item.id" class="item" v-for="(item, id) in brandList">
      <view class="img-bg">
        <image :src="item.picUrl" background-size="cover"></image>
      </view>
      <view class="txt-box">
        <view class="line">
          <text class="name">{{item.name}}</text>
          <text class="s">|</text>
          <text class="price">{{item.floorPrice}}元起</text>
        </view>
      </view>
    </navigator>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/brand/brand';
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({
  data: {
    brandList: [],
    page: 1,
    limit: 10,
    totalPages: 1
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getBrandList();
  },
  getBrandList: function() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.BrandList, {
      page: that.data.page,
      limit: that.data.limit
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          brandList: that.data.brandList.concat(res.data.list),
          totalPages: res.data.pages
        });
      }
      wx.hideLoading();
    });
  },
  onReachBottom() {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
    } else {
      return false;
    }

    this.getBrandList();
  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  }
})
export default global['__wxComponents']['pages/brand/brand'];
</script>
<style>
@import "./brand.css";
</style>
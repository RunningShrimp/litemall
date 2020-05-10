<template>
<view class="container">

  <view class="label">项目名称:</view>
  <view class="about-item">
    <view class="item-left">
      <text>{{name}}</text> 
    </view>
  </view>

  <view class="label">项目地址:</view>
  <view class="about-item">
    <view class="item-left">
      <text>{{address}}</text> 
    </view>
    <view @tap="showLocation" class="item-right">
      <van-icon class="right-icon" name="location-o"></van-icon>    
    </view>
  </view>

  <view class="label">电话号码:</view>
  <view class="about-item">
    <view class="item-left">
      <text>{{phone}}</text> 
    </view>
    <view @tap="callPhone" class="item-right">
      <van-icon class="right-icon" name="phone-o"></van-icon>
    </view>
  </view>

  <view class="label">QQ交流群:</view>
  <view class="about-item">
    <view class="item-left">
      <text>{{qq}}</text> 
    </view>
    <view class="item-right">
      <van-icon class="right-icon" name="friends-o"></van-icon>
    </view>
  </view>

</view>
</template>


<script>

global['__wxRoute'] = 'pages/about/about';
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'litemall',
    address: 'https://github.com/linlinjava/litemall',
    latitude: '31.201900',
    longitude: '121.587839',
    phone: '021-xxxx-xxxx',
    qq: '705144434'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAbout()
  },
  getAbout: function () {
    let that = this;
    util.request(api.AboutUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          name: res.data.name,
          address: res.data.address,
          phone: res.data.phone,
          qq: res.data.qq,
          latitude: res.data.latitude,
          longitude: res.data.longitude
        });
      }
    });
  },
  showLocation: function (e) {
    var that = this
    wx.openLocation({
      latitude: parseFloat(that.data.latitude),
      longitude: parseFloat(that.data.longitude),
      name: that.data.name,
      address: that.data.address,
    })
  },
  callPhone: function (e) {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.phone,
    })
  }
})
export default global['__wxComponents']['pages/about/about'];
</script>
<style>
@import "./about.css";
</style>
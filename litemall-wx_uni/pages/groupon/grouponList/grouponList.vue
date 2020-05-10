<template>
<view class="container">
  <scroll-view :scroll-top="scrollTop" class="groupon-list" scroll-y="true">

    <view :key="index" class="item" v-for="(item, index) in grouponList">
      <navigator :url="'/pages/goods/goods?id=' + item.id">
        <image :src="item.picUrl" background-size="cover" class="img"></image>
        <view class="right">
          <view class="text">
            <view class="header">
              <text class="name">{{item.name}}</text>
              <van-tag type="primary">{{item.grouponMember}}人成团</van-tag>
            </view>
            <view class="expire">
              <van-tag round type="warning">有效期至 {{item.expireTime}}</van-tag>
            </view>            
            <text class="desc">{{item.brief}}</text>
            <view class="price">
              <view class="counterPrice">现价：￥{{item.retailPrice}}</view>
              <view class="retailPrice">团购价：￥{{item.grouponPrice}}</view>
            </view>
          </view>
        </view>
      </navigator>
    </view>

    <view class="page" v-if="showPage">
      <view :class="'prev ' + ( page <= 1 ? 'disabled' : '')" @tap="prevPage">上一页</view>
      <view :class="'next ' + ( (count / limit) < page ? 'disabled' : '')" @tap="nextPage">下一页</view>
    </view>
  </scroll-view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/groupon/grouponList/grouponList';
// pages/groupon/grouponList/grouponList.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouponList: [],
    page: 1,
    limit: 10,
    count: 0,
    scrollTop: 0,
    showPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGrouponList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getGrouponList: function() {

    let that = this;
    that.setData({
      scrollTop: 0,
      showPage: false,
      grouponList: []
    });
    // 页面渲染完成
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    });

    util.request(api.GroupOnList, {
      page: that.data.page,
      limit: that.data.limit
    }).then(function(res) {
      if (res.errno === 0) {

        that.setData({
          scrollTop: 0,
          grouponList: res.data.list,
          showPage: true,
          count: res.data.total
        });
      }
      wx.hideToast();
    });

  },
  nextPage: function(event) {
    var that = this;
    if (this.data.page > that.data.count / that.data.limit) {
      return true;
    }


    that.setData({
      page: that.data.page + 1
    });

    this.getGrouponList();

  },
  prevPage: function(event) {
    if (this.data.page <= 1) {
      return false;
    }

    var that = this;
    that.setData({
      page: that.data.page - 1
    });
    this.getGrouponList();
  }
})
export default global['__wxComponents']['pages/groupon/grouponList/grouponList'];
</script>
<style>
@import "./grouponList.css";
</style>
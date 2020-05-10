<template>
<view class="container">
  <view class="orders-switch">
    <view :class="'item ' + ( showType == 0 ? 'active' : '')" @tap="switchTab" data-index="0">
      <view class="txt">全部</view>
    </view>
    <view :class="'item ' + ( showType == 1 ? 'active' : '')" @tap="switchTab" data-index="1">
      <view class="txt">待付款</view>
    </view>
    <view :class="'item ' + ( showType == 2 ? 'active' : '')" @tap="switchTab" data-index="2">
      <view class="txt">待发货</view>
    </view>
    <view :class="'item ' + ( showType == 3 ? 'active' : '')" @tap="switchTab" data-index="3">
      <view class="txt">待收货</view>
    </view>
    <view :class="'item ' + ( showType == 4 ? 'active' : '')" @tap="switchTab" data-index="4">
      <view class="txt">待评价</view>
    </view>
  </view>
  <view class="no-order" v-if="orderList.length <= 0">
    <view class="c">
      <text>还没有任何订单呢</text>
    </view>
  </view>

  <view class="orders">
    <navigator :key="id" :url="'../orderDetail/orderDetail?id=' + item.id" class="order" open-type="redirect" v-for="(item, id) in orderList">
      <view class="h">
        <view class="l">订单编号：{{item.orderSn}}</view>
        <view class="r">{{item.orderStatusText}}</view>
      </view>
      <view :key="id" class="goods" v-for="(gitem, id) in item.goodsList">
        <view class="img">
          <image :src="gitem.picUrl"></image>
        </view>
        <view class="info">
          <text class="name">{{gitem.goodsName}}</text>
          <text class="number">共{{gitem.number}}件商品</text>
        </view>
        <view class="status"></view>
      </view>
      <view class="b">
        <view class="l">实付：￥{{item.actualPrice}}</view>
      </view>
    </navigator>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/ucenter/order/order';
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderList: [],
    showType: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    try {
      var tab = wx.getStorageSync('tab');

      this.setData({
        showType: tab
      });
    } catch (e) {}

  },
  getOrderList() {
    let that = this;
    util.request(api.OrderList, {
      showType: that.data.showType,
      page: that.data.page,
      limit: that.data.limit
    }).then(function(res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: that.data.orderList.concat(res.data.list),
          totalPages: res.data.pages
        });
      }
    });
  },
  onReachBottom() {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
      this.getOrderList();
    } else {
      wx.showToast({
        title: '没有更多订单了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  },
  switchTab: function(event) {
    let showType = event.currentTarget.dataset.index;
    this.setData({
      orderList: [],
      showType: showType,
      page: 1,
      limit: 10,
      totalPages: 1
    });
    this.getOrderList();
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getOrderList();
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})
export default global['__wxComponents']['pages/ucenter/order/order'];
</script>
<style>
@import "./order.css";
</style>
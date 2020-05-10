<template>
<view class="container">
  <view class="pay-result">
    <view class="success" v-if="status">
      <view class="msg">付款成功</view>
      <view class="btns">
        <navigator class="btn" open-type="redirect" url="/pages/ucenter/order/order">查看订单</navigator>
        <navigator class="btn" open-type="switchTab" url="/pages/index/index">继续逛</navigator>
      </view>
    </view>
    <view class="error" v-if="!status">
      <view class="msg">付款失败</view>
      <view class="tips">
        <view class="p">请在<text class="time">半小时</text>内完成付款</view>
        <view class="p">否则订单将会被系统取消</view>
      </view>
      <view class="btns">
        <navigator class="btn" open-type="redirect" url="/pages/ucenter/order/order">查看订单</navigator>
        <view @tap="payOrder" class="btn">重新付款</view>
      </view>
    </view>
  </view>

</view>
</template>


<script>

global['__wxRoute'] = 'pages/payResult/payResult';
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp();
Page({
  data: {
    status: false,
    orderId: 0
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId,
      status: options.status === '1' ? true : false
    })
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

  },
  payOrder() {
    let that = this;
    util.request(api.OrderPrepay, {
      orderId: that.data.orderId
    }, 'POST').then(function(res) {
      if (res.errno === 0) {
        const payParam = res.data;
        console.log("支付过程开始")
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.packageValue,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function(res) {
            console.log("支付过程成功")
            that.setData({
              status: true
            });
          },
          'fail': function(res) {
            console.log("支付过程失败")
            util.showErrorToast('支付失败');
          },
          'complete': function(res) {
            console.log("支付过程结束")
          }
        });
      }
    });
  }
})
export default global['__wxComponents']['pages/payResult/payResult'];
</script>
<style>
@import "./payResult.css";
</style>
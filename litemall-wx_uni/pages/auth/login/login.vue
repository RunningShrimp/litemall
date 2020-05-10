<template>
<view class="container">
  <view class="login-box">
    <button @getuserinfo="wxLogin" class="wx-login-btn" open-type="getUserInfo" type="primary">微信直接登录</button>
    <button @tap="accountLogin" class="account-login-btn" type="primary">账号登录</button>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/auth/login/login';
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');

var app = getApp();
Page({
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

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
  wxLogin: function(e) {
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      util.showErrorToast('微信登录失败');
      return;
    }

    user.checkLogin().catch(() => {

      user.loginByWeixin(e.detail.userInfo).then(res => {
        app.globalData.hasLogin = true;

        wx.navigateBack({
          delta: 1
        })
      }).catch((err) => {
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败');
      });

    });
  },
  accountLogin: function() {
    wx.navigateTo({
      url: "/pages/auth/accountLogin/accountLogin"
    });
  }
})
export default global['__wxComponents']['pages/auth/login/login'];
</script>
<style>
@import "./login.css";
</style>
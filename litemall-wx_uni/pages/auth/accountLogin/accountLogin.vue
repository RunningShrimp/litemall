<template>
<view class="container">
    <view class="form-box">

    	<view class="form-item">
    		<input :value="username" @input="bindUsernameInput" class="username" placeholder="账号"></input>
        <van-icon @tap.stop="clearInput" class="clear" id="clear-username" name="close" v-if="username.length > 0"></van-icon>
    	</view>

    	<view class="form-item">
    		<input :value="password" @input="bindPasswordInput" class="password" password placeholder="密码"></input>
        <van-icon @tap.stop="clearInput" class="clear" id="clear-password" name="close" v-if="password.length > 0"></van-icon>
    	</view>

		 <!-- <view class="form-item-code" wx-if="{{loginErrorCount >= 3}}">
			<view class="form-item code-item">
				<input class="code" value="{{code}}" bindinput="bindCodeInput" placeholder="验证码"/>
        <van-icon class="clear" id="clear-code" wx:if="{{ code.length > 0 }}" name="close" catchtap="clearInput"/>        
			</view>
			<image class="code-img" src="captcha.png"></image>
		</view>  -->

    <button @tap="accountLogin" class="login-btn" type="primary">账号登录</button>

     <view class="form-item-text">
      <navigator class="register" url="/pages/auth/register/register">注册账号</navigator>
			<navigator class="reset" url="/pages/auth/reset/reset">忘记密码</navigator>
    </view> 
    </view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/auth/accountLogin/accountLogin';
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var user = require('../../../utils/user.js');

var app = getApp();
Page({
  data: {
    username: '',
    password: '',
    code: '',
    loginErrorCount: 0
  },
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
  accountLogin: function() {
    var that = this;

    if (this.data.password.length < 1 || this.data.username.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }

    wx.request({
      url: api.AuthLoginByAccount,
      data: {
        username: that.data.username,
        password: that.data.password
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.errno == 0) {
          that.setData({
            loginErrorCount: 0
          });
          app.globalData.hasLogin = true;
          wx.setStorageSync('userInfo', res.data.data.userInfo);
          wx.setStorage({
            key: "token",
            data: res.data.data.token,
            success: function() {
              wx.switchTab({
                url: '/pages/ucenter/index/index'
              });
            }
          });
        } else {
          that.setData({
            loginErrorCount: that.data.loginErrorCount + 1
          });
          app.globalData.hasLogin = false;
          util.showErrorToast('账户登录失败');
        }
      }
    });
  },
  bindUsernameInput: function(e) {

    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function(e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindCodeInput: function(e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function(e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: ''
        });
        break;
      case 'clear-password':
        this.setData({
          password: ''
        });
        break;
      case 'clear-code':
        this.setData({
          code: ''
        });
        break;
    }
  }
})
export default global['__wxComponents']['pages/auth/accountLogin/accountLogin'];
</script>
<style>
@import "./accountLogin.css";
</style>
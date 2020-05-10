<template>
<view class="container">
  <view @tap="goLogin" class="profile-info">
    <image :src="userInfo.avatarUrl" class="avatar"></image>
    <view class="info">
      <text class="name">{{userInfo.nickName}}</text>
    </view>
  </view>

  <view class="separate"></view>

  <view class="user_area">
    <view @tap="goOrder" class="user_row">
      <view class="user_row_left">我的订单</view>
      <van-icon class="user_row_right" name="arrow"></van-icon>      
    </view>
    <view class="user_column">
      <view @tap="goOrderIndex" class="user_column_item" data-index="1" data-route="/pages/ucenter/order/order">
        <text class="user_column_item_badge" v-if="order.unpaid != 0">{{order.unpaid}}</text>
        <image class="user_column_item_image" src="/static/static/images/pendpay.png">
        </image>
        <view class="user_column_item_text">待付款</view>
      </view>
      <view @tap="goOrderIndex" class="user_column_item" data-index="2" data-route="/pages/ucenter/order/order">
        <text class="user_column_item_badge" v-if="order.unship != 0">{{order.unship}}</text>
        <image class="user_column_item_image" src="/static/static/images/send.png"></image>
        <view class="user_column_item_text">待发货</view>
      </view>
      <view @tap="goOrderIndex" class="user_column_item" data-index="3" data-route="/pages/ucenter/order/order">
        <text class="user_column_item_badge" v-if="order.unrecv != 0">{{order.unrecv}}</text>
        <image class="user_column_item_image" src="/static/static/images/receive.png"></image>
        <view class="user_column_item_text">待收货</view>
      </view>
      <view @tap="goOrderIndex" class="user_column_item" data-index="4" data-route="/pages/ucenter/order/order">
        <text class="user_column_item_badge" v-if="order.uncomment != 0">{{order.uncomment}}</text>
        <image class="user_column_item_image" src="/static/static/images/comment.png"></image>
        <view class="user_column_item_text">待评价</view>
      </view>
      <view @tap="goAfterSale" class="user_column_item">
        <image class="user_column_item_image" src="/static/static/images/aftersale.png"></image>
        <view class="user_column_item_text">售后</view>
      </view>
    </view>
  </view>

  <view class="separate"></view>

  <view class="user_row">
    <view class="user_row_left">核心服务</view>
  </view>
  <view class="user_column">

    <view @tap="goCoupon" class="user_column_item">
      <image class="user_column_item_image" src="/static/static/images/coupon.png"></image>
      <view class="user_column_item_text">优惠卷</view>
    </view>
    <view @tap="goCollect" class="user_column_item">
      <image class="user_column_item_image" src="/static/static/images/collect.png"></image>
      <view class="user_column_item_text">商品收藏</view>
    </view>
    <view @tap="goFootprint" class="user_column_item">
      <image class="user_column_item_image" src="/static/static/images/footprint.png"></image>
      <view class="user_column_item_text">浏览足迹</view>
    </view>
    <view @tap="goGroupon" class="user_column_item">
      <image class="user_column_item_image" src="/static/static/images/group.png"></image>
      <view class="user_column_item_text">我的拼团</view>
    </view>

    <view @tap="goAddress" class="user_column_item">
      <image class="user_column_item_image" src="/static/static/images/address.png"></image>
      <view class="user_column_item_text">地址管理</view>
    </view>
  </view>
  <view class="separate"></view>

  <view class="user_row">
    <view class="user_row_left">必备工具</view>
  </view>
  <view class="user_column">

    <button @getphonenumber="bindPhoneNumber" class="user_column_item_phone" open-type="getPhoneNumber">
      <image class="user_column_item_image" src="/static/static/images/mobile.png"></image>
      <view class="user_column_item_text">绑定手机</view>
    </button>
    <view @tap="goHelp" class="user_column_item">
      <image class="user_column_item_image" src="/static/static/images/help.png"></image>
      <view class="user_column_item_text">帮助中心</view>
    </view>
    <view @tap="goFeedback" class="user_column_item">
      <image class="user_column_item_image" src="/static/static/images/feedback.png"></image>
      <view class="user_column_item_text">意见反馈</view>
    </view>
    <view class="user_column_item">
      <contact-button session-from="weapp" size="27" style="opacity:0;position:absolute;" type="default-dark">
      </contact-button>
      <image class="user_column_item_image" src="/static/static/images/customer.png"></image>
      <view class="user_column_item_text">联系客服</view>
    </view>
    <view @tap="aboutUs" class="user_column_item">
      <image class="user_column_item_image" src="/static/static/images/about.png"></image>
      <view class="user_column_item_text">关于我们</view>
    </view>
  </view>
  <view class="separate"></view>

  <view @tap="exitLogin" class="logout" v-if="hasLogin">退出登录</view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/ucenter/index/index';
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: '/static/images/my.png'
    },
    order: {
      unpaid: 0,
      unship: 0,
      unrecv: 0,
      uncomment: 0
    },
    hasLogin: false
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {

  },
  onShow: function() {

    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      });

      let that = this;
      util.request(api.UserIndex).then(function(res) {
        if (res.errno === 0) {
          that.setData({
            order: res.data.order
          });
        }
      });
    }

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goOrder() {
    if (this.data.hasLogin) {
      try {
        wx.setStorageSync('tab', 0);
      } catch (e) {

      }
      wx.navigateTo({
        url: "/pages/ucenter/order/order"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goOrderIndex(e) {
    if (this.data.hasLogin) {
      let tab = e.currentTarget.dataset.index
      let route = e.currentTarget.dataset.route
      try {
        wx.setStorageSync('tab', tab);
      } catch (e) {

      }
      wx.navigateTo({
        url: route,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goCoupon() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/couponList/couponList"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goGroupon() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/groupon/myGroupon/myGroupon"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goCollect() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/collect/collect"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goFeedback(e) {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/feedback/feedback"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goFootprint() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/footprint/footprint"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goAddress() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/address/address"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  bindPhoneNumber: function(e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }

    if (!this.data.hasLogin) {
      wx.showToast({
        title: '绑定失败：请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    util.request(api.AuthBindPhone, {
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }, 'POST').then(function(res) {
      if (res.errno === 0) {
        wx.showToast({
          title: '绑定手机号码成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },
  goAfterSale: function() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/aftersaleList/aftersaleList"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  aboutUs: function() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },
  goHelp: function () {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },  
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (!res.confirm) {
          return;
        }

        util.request(api.AuthLogout, {}, 'POST');
        app.globalData.hasLogin = false;
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    })

  }
})
export default global['__wxComponents']['pages/ucenter/index/index'];
</script>
<style>
@import "./index.css";
</style>
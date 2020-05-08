<template>
    <view class="container">

        <scroll-view :scroll-top="scrollTop" class="coupon-list" scroll-y="true">

            <view @tap="unselectCoupon" class="unselect">不选择优惠券</view>

            <view :data-cid="item.cid" :data-id="item.id" :key="index" @tap="selectCoupon" class="item"
                  v-for="(item, index) in couponList">
                <view class="tag">{{item.tag}}</view>
                <view class="content">
                    <view class="left">
                        <view class="discount">{{item.discount}}元</view>
                        <view class="min">满{{item.min}}元使用</view>
                    </view>
                    <view class="right">
                        <view class="name">{{item.name}}</view>
                        <view class="time">有效期：{{item.startTime}} - {{item.endTime}}</view>
                    </view>
                </view>
                <view class="condition">
                    <text class="txt">{{item.desc}}</text>
                    <image :src="item.pic" class="icon"></image>
                </view>
            </view>

        </scroll-view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/ucenter/couponSelect/couponSelect';
    var util = require('../../../utils/util.js');
    var api = require('../../../config/api.js');

    var app = getApp();

    Page({
        data: {
            couponList: [],
            cartId: 0,
            couponId: 0,
            userCouponId: 0,
            grouponLinkId: 0,
            scrollTop: 0
        },


        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
            // 页面显示
            wx.showLoading({
                title: '加载中...',
            });

            try {
                var cartId = wx.getStorageSync('cartId');
                if (!cartId) {
                    cartId = 0;
                }

                var couponId = wx.getStorageSync('couponId');
                if (!couponId) {
                    couponId = 0;
                }

                var userCouponId = wx.getStorageSync('userCouponId');
                if (!userCouponId) {
                    userCouponId = 0;
                }

                var grouponRulesId = wx.getStorageSync('grouponRulesId');
                if (!grouponRulesId) {
                    grouponRulesId = 0;
                }

                this.setData({
                    cartId: cartId,
                    couponId: couponId,
                    userCouponId: userCouponId,
                    grouponRulesId: grouponRulesId
                });

            } catch (e) {
                // Do something when catch error
                console.log(e);
            }

            this.getCouponList();
        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom() {
        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        },
        getCouponList: function () {

            let that = this;
            that.setData({
                couponList: []
            });
            // 页面渲染完成
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 2000
            });

            util.request(api.CouponSelectList, {
                cartId: that.data.cartId,
                grouponRulesId: that.data.grouponRulesId,
            }).then(function (res) {
                if (res.errno === 0) {
                    let list = [];
                    for (var i = 0; i < res.data.list.length; i++) {
                        if (res.data.list[i].available) {
                            list.push(res.data.list[i]);
                        }
                    }
                    that.setData({
                        couponList: list
                    });
                }
                wx.hideToast();
            });

        },
        selectCoupon: function (e) {
            try {
                wx.setStorageSync('couponId', e.currentTarget.dataset.cid);
                wx.setStorageSync('userCouponId', e.currentTarget.dataset.id);
            } catch (error) {

            }

            wx.navigateBack();
        },
        unselectCoupon: function () {
            // 如果优惠券ID设置-1，则表示订单不使用优惠券
            try {
                wx.setStorageSync('couponId', -1);
                wx.setStorageSync('userCouponId', -1);
            } catch (error) {

            }

            wx.navigateBack();
        }

    });
    export default global['__wxComponents']['pages/ucenter/couponSelect/couponSelect'];
</script>
<style>
    @import "./couponSelect.css";
</style>
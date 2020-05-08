<template>
    <view class="container">
        <scroll-view :scroll-top="scrollTop" class="coupon-list" scroll-y="true">

            <view :data-index="item.id" :key="index" @tap="getCoupon" class="item" v-for="(item, index) in couponList">
                <view class="tag">{{item.tag}}</view>
                <view class="content">
                    <view class="left">
                        <view class="discount">{{item.discount}}元</view>
                        <view class="min">满{{item.min}}元使用</view>
                    </view>
                    <view class="right">
                        <view class="name">{{item.name}}</view>
                        <view class="time" v-if="item.days != 0">有效期：{{item.days}}天</view>
                        <view class="time" v-else>有效期：{{item.startTime}} - {{item.endTime}}</view>
                    </view>
                </view>
                <view class="condition">
                    <text class="txt">{{item.desc}}</text>
                    <image :src="item.pic" class="icon"></image>
                </view>
            </view>

            <view class="page" v-if="showPage">
                <view :class="'prev ' + ( page <= 1 ? 'disabled' : '')" @tap="prevPage">上一页</view>
                <view :class="'next ' + ( (count / limit) < page ? 'disabled' : '')" @tap="nextPage">下一页</view>
            </view>
        </scroll-view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/coupon/coupon';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');

    var app = getApp();

    Page({
        data: {
            couponList: [],
            page: 1,
            limit: 10,
            count: 0,
            scrollTop: 0,
            showPage: false
        },


        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
            this.getCouponList();
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
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        },
        getCouponList: function () {

            let that = this;
            that.setData({
                scrollTop: 0,
                showPage: false,
                couponList: []
            });
            // 页面渲染完成
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 2000
            });

            util.request(api.CouponList, {
                page: that.data.page,
                limit: that.data.limit
            }).then(function (res) {
                if (res.errno === 0) {

                    that.setData({
                        scrollTop: 0,
                        couponList: res.data.list,
                        showPage: true,
                        count: res.data.total
                    });
                }
                wx.hideToast();
            });

        },
        getCoupon(e) {
            if (!app.globalData.hasLogin) {
                wx.navigateTo({
                    url: "/pages/auth/login/login"
                });
            }

            let couponId = e.currentTarget.dataset.index;
            util.request(api.CouponReceive, {
                couponId: couponId
            }, 'POST').then(res => {
                if (res.errno === 0) {
                    wx.showToast({
                        title: "领取成功"
                    })
                } else {
                    util.showErrorToast(res.errmsg);
                }
            })
        },
        nextPage: function (event) {
            var that = this;
            if (this.data.page > that.data.count / that.data.limit) {
                return true;
            }

            that.setData({
                page: that.data.page + 1
            });

            this.getCouponList();

        },
        prevPage: function (event) {
            if (this.data.page <= 1) {
                return false;
            }

            var that = this;
            that.setData({
                page: that.data.page - 1
            });
            this.getCouponList();
        }
    });
    export default global['__wxComponents']['pages/coupon/coupon'];
</script>
<style>
    @import "./coupon.css";
</style>
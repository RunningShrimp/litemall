<template>
    <view class="container">

        <view class="h">
            <view :class="'item ' + ( status == 0 ? 'active' : '')" @tap="switchTab" data-index="0">
                <view class="txt">未使用</view>
            </view>
            <view :class="'item ' + ( status == 1 ? 'active' : '')" @tap="switchTab" data-index="1">
                <view class="txt">已使用</view>
            </view>
            <view :class="'item ' + ( status == 2 ? 'active' : '')" @tap="switchTab" data-index="2">
                <view class="txt">已过期</view>
            </view>
        </view>

        <view class="b">

            <view class="coupon-form" v-if="status == 0">
                <view class="input-box">
                    <input :value="code" @input="bindExchange" class="coupon-sn" placeholder="请输入优惠码"></input>
                    <van-icon @tap.stop="clearExchange" class="clear-icon" name="close"
                              v-if="code.length > 0"></van-icon>
                </view>
                <view @tap="goExchange" class="add-btn">兑换</view>
            </view>

            <view class="help" v-if="status == 0">
                <van-icon name="question-o"></van-icon>
                使用说明
            </view>

            <scroll-view :scroll-top="scrollTop" class="coupon-list" scroll-y="true">

                <view :class="'item ' + ( status == 0 ? 'active' : '')" :key="index"
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

                <view class="page" v-if="showPage">
                    <view :class="'prev ' + ( page <= 1 ? 'disabled' : '')" @tap="prevPage">上一页</view>
                    <view :class="'next ' + ( (count / size) < page ? 'disabled' : '')" @tap="nextPage">下一页</view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/ucenter/couponList/couponList';
    var util = require('../../../utils/util.js');
    var api = require('../../../config/api.js');

    var app = getApp();

    Page({
        data: {
            couponList: [],
            code: '',
            status: 0,
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
        onPullDownRefresh() {
            wx.showNavigationBarLoading(); //在标题栏中显示加载
            this.getCouponList();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
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
            util.request(api.CouponMyList, {
                status: that.data.status,
                page: that.data.page,
                limit: that.data.limit
            }).then(function (res) {
                if (res.errno === 0) {

                    that.setData({
                        scrollTop: 0,
                        couponList: res.data.list,
                        showPage: res.data.total > that.data.limit,
                        count: res.data.total
                    });
                }
            });

        },
        bindExchange: function (e) {
            this.setData({
                code: e.detail.value
            });
        },
        clearExchange: function () {
            this.setData({
                code: ''
            });
        },
        goExchange: function () {
            if (this.data.code.length === 0) {
                util.showErrorToast("请输入兑换码");
                return;
            }

            let that = this;
            util.request(api.CouponExchange, {
                code: that.data.code
            }, 'POST').then(function (res) {
                if (res.errno === 0) {
                    that.getCouponList();
                    that.clearExchange();
                    wx.showToast({
                        title: "领取成功",
                        duration: 2000
                    })
                } else {
                    util.showErrorToast(res.errmsg);
                }
            });
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
        },
        switchTab: function (e) {

            this.setData({
                couponList: [],
                status: e.currentTarget.dataset.index,
                page: 1,
                limit: 10,
                count: 0,
                scrollTop: 0,
                showPage: false
            });

            this.getCouponList();
        },
    });
    export default global['__wxComponents']['pages/ucenter/couponList/couponList'];
</script>
<style>
    @import "./couponList.css";
</style>
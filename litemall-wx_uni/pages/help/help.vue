<template>
    <view class="container">

        <view class="common-problem">
            <view :key="id" class="item" v-for="(item, id) in issueList">
                <view class="question-box">
                    <text class="spot"></text>
                    <text class="question">{{item.question}}</text>
                </view>
                <view class="answer">{{item.answer}}</view>
            </view>
        </view>

        <view class="page" v-if="showPage">
            <view :class="'prev ' + ( page <= 1 ? 'disabled' : '')" @tap="prevPage">上一页</view>
            <view :class="'next ' + ( (count / limit) < page ? 'disabled' : '')" @tap="nextPage">下一页</view>
        </view>

    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/help/help';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');
    var app = getApp();

    Page({

        /**
         * 页面的初始数据
         */
        data: {
            issueList: [],
            page: 1,
            limit: 10,
            count: 0,
            showPage: false
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
            this.getIssue();
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
        nextPage: function (event) {
            var that = this;
            if (this.data.page > that.data.count / that.data.limit) {
                return true;
            }

            that.setData({
                page: that.data.page + 1
            });

            this.getIssue();

        },
        getIssue: function () {

            let that = this;
            that.setData({
                showPage: false,
                issueList: []
            });

            util.request(api.IssueList, {
                page: that.data.page,
                limit: that.data.limit
            }).then(function (res) {
                if (res.errno === 0) {

                    that.setData({
                        issueList: res.data.list,
                        showPage: true,
                        count: res.data.total
                    });
                }
            });

        },
        prevPage: function (event) {
            if (this.data.page <= 1) {
                return false;
            }

            var that = this;
            that.setData({
                page: that.data.page - 1
            });
            this.getIssue();
        }
    });
    export default global['__wxComponents']['pages/help/help'];
</script>
<style>
    @import "./help.css";
</style>
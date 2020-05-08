<template>
    <view class="container">
        <scroll-view :scroll-top="scrollTop" class="topic-list" scroll-y="true">
            <navigator :key="id" :url="'../topicDetail/topicDetail?id=' + item.id" class="item"
                       v-for="(item, id) in topicList">
                <image :src="item.picUrl" class="img"></image>
                <view class="info">
                    <text class="title">{{item.title}}</text>
                    <text class="desc">{{item.subtitle}}</text>
                    <text class="price">{{item.price}}元起</text>
                </view>
            </navigator>
            <view class="page" v-if="showPage">
                <view :class="'prev ' + ( page <= 1 ? 'disabled' : '')" @tap="prevPage">上一页</view>
                <view :class="'next ' + ( (count / size) < page ? 'disabled' : '')" @tap="nextPage">下一页</view>
            </view>
        </scroll-view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/topic/topic';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');
    var app = getApp();
    Page({
        data: {
            topicList: [],
            page: 1,
            limit: 10,
            count: 0,
            scrollTop: 0,
            showPage: false
        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
            this.getTopic();
        },
        onReady: function () {
            // 页面渲染完成
        },
        onShow: function () {
            // 页面显示
        },
        onHide: function () {
            // 页面隐藏
        },
        onUnload: function () {
            // 页面关闭
        },
        nextPage: function (event) {
            var that = this;
            if (this.data.page > that.data.count / that.data.limit) {
                return true;
            }


            that.setData({
                page: that.data.page + 1
            });

            this.getTopic();

        },
        getTopic: function () {

            let that = this;
            that.setData({
                scrollTop: 0,
                showPage: false,
                topicList: []
            });
            // 页面渲染完成
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 2000
            });

            util.request(api.TopicList, {
                page: that.data.page,
                limit: that.data.limit
            }).then(function (res) {
                if (res.errno === 0) {

                    that.setData({
                        scrollTop: 0,
                        topicList: res.data.list,
                        showPage: true,
                        count: res.data.total
                    });
                }
                wx.hideToast();
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
            this.getTopic();
        }
    });
    export default global['__wxComponents']['pages/topic/topic'];
</script>
<style>
    @import "./topic.css";
</style>
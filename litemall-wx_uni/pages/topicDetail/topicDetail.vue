<template>
    <view>
        <scroll-view class="container">
            <scroll-view class="content">

                <view v-html="article_topicDetail"></view>
            </scroll-view>
            <scroll-view class="sv-goods" v-if="topicGoods.length > 0">
                <view class="topic-goods">
                    <view class="h">
                        <text class="t">专题商品</text>
                    </view>
                    <view class="b">
                        <view :key="index" class="item" v-for="(item, index) in topicGoods">
                            <navigator :url="'/pages/goods/goods?id=' + item.id">
                                <image :src="item.picUrl" background-size="cover" class="img"></image>
                                <view class="right">
                                    <view class="text">
                                        <text class="name">{{item.name}}</text>
                                        <text class="desc">{{item.brief}}</text>
                                        <text class="price">￥{{item.retailPrice}}</text>
                                    </view>
                                </view>
                            </navigator>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <scroll-view class="comments">
                <view class="h">
                    <text class="t">精选留言</text>
                    <van-icon @tap="postComment" class="i" name="comment-o"></van-icon>
                </view>
                <view class="has-comments" v-if="commentList.length > 0">
                    <view class="b">
                        <view :key="id" class="item" v-for="(item, id) in commentList">
                            <view class="info">
                                <view class="user">
                                    <image :src="item.userInfo.avatarUrl" class="avatar"></image>
                                    <text class="nickname">{{item.userInfo.nickName}}</text>
                                </view>
                                <view class="time">{{item.addTime}}</view>
                            </view>
                            <view class="comment">{{item.content}}</view>
                        </view>
                    </view>
                    <view class="load" v-if="commentCount > 5">
                        <navigator :url="'/pages/topicComment/topicComment?valueId=' + topic.id + '&type=1'">查看更多
                        </navigator>
                    </view>
                </view>
                <view class="no-comments" v-if="commentList.length <= 0">
                    <text class="txt">等你来留言</text>
                </view>
            </scroll-view>
            <scroll-view class="rec-box">
                <view class="h">
                    <text class="txt">专题推荐</text>
                </view>
                <view class="b">
                    <navigator :key="id" :url="'../topicDetail/topicDetail?id=' + item.id" class="item"
                               v-for="(item, id) in topicList">
                        <image :src="item.picUrl" class="img"></image>
                        <text class="title">{{item.title}}</text>
                    </navigator>
                </view>
            </scroll-view>
        </scroll-view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/topicDetail/topicDetail';
    var app = getApp();
    var WxParse = require('../../lib/wxParse/wxParse.js');
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');

    Page({
        data: {
            id: 0,
            topic: {},
            topicList: [],
            commentCount: 0,
            commentList: [],
            topicGoods: []
        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
            var that = this;
            that.setData({
                id: options.id
            });

            util.request(api.TopicDetail, {
                id: that.data.id
            }).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        topic: res.data.topic,
                        topicGoods: res.data.goods
                    });

                    WxParse.wxParse('topicDetail', 'html', res.data.topic.content, that);
                }
            });

            util.request(api.TopicRelated, {
                id: that.data.id
            }).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        topicList: res.data.list
                    });
                }
            });
        },
        getCommentList() {
            let that = this;
            util.request(api.CommentList, {
                valueId: that.data.id,
                type: 1,
                showType: 0,
                page: 1,
                limit: 5
            }).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        commentList: res.data.list,
                        commentCount: res.data.total
                    });
                }
            });
        },
        postComment() {
            if (!app.globalData.hasLogin) {
                wx.navigateTo({
                    url: "/pages/auth/login/login"
                });
            } else {
                wx.navigateTo({
                    url: '/pages/topicCommentPost/topicCommentPost?valueId=' + this.data.id + '&type=1',
                })
            }
        },
        onReady: function () {

        },
        onShow: function () {
            // 页面显示
            this.getCommentList();
        },
        onHide: function () {
            // 页面隐藏

        },
        onUnload: function () {
            // 页面关闭

        }
    });
    export default global['__wxComponents']['pages/topicDetail/topicDetail'];
</script>
<style>
    @import "./topicDetail.css";
</style>
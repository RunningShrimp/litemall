<template>
    <view class="container">
        <view class="aftersales-switch">
            <view :class="'item ' + ( showType == 1 ? 'active' : '')" @tap="switchTab" data-index="1">
                <view class="txt">申请中</view>
            </view>
            <view :class="'item ' + ( showType == 2 ? 'active' : '')" @tap="switchTab" data-index="2">
                <view class="txt">处理中</view>
            </view>
            <view :class="'item ' + ( showType == 3 ? 'active' : '')" @tap="switchTab" data-index="3">
                <view class="txt">已完成</view>
            </view>
            <view :class="'item ' + ( showType == 4 ? 'active' : '')" @tap="switchTab" data-index="4">
                <view class="txt">已拒绝</view>
            </view>
        </view>
        <view class="no-aftersale" v-if="aftersaleList.length <= 0">
            <view class="c">
                <text>还没有呢</text>
            </view>
        </view>

        <view class="aftersales">
            <navigator :key="id" :url="'../aftersaleDetail/aftersaleDetail?id=' + item.aftersale.orderId"
                       class="aftersale" open-type="redirect" v-for="(item, id) in aftersaleList">
                <view class="h">
                    <view class="l">售后编号：{{item.aftersale.aftersaleSn}}</view>
                </view>
                <view :key="id" class="goods" v-for="(gitem, id) in item.goodsList">
                    <view class="img">
                        <image :src="gitem.picUrl"></image>
                    </view>
                    <view class="info">
                        <text class="name">{{gitem.goodsName}}</text>
                        <text class="number">{{gitem.number}}件商品</text>
                    </view>
                    <view class="status"></view>
                </view>
                <view class="b">
                    <view class="l">申请退款金额：￥{{item.aftersale.amount}}元</view>
                </view>
            </navigator>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/ucenter/aftersaleList/aftersaleList';
    var util = require('../../../utils/util.js');
    var api = require('../../../config/api.js');

    Page({
        data: {
            aftersaleList: [],
            showType: 1,
            page: 1,
            limit: 10,
            totalPages: 1
        },
        onLoad: function (options) {
        },
        getAftersaleList() {
            let that = this;
            util.request(api.AftersaleList, {
                status: that.data.showType,
                page: that.data.page,
                limit: that.data.limit
            }).then(function (res) {
                if (res.errno === 0) {
                    console.log(res.data);
                    that.setData({
                        aftersaleList: that.data.aftersaleList.concat(res.data.list),
                        totalPages: res.data.pages
                    });
                }
            });
        },
        onReachBottom() {
            if (this.data.totalPages > this.data.page) {
                this.setData({
                    page: this.data.page + 1
                });
                this.getAftersaleList();
            } else {
                wx.showToast({
                    title: '没有更多售后了',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
        },
        switchTab: function (event) {
            let showType = event.currentTarget.dataset.index;
            this.setData({
                aftersaleList: [],
                showType: showType,
                page: 1,
                limit: 10,
                totalPages: 1
            });
            this.getAftersaleList();
        },
        onReady: function () {
            // 页面渲染完成
        },
        onShow: function () {
            // 页面显示
            this.getAftersaleList();
        },
        onHide: function () {
            // 页面隐藏
        },
        onUnload: function () {
            // 页面关闭
        }
    });
    export default global['__wxComponents']['pages/ucenter/aftersaleList/aftersaleList'];
</script>
<style>
    @import "./aftersaleList.css";
</style>
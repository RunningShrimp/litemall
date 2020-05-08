<template>
    <view class="container">
        <view class="orders-switch">
            <view :class="'item ' + ( showType == 0 ? 'active' : '')" @tap="switchTab" data-index="0">
                <view class="txt">发起的团购</view>
            </view>
            <view :class="'item ' + ( showType == 1 ? 'active' : '')" @tap="switchTab" data-index="1">
                <view class="txt">参加的团购</view>
            </view>
        </view>
        <view class="no-order" v-if="orderList.length <= 0">
            <view class="c">
                <text>尚未参加任何团购</text>
            </view>
        </view>

        <view class="orders">
            <navigator :key="id" :url="'../grouponDetail/grouponDetail?id=' + item.id" class="order"
                       open-type="navigate" v-for="(item, id) in orderList">
                <view class="h">
                    <van-tag type="primary" v-if="item.groupon.status === 1">开团中</van-tag>
                    <van-tag type="success" v-if="item.groupon.status === 2">开团成功</van-tag>
                    <van-tag type="danger" v-if="item.groupon.status === 3">开团失败</van-tag>
                    <van-tag round type="warning" v-if="!item.isCreator">{{item.creator}}发起</van-tag>
                </view>
                <view class="h">
                    <view class="l">订单编号：{{item.orderSn}}</view>
                    <view class="r">{{item.orderStatusText}}</view>
                </view>
                <view class="j">
                    <view class="l">团购立减：￥{{item.rules.discount}}</view>
                    <view class="r">参与时间：{{item.groupon.addTime}}</view>
                </view>
                <view class="i">
                    <view class="l">团购要求：{{item.rules.discountMember}}人</view>
                    <view class="r">当前参团：{{item.joinerCount}}人</view>
                </view>
                <view :key="id" class="goods" v-for="(gitem, id) in item.goodsList">
                    <view class="img">
                        <image :src="gitem.picUrl"></image>
                    </view>
                    <view class="info">
                        <text class="name">{{gitem.goodsName}}</text>
                        <text class="number">共{{gitem.number}}件商品</text>
                    </view>
                    <view class="status"></view>
                </view>
                <view class="b">
                    <view class="l">实付：￥{{item.actualPrice}}</view>
                </view>
            </navigator>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/groupon/myGroupon/myGroupon';
    var util = require('../../../utils/util.js');
    var api = require('../../../config/api.js');

    Page({
        data: {
            orderList: [],
            showType: 0
        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
        },

        onPullDownRefresh() {
            wx.showNavigationBarLoading(); //在标题栏中显示加载
            this.getOrderList();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        },

        getOrderList() {
            let that = this;
            util.request(api.GroupOnMy, {
                showType: that.data.showType
            }).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        orderList: res.data.list
                    });
                }
            });
        },
        switchTab: function (event) {
            let showType = event.currentTarget.dataset.index;
            this.setData({
                showType: showType
            });
            this.getOrderList();
        },
        onReady: function () {
            // 页面渲染完成
        },
        onShow: function () {
            // 页面显示
            this.getOrderList();
        },
        onHide: function () {
            // 页面隐藏
        },
        onUnload: function () {
            // 页面关闭
        }
    });
    export default global['__wxComponents']['pages/groupon/myGroupon/myGroupon'];
</script>
<style>
    @import "./myGroupon.css";
</style>
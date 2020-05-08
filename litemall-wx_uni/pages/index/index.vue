<template>
    <!--index.wxml-->
    <view class="container">
        <view class="search">
            <navigator class="input" url="/pages/search/search">
                <van-icon name="search"></van-icon>
                <text class="txt">商品搜索, 共{{goodsCount}}款好物</text>
            </navigator>
        </view>
        <swiper autoplay="true" class="banner" duration="1000" indicator-dots="true" interval="3000">
            <swiper-item :key="id" v-for="(item, id) in banner">
                <block v-if="item.link>0">
                    <navigator :url="'/pages/goods/goods?id=' + item.link">
                        <image :src="item.url" background-size="cover"></image>
                    </navigator>
                </block>
                <block v-else>
                    <image :src="item.url" background-size="cover"></image>
                </block>
            </swiper-item>
        </swiper>
        <view class="m-menu">
            <navigator :key="id" :url="'/pages/category/category?id=' + item.id" class="item"
                       v-for="(item, id) in channel">
                <image :src="item.iconUrl" background-size="cover"></image>
                <text>{{item.name}}</text>
            </navigator>
        </view>

        <view class="a-section a-coupon" v-if="coupon.length > 0">
            <view class="h">
                <view class="title">
                    <view>
                        <navigator url="/pages/coupon/coupon">
                            <text class="txt">优惠券</text>
                        </navigator>
                    </view>
                </view>
            </view>
            <view class="b" v-if="coupon.length>0">
                <view :data-index="item.id" :key="index" @tap="getCoupon" class="item" v-for="(item, index) in coupon">
                    <view class="tag">{{item.tag}}</view>
                    <view class="content">
                        <view class="left">
                            <view class="discount">{{item.discount}}元</view>
                            <view class="min">满{{item.min}}元使用</view>
                        </view>
                        <view class="right">
                            <view class="name">{{item.name}}</view>
                            <view class="desc">{{item.desc}}</view>
                            <view class="time" v-if="item.days != 0">有效期：{{item.days}}天</view>
                            <view class="time" v-else>有效期：{{item.startTime}} - {{item.endTime}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="a-section a-groupon" v-if="groupons.length > 0">
            <view class="h">
                <view class="title">
                    <view>
                        <navigator url="/pages/groupon/grouponList/grouponList">
                            <text class="txt">团购专区</text>
                        </navigator>
                    </view>
                </view>
            </view>
            <view class="b">
                <view :key="index" class="item" v-for="(item, index) in groupons">
                    <navigator :url="'/pages/goods/goods?id=' + item.id">
                        <image :src="item.picUrl" background-size="cover" class="img"></image>
                        <view class="right">
                            <view class="text">
                                <view class="header">
                                    <text class="name">{{item.name}}</text>
                                    <van-tag type="primary">{{item.grouponMember}}人成团</van-tag>
                                </view>
                                <view class="expire">
                                    <van-tag round type="warning">有效期至 {{item.expireTime}}</van-tag>
                                </view>
                                <text class="desc">{{item.brief}}</text>
                                <view class="price">
                                    <view class="counterPrice">现价：￥{{item.retailPrice}}</view>
                                    <view class="retailPrice">团购价：￥{{item.grouponPrice}}</view>
                                </view>
                            </view>
                        </view>
                    </navigator>
                </view>
            </view>
        </view>

        <view class="a-section a-brand">
            <view class="h">
                <navigator url="../brand/brand">
                    <text class="txt">品牌制造商直供</text>
                </navigator>
            </view>
            <view class="b">
                <view :key="id" class="item item-1" v-for="(item, id) in brands">
                    <navigator :url="'/pages/brandDetail/brandDetail?id=' + item.id">
                        <view class="wrap">
                            <image :src="item.picUrl" class="img" mode="aspectFill"></image>
                            <view class="mt">
                                <text class="brand">{{item.name}}</text>
                                <text class="price">{{item.floorPrice}}</text>
                                <text class="unit">元起</text>
                            </view>
                        </view>
                    </navigator>
                </view>
            </view>
        </view>
        <view class="a-section a-new" v-if="newGoods.length > 0">
            <view class="h">
                <view>
                    <navigator url="../newGoods/newGoods">
                        <text class="txt">周一周四 · 新品首发</text>
                    </navigator>
                </view>
            </view>
            <view class="b">
                <view :key="index" class="item" v-for="(item, index) in newGoods">
                    <navigator :url="'../goods/goods?id=' + item.id">
                        <image :src="item.picUrl" background-size="cover" class="img"></image>
                        <text class="name">{{item.name}}</text>
                        <text class="price">￥{{item.retailPrice}}</text>
                    </navigator>
                </view>
            </view>
        </view>

        <view class="a-section a-popular" v-if="hotGoods.length > 0">
            <view class="h">
                <view>
                    <navigator url="../hotGoods/hotGoods">
                        <text class="txt">人气推荐</text>
                    </navigator>
                </view>
            </view>
            <view class="b">
                <view :key="index" class="item" v-for="(item, index) in hotGoods">
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

        <view :hidden="topics.length <= 0" class="a-section a-topic" v-if="topics.length > 0">
            <view class="h">
                <view>
                    <navigator url="/pages/topic/topic">
                        <text class="txt">专题精选</text>
                    </navigator>
                </view>
            </view>
            <view class="b">
                <scroll-view class="list" scroll-x>
                    <view :key="index" class="item" v-for="(item, index) in topics">
                        <navigator :url="'../topicDetail/topicDetail?id=' + item.id">
                            <image :src="item.picUrl" background-size="cover" class="img"></image>
                            <view class="np">
                                <text class="name">{{item.title}}</text>
                                <text class="price">￥{{item.price}}元起</text>
                            </view>
                            <text class="desc">{{item.subtitle}}</text>
                        </navigator>
                    </view>
                </scroll-view>
            </view>
        </view>
        <view :key="id" class="good-grid" v-for="(item, id) in floorGoods">
            <view class="h">
                <text>{{item.name}}</text>
            </view>
            <view class="b">
                <block :key="iindex" v-for="(iitem, iindex) in item.goodsList">
                    <view :class="'item ' + (iindex % 2 == 0 ? '' : 'item-b')">
                        <navigator :url="'../goods/goods?id=' + iitem.id" class="a">
                            <image :src="iitem.picUrl" background-size="cover" class="img"></image>
                            <text class="name">{{iitem.name}}</text>
                            <text class="price">￥{{iitem.retailPrice}}</text>
                        </navigator>
                    </view>
                </block>
            </view>
            <navigator :url="'/pages/category/category?id=' + item.id" class="t">
                <view class="txt">{{'更多'+item.name+'好物 >'}}</view>
            </navigator>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/index/index';
    const util = require('../../utils/util.js');
    const api = require('../../config/api.js');
    const user = require('../../utils/user.js');

    //获取应用实例
    const app = getApp();

    Page({
        data: {
            newGoods: [],
            hotGoods: [],
            topics: [],
            brands: [],
            groupons: [],
            floorGoods: [],
            banner: [],
            channel: [],
            coupon: [],
            goodsCount: 0
        },

        onShareAppMessage: function () {
            return {
                title: 'litemall小程序商场',
                desc: '开源微信小程序商城',
                path: '/pages/index/index'
            }
        },

        onPullDownRefresh() {
            wx.showNavigationBarLoading(); //在标题栏中显示加载
            this.getIndexData();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        },

        getIndexData: function () {
            let that = this;
            util.request(api.IndexUrl).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        newGoods: res.data.newGoodsList,
                        hotGoods: res.data.hotGoodsList,
                        topics: res.data.topicList,
                        brands: res.data.brandList,
                        floorGoods: res.data.floorGoodsList,
                        banner: res.data.banner,
                        groupons: res.data.grouponList,
                        channel: res.data.channel,
                        coupon: res.data.couponList
                    });
                }
            });
            util.request(api.GoodsCount).then(function (res) {
                that.setData({
                    goodsCount: res.data
                });
            });
        },
        onLoad: function (options) {

            // 页面初始化 options为页面跳转所带来的参数
            if (options.scene) {
                //这个scene的值存在则证明首页的开启来源于朋友圈分享的图,同时可以通过获取到的goodId的值跳转导航到对应的详情页
                var scene = decodeURIComponent(options.scene);
                console.log("scene:" + scene);

                let info_arr = [];
                info_arr = scene.split(',');
                let _type = info_arr[0];
                let id = info_arr[1];

                if (_type == 'goods') {
                    wx.navigateTo({
                        url: '../goods/goods?id=' + id
                    });
                } else if (_type == 'groupon') {
                    wx.navigateTo({
                        url: '../goods/goods?grouponId=' + id
                    });
                } else {
                    wx.navigateTo({
                        url: '../index/index'
                    });
                }
            }

            // 页面初始化 options为页面跳转所带来的参数
            if (options.grouponId) {
                //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
                wx.navigateTo({
                    url: '../goods/goods?grouponId=' + options.grouponId
                });
            }

            // 页面初始化 options为页面跳转所带来的参数
            if (options.goodId) {
                //这个goodId的值存在则证明首页的开启来源于分享,同时可以通过获取到的goodId的值跳转导航到对应的详情页
                wx.navigateTo({
                    url: '../goods/goods?id=' + options.goodId
                });
            }

            // 页面初始化 options为页面跳转所带来的参数
            if (options.orderId) {
                //这个orderId的值存在则证明首页的开启来源于订单模版通知,同时可以通过获取到的pageId的值跳转导航到对应的详情页
                wx.navigateTo({
                    url: '../ucenter/orderDetail/orderDetail?id=' + options.orderId
                });
            }

            this.getIndexData();
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
    });
    export default global['__wxComponents']['pages/index/index'];
</script>
<style>
    @import "./index.css";
</style>
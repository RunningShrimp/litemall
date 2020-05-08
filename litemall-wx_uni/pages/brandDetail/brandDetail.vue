<template>
    <view class="container">
        <view class="brand-info">
            <view class="name">
                <image :src="brand.picUrl" background-size="cover" class="img"></image>
                <view class="info-box">
                    <view class="info">
                        <text class="txt">{{brand.name}}</text>
                        <text class="line"></text>
                    </view>
                </view>
            </view>
            <view class="desc">{{brand.desc}}</view>
        </view>

        <view class="cate-item">
            <view class="b">
                <block :key="iindex" v-for="(iitem, iindex) in goodsList">
                    <navigator :class="'item ' + (iindex % 2 == 0 ? 'item-b' : '')"
                               :url="'../goods/goods?id=' + iitem.id">
                        <image :src="iitem.picUrl" background-size="cover" class="img"></image>
                        <text class="name">{{iitem.name}}</text>
                        <text class="price">￥{{iitem.retailPrice}}</text>
                    </navigator>
                </block>
            </view>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/brandDetail/brandDetail';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');


    var app = getApp();

    Page({
        data: {
            id: 0,
            brand: {},
            goodsList: [],
            page: 1,
            limit: 10
        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
            var that = this;
            that.setData({
                id: parseInt(options.id)
            });
            this.getBrand();
        },
        getBrand: function () {
            let that = this;
            util.request(api.BrandDetail, {
                id: that.data.id
            }).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        brand: res.data
                    });

                    that.getGoodsList();
                }
            });
        },
        getGoodsList() {
            var that = this;

            util.request(api.GoodsList, {
                brandId: that.data.id,
                page: that.data.page,
                limit: that.data.limit
            })
                .then(function (res) {
                    if (res.errno === 0) {
                        that.setData({
                            goodsList: res.data.list
                        });
                    }
                });
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

        }
    });
    export default global['__wxComponents']['pages/brandDetail/brandDetail'];
</script>
<style>
    @import "./brandDetail.css";
</style>
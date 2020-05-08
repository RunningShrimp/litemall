<template>
    <view class="container">
        <view class="search">
            <navigator class="input" url="/pages/search/search">
                <van-icon name="search"></van-icon>
                <text class="txt">商品搜索, 共{{goodsCount}}款好物</text>
            </navigator>
        </view>
        <view class="catalog">
            <scroll-view class="nav" scroll-y="true">
                <view :class="'item ' + ( currentCategory.id == item.id ? 'active' : '')" :data-id="item.id"
                      :data-index="index" :key="id" @tap="switchCate" v-for="(item, id) in categoryList">{{item.name}}
                </view>
            </scroll-view>
            <scroll-view class="cate" scroll-y="true">
                <navigator class="banner" url="url">
                    <image :src="currentCategory.picUrl" class="image"></image>
                    <view class="txt">{{currentCategory.frontName}}</view>
                </navigator>
                <view class="hd">
                    <text class="line"></text>
                    <text class="txt">{{currentCategory.name}}分类</text>
                    <text class="line"></text>
                </view>
                <view class="bd">
                    <navigator :class="'item ' + ((index+1) % 3 == 0 ? 'last' : '')" :key="index"
                               :url="'/pages/category/category?id=' + item.id"
                               v-for="(item, index) in currentSubCategoryList">
                        <image :src="item.picUrl" class="icon"></image>
                        <text class="txt">{{item.name}}</text>
                    </navigator>
                </view>
            </scroll-view>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/catalog/catalog';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');

    Page({
        data: {
            categoryList: [],
            currentCategory: {},
            currentSubCategoryList: {},
            scrollLeft: 0,
            scrollTop: 0,
            goodsCount: 0,
            scrollHeight: 0
        },
        onLoad: function (options) {
            this.getCatalog();
        },
        onPullDownRefresh() {
            wx.showNavigationBarLoading(); //在标题栏中显示加载
            this.getCatalog();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        },
        getCatalog: function () {
            //CatalogList
            let that = this;
            wx.showLoading({
                title: '加载中...',
            });
            util.request(api.CatalogList).then(function (res) {
                that.setData({
                    categoryList: res.data.categoryList,
                    currentCategory: res.data.currentCategory,
                    currentSubCategoryList: res.data.currentSubCategory
                });
                wx.hideLoading();
            });
            util.request(api.GoodsCount).then(function (res) {
                that.setData({
                    goodsCount: res.data
                });
            });

        },
        getCurrentCategory: function (id) {
            let that = this;
            util.request(api.CatalogCurrent, {
                id: id
            })
                .then(function (res) {
                    that.setData({
                        currentCategory: res.data.currentCategory,
                        currentSubCategoryList: res.data.currentSubCategory
                    });
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
        },
        switchCate: function (event) {
            var that = this;
            var currentTarget = event.currentTarget;
            if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
                return false;
            }

            this.getCurrentCategory(event.currentTarget.dataset.id);
        }
    });
    export default global['__wxComponents']['pages/catalog/catalog'];
</script>
<style>
    @import "./catalog.css";
</style>
<template>
    <view class="container">
        <view class="brand-info">
            <view class="name">
                <image :src="bannerInfo.imgUrl" background-size="cover" class="img"></image>
                <view class="info-box">
                    <view class="info">
                        <text class="txt">{{bannerInfo.name}}</text>
                        <text class="line"></text>
                    </view>
                </view>
            </view>
        </view>
        <view class="sort">
            <view class="sort-box">
                <view :class="'item ' + (currentSortType == 'default' ? 'active' : '')" @tap="openSortFilter"
                      id="defaultSort">
                    <text class="txt">综合</text>
                </view>
                <view :class="'item ' + (currentSortType == 'price' ? 'active' : '')" @tap="openSortFilter"
                      id="priceSort">
                    <text class="txt">价格</text>
                    <van-icon name="arrow-up" v-if="currentSortType == 'price' && currentSortOrder == 'asc'"></van-icon>
                    <van-icon name="arrow-down"
                              v-else-if="currentSortType == 'price' && currentSortOrder == 'desc'"></van-icon>
                </view>
                <view :class="'item ' + (currentSortType == 'category' ? 'active' : '')" @tap="openSortFilter"
                      id="categoryFilter">
                    <text class="txt">分类</text>
                </view>
            </view>
            <view class="sort-box-category" v-if="categoryFilter">
                <view :class="'item ' + (item.checked ? 'active' : '')" :data-category-index="index" :key="id"
                      @tap="selectCategory" v-for="(item, id) in filterCategory">{{item.name}}
                </view>
            </view>
        </view>
        <view class="cate-item">
            <view class="b">
                <block :key="iindex" v-for="(iitem, iindex) in goodsList">
                    <navigator :class="'item ' + (iindex % 2 == 0 ? 'item-b' : '' )"
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

    global['__wxRoute'] = 'pages/hotGoods/hotGoods';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');
    var app = getApp();

    Page({
        data: {
            bannerInfo: {
                'imgUrl': '/static/images/hot.png',
                'name': '大家都在买的'
            },
            categoryFilter: false,
            filterCategory: [],
            goodsList: [],
            categoryId: 0,
            currentSortType: 'default',
            currentSort: 'add_time',
            currentSortOrder: 'desc',
            page: 1,
            limit: 10
        },
        getCategoryList: function () {
            var that = this;

            util.request(api.GoodsFilter, {
                isHot: 1
            })
                .then(function (res) {
                    if (res.errno === 0) {
                        that.setData({
                            filterCategory: res.data.filterCategoryList,
                        });
                    }
                });
        },
        getGoodsList: function () {
            var that = this;

            util.request(api.GoodsList, {
                isHot: true,
                page: that.data.page,
                limit: that.data.limit,
                order: that.data.currentSortOrder,
                sort: that.data.currentSort,
                categoryId: that.data.categoryId
            })
                .then(function (res) {
                    if (res.errno === 0) {
                        that.setData({
                            goodsList: res.data.list,
                            filterCategory: res.data.filterCategoryList
                        });
                    }
                });

        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
            this.getGoodsList();
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
        openSortFilter: function (event) {
            let currentId = event.currentTarget.id;
            switch (currentId) {
                case 'categoryFilter':
                    this.setData({
                        categoryFilter: !this.data.categoryFilter,
                        currentSortType: 'category',
                        currentSort: 'add_time',
                        currentSortOrder: 'desc'
                    });
                    break;
                case 'priceSort':
                    let tmpSortOrder = 'asc';
                    if (this.data.currentSortOrder == 'asc') {
                        tmpSortOrder = 'desc';
                    }
                    this.setData({
                        currentSortType: 'price',
                        currentSort: 'retail_price',
                        currentSortOrder: tmpSortOrder,
                        categoryFilter: false
                    });

                    this.getGoodsList();
                    break;
                default:
                    //综合排序
                    this.setData({
                        currentSortType: 'default',
                        currentSort: 'add_time',
                        currentSortOrder: 'desc',
                        categoryFilter: false,
                        categoryId: 0,
                    });
                    this.getGoodsList();
            }
        },
        selectCategory: function (event) {
            let currentIndex = event.target.dataset.categoryIndex;
            this.setData({
                'categoryFilter': false,
                'categoryId': this.data.filterCategory[currentIndex].id
            });
            this.getGoodsList();
        }
    });
    export default global['__wxComponents']['pages/hotGoods/hotGoods'];
</script>
<style>
    @import "./hotGoods.css";
</style>
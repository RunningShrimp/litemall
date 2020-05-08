<template>
    <view class="container">
        <view class="cate-nav">
            <scroll-view :scroll-left="scrollLeft" class="cate-nav-body" scroll-x="true" style="width: 750rpx;">
                <view :class="'item ' + ( id == item.id ? 'active' : '')" :data-id="item.id" :data-index="index"
                      :key="id" @tap="switchCate" v-for="(item, id) in navList">
                    <view class="name">{{item.name}}</view>
                </view>
            </scroll-view>
        </view>
        <scroll-view :scroll-top="scrollTop" :style="'height:' + scrollHeight + ';'" scroll-y="true">

            <view class="cate-item">
                <view class="h">
                    <text class="name">{{currentCategory.name}}</text>
                    <text class="desc">{{currentCategory.desc}}</text>
                </view>
                <view class="b">
                    <navigator :class="'item ' + ((iindex + 1) % 2 == 0 ? 'item-b' : '')" :key="iindex"
                               :url="'/pages/goods/goods?id=' + iitem.id" v-for="(iitem, iindex) in goodsList">
                        <image :src="iitem.picUrl" background-size="cover" class="img"></image>
                        <text class="name">{{iitem.name}}</text>
                        <text class="price">￥{{iitem.retailPrice}}</text>
                    </navigator>
                </view>
            </view>
        </scroll-view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/category/category';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');

    Page({
        data: {
            navList: [],
            goodsList: [],
            id: 0,
            currentCategory: {},
            scrollLeft: 0,
            scrollTop: 0,
            scrollHeight: 0,
            page: 1,
            limit: 10
        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
            var that = this;
            if (options.id) {
                that.setData({
                    id: parseInt(options.id)
                });
            }

            wx.getSystemInfo({
                success: function (res) {
                    that.setData({
                        scrollHeight: res.windowHeight
                    });
                }
            });


            this.getCategoryInfo();

        },
        getCategoryInfo: function () {
            let that = this;
            util.request(api.GoodsCategory, {
                id: this.data.id
            })
                .then(function (res) {

                    if (res.errno == 0) {
                        that.setData({
                            navList: res.data.brotherCategory,
                            currentCategory: res.data.currentCategory
                        });

                        wx.setNavigationBarTitle({
                            title: res.data.parentCategory.name
                        });

                        // 当id是L1分类id时，这里需要重新设置成L1分类的一个子分类的id
                        if (res.data.parentCategory.id == that.data.id) {
                            that.setData({
                                id: res.data.currentCategory.id
                            });
                        }

                        //nav位置
                        let currentIndex = 0;
                        let navListCount = that.data.navList.length;
                        for (let i = 0; i < navListCount; i++) {
                            currentIndex += 1;
                            if (that.data.navList[i].id == that.data.id) {
                                break;
                            }
                        }
                        if (currentIndex > navListCount / 2 && navListCount > 5) {
                            that.setData({
                                scrollLeft: currentIndex * 60
                            });
                        }
                        that.getGoodsList();

                    } else {
                        //显示错误信息
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
        getGoodsList: function () {
            var that = this;

            util.request(api.GoodsList, {
                categoryId: that.data.id,
                page: that.data.page,
                limit: that.data.limit
            })
                .then(function (res) {
                    that.setData({
                        goodsList: res.data.list,
                    });
                });
        },
        onUnload: function () {
            // 页面关闭
        },
        switchCate: function (event) {
            if (this.data.id == event.currentTarget.dataset.id) {
                return false;
            }
            var that = this;
            var clientX = event.detail.x;
            var currentTarget = event.currentTarget;
            if (clientX < 60) {
                that.setData({
                    scrollLeft: currentTarget.offsetLeft - 60
                });
            } else if (clientX > 330) {
                that.setData({
                    scrollLeft: currentTarget.offsetLeft
                });
            }
            this.setData({
                id: event.currentTarget.dataset.id
            });

            this.getCategoryInfo();
        }
    });
    export default global['__wxComponents']['pages/category/category'];
</script>
<style>
    @import "./category.css";
</style>
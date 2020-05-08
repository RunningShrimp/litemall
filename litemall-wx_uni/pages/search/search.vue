<template>
    <view>
        <scroll-view class="container" style="height: 100%;">
            <view class="search-header">
                <view class="input-box">
                    <van-icon name="search"></van-icon>
                    <input :placeholder="defaultKeyword.keyword" :value="keyword" @confirm="onKeywordConfirm"
                           @focus="inputFocus" @input="inputChange" class="keywrod" confirm-type="search" focus="true"
                           name="input"></input>
                    <van-icon @tap="clearKeyword" class="del" name="cross" v-if="keyword"></van-icon>
                </view>
                <view @tap="closeSearch" class="right">取消</view>
            </view>
            <view class="no-search" v-if="!searchStatus">
                <view class="search-keywords search-history" v-if="!keyword  && historyKeyword.length">
                    <view class="h">
                        <text class="title">历史记录</text>
                        <van-icon @tap="clearHistory" class="icon" name="delete"></van-icon>
                    </view>
                    <view class="b">
                        <view :data-keyword="item.keyword" :key="keyword" @tap="onKeywordTap" class="item"
                              hover-class="navigator-hover" v-for="(item, keyword) in historyKeyword">{{item.keyword}}
                        </view>
                    </view>
                </view>
                <view class="search-keywords search-hot" v-if="!keyword && hotKeyword.length">
                    <view class="h">
                        <text class="title">热门搜索</text>
                    </view>
                    <view class="b">
                        <view :class="'item ' + (item.is_hot === 1 ? 'active' : '')" :data-keyword="item.keyword"
                              :key="id" @tap="onKeywordTap" hover-class="navigator-hover"
                              v-for="(item, id) in hotKeyword">{{item.keyword}}
                        </view>
                    </view>
                </view>
                <view class="shelper-list" v-if="keyword">
                    <view :data-keyword="item" :key="id" @tap="onKeywordTap" class="item" hover-class="navigator-hover"
                          v-for="(item, id) in helpKeyword">{{item}}
                    </view>
                </view>
            </view>

            <view class="search-result" v-if="searchStatus && goodsList.length">
                <view class="sort">
                    <view class="sort-box">
                        <view :class="'item ' + (currentSortType == 'default' ? 'active' : '')" @tap="openSortFilter"
                              id="defaultSort">
                            <text class="txt">综合</text>
                        </view>
                        <view :class="'item ' + (currentSortType == 'price' ? 'active' : '')" @tap="openSortFilter"
                              id="priceSort">
                            <text class="txt">价格</text>
                            <van-icon name="arrow-up"
                                      v-if="currentSortType == 'price' && currentSortOrder == 'asc'"></van-icon>
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
                        <navigator :class="'item ' + ((iindex + 1) % 2 == 0 ? 'item-b' : '')" :key="iindex"
                                   :url="'/pages/goods/goods?id=' + iitem.id" v-for="(iitem, iindex) in goodsList">
                            <image :src="iitem.picUrl" background-size="cover" class="img"></image>
                            <text class="name">{{iitem.name}}</text>
                            <text class="price">￥{{iitem.retailPrice}}</text>
                        </navigator>
                    </view>
                </view>
            </view>

            <view class="search-result-empty" v-if="!goodsList.length && searchStatus">
                <text class="text">您寻找的商品还未上架</text>
            </view>
        </scroll-view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/search/search';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');

    var app = getApp();
    Page({
        data: {
            keywrod: '',
            searchStatus: false,
            goodsList: [],
            helpKeyword: [],
            historyKeyword: [],
            categoryFilter: false,
            currentSort: 'name',
            currentSortType: 'default',
            currentSortOrder: 'desc',
            filterCategory: [],
            defaultKeyword: {},
            hotKeyword: [],
            page: 1,
            limit: 20,
            categoryId: 0
        },
        //事件处理函数
        closeSearch: function () {
            wx.navigateBack()
        },
        clearKeyword: function () {
            this.setData({
                keyword: '',
                searchStatus: false
            });
        },
        onLoad: function () {

            this.getSearchKeyword();
        },

        getSearchKeyword() {
            let that = this;
            util.request(api.SearchIndex).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        historyKeyword: res.data.historyKeywordList,
                        defaultKeyword: res.data.defaultKeyword,
                        hotKeyword: res.data.hotKeywordList
                    });
                }
            });
        },

        inputChange: function (e) {
            this.setData({
                keyword: e.detail.value,
                searchStatus: false
            });

            if (e.detail.value) {
                this.getHelpKeyword();
            }
        },
        getHelpKeyword: function () {
            let that = this;
            util.request(api.SearchHelper, {
                keyword: that.data.keyword
            }).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        helpKeyword: res.data
                    });
                }
            });
        },
        inputFocus: function () {
            this.setData({
                searchStatus: false,
                goodsList: []
            });

            if (this.data.keyword) {
                this.getHelpKeyword();
            }
        },
        clearHistory: function () {
            this.setData({
                historyKeyword: []
            });

            util.request(api.SearchClearHistory, {}, 'POST')
                .then(function (res) {
                    console.log('清除成功');
                });
        },
        getGoodsList: function () {
            let that = this;
            util.request(api.GoodsList, {
                keyword: that.data.keyword,
                page: that.data.page,
                limit: that.data.limit,
                sort: that.data.currentSort,
                order: that.data.currentSortOrder,
                categoryId: that.data.categoryId
            }).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        searchStatus: true,
                        categoryFilter: false,
                        goodsList: res.data.list,
                        filterCategory: res.data.filterCategoryList
                    });
                }

                //重新获取关键词
                that.getSearchKeyword();
            });
        },
        onKeywordTap: function (event) {

            this.getSearchResult(event.target.dataset.keyword);

        },
        getSearchResult(keyword) {
            if (keyword === '') {
                keyword = this.data.defaultKeyword.keyword;
            }
            this.setData({
                keyword: keyword,
                page: 1,
                categoryId: 0,
                goodsList: []
            });

            this.getGoodsList();
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
                        currentSort: 'name',
                        currentSortOrder: 'desc',
                        categoryFilter: false,
                        categoryId: 0,
                    });
                    this.getGoodsList();
            }
        },
        selectCategory: function (event) {
            let currentIndex = event.target.dataset.categoryIndex;
            let filterCategory = this.data.filterCategory;
            let currentCategory = null;
            for (let key in filterCategory) {
                if (key == currentIndex) {
                    filterCategory[key].selected = true;
                    currentCategory = filterCategory[key];
                } else {
                    filterCategory[key].selected = false;
                }
            }
            this.setData({
                filterCategory: filterCategory,
                categoryFilter: false,
                categoryId: currentCategory.id,
                page: 1,
                goodsList: []
            });
            this.getGoodsList();
        },
        onKeywordConfirm(event) {
            this.getSearchResult(event.detail.value);
        }
    });
    export default global['__wxComponents']['pages/search/search'];
</script>
<style>
    @import "./search.css";
</style>
<template>
    <view class="container">
        <view class="progress">
            <view class="item-a">
                <van-steps :active="active" :active-color="activeColor" :active-icon="activeIcon"
                           :steps="steps"></van-steps>
            </view>
            <view class="item-c" v-if="groupon.status === 1">
                <view class="l">开团还缺
                    <van-tag type="danger">{{rules.discountMember - joiners.length}}</van-tag>
                    人
                </view>
                <view class="r">
                    <button class="btn active" open-type="share">邀请参团</button>
                </view>
            </view>
        </view>

        <view class="menu-list-pro">
            <view class="h">
                <view class="label">参与团购 ( {{joiners.length}}人)</view>
                <view class="status">查看全部</view>
            </view>
            <view :data-id="item.id" :key="id" class="menu-list-item" v-for="(item, id) in joiners">
                <image :src="item.avatar" class="icon"></image>
                <text class="txt">{{item.nickname}}</text>
            </view>
        </view>

        <view class="order-goods">
            <view class="h">
                <view class="label">商品信息</view>
            </view>
            <view class="goods">
                <view :key="id" class="item" v-for="(item, id) in orderGoods">
                    <view class="img">
                        <image :src="item.picUrl"></image>
                    </view>
                    <view class="info">
                        <view class="t">
                            <text class="name">{{item.goodsName}}</text>
                            <text class="number">x{{item.number}}</text>
                        </view>
                        <view class="attr">{{item.goodsSpecificationValues}}</view>
                        <view class="price">￥{{item.retailPrice}}</view>
                    </view>
                </view>
            </view>

            <view class="order-bottom">
                <view class="total">
                    <view class="t">
                        <text class="label">商品合计：</text>
                        <text class="txt">￥{{orderInfo.goodsPrice}}</text>
                    </view>
                    <view class="t">
                        <text class="label">商品运费：</text>
                        <text class="txt">￥{{orderInfo.freightPrice}}</text>
                    </view>
                </view>
                <view class="pay-fee">
                    <text class="label">商品实付：</text>
                    <text class="txt">￥{{orderInfo.actualPrice}}</text>
                </view>
            </view>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/groupon/grouponDetail/grouponDetail';
    var util = require('../../../utils/util.js');
    var api = require('../../../config/api.js');

    Page({
        data: {
            id: 0,
            groupon: {},
            joiners: [],
            orderInfo: {},
            orderGoods: [],
            rules: {},
            active: 0,
            steps: [],
            activeIcon: '',
            activeColor: ''
        },

        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
            this.setData({
                id: options.id
            });
            this.getOrderDetail();
        },

        // 页面分享
        onShareAppMessage: function () {
            let that = this;
            return {
                title: '邀请团购',
                desc: '唯爱与美食不可辜负',
                path: '/pages/index/index?grouponId=' + this.data.id
            }
        },
        getOrderDetail: function () {
            let that = this;
            util.request(api.GroupOnDetail, {
                grouponId: that.data.id
            }).then(function (res) {
                if (res.errno === 0) {
                    let _steps = [{
                        text: '已开团'
                    },
                        {
                            text: '开团中'
                        },
                        {
                            text: '开团成功'
                        }
                    ];
                    let _active = res.data.groupon.status;
                    let _activeIcon = 'success';
                    let _activeColor = '#07c160';
                    if (res.data.groupon.status === 3) {
                        _steps = [{
                            text: '已开团'
                        },
                            {
                                text: '开团中'
                            },
                            {
                                text: '开团失败'
                            }
                        ];
                        _active = 2;
                        _activeIcon = 'fail';
                        _activeColor = '#EE0A24'
                    }
                    that.setData({
                        joiners: res.data.joiners,
                        groupon: res.data.groupon,
                        orderInfo: res.data.orderInfo,
                        orderGoods: res.data.orderGoods,
                        rules: res.data.rules,
                        active: _active,
                        steps: _steps,
                        activeIcon: _activeIcon,
                        activeColor: _activeColor
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
    export default global['__wxComponents']['pages/groupon/grouponDetail/grouponDetail'];
</script>
<style>
    @import "./grouponDetail.css";
</style>
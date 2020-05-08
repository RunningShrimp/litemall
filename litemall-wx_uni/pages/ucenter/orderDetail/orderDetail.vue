<template>
    <view class="container">
        <view class="order-info">
            <view class="item">下单时间：{{orderInfo.addTime}}</view>
            <view class="item">订单编号：{{orderInfo.orderSn}}</view>
            <view class="item">订单留言：{{orderInfo.message}}</view>
            <view class="item-c">
                <view class="l">实付：
                    <text class="cost">￥{{orderInfo.actualPrice}}</text>
                </view>
                <view class="r">
                    <view @tap="cancelOrder" class="btn active" v-if="handleOption.cancel">取消订单</view>
                    <view @tap="payOrder" class="btn active" v-if="handleOption.pay">去付款</view>
                    <view @tap="confirmOrder" class="btn active" v-if="handleOption.confirm">确认收货</view>
                    <view @tap="deleteOrder" class="btn active" v-if="handleOption.delete">删除订单</view>
                    <view @tap="refundOrder" class="btn active" v-if="handleOption.refund">申请退款</view>
                    <view @tap="aftersaleOrder" class="btn active" v-if="handleOption.aftersale">申请售后</view>
                </view>
            </view>
        </view>

        <view class="order-goods">
            <view class="h">
                <view class="label">商品信息</view>
                <view class="status">{{orderInfo.orderStatusText}}</view>
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
                        <view class="attr">{{item.specifications}}</view>
                        <view class="price">￥{{item.price}}</view>
                        <view class="btn active" v-if="handleOption.comment && (item.comment == 0)">
                            <navigator
                                    :url="'../../commentPost/commentPost?orderId=' + item.orderId + '&&valueId=' + item.goodsId + '&type=0'">
                                去评价
                            </navigator>
                        </view>
                        <view class="btn active" v-if="handleOption.rebuy">
                            <navigator :url="'../../goods/goods?id=' + item.goodsId">再次购买</navigator>
                        </view>
                    </view>
                </view>
            </view>

            <view class="order-bottom">
                <view class="address">
                    <view class="t">
                        <text class="name">{{orderInfo.consignee}}</text>
                        <text class="mobile">{{orderInfo.mobile}}</text>
                    </view>
                    <view class="b">{{orderInfo.address}}</view>
                </view>
                <view class="total">
                    <view class="t">
                        <text class="label">商品合计：</text>
                        <text class="txt">￥{{orderInfo.goodsPrice}}</text>
                    </view>
                    <view class="t">
                        <text class="label">运费：</text>
                        <text class="txt">￥{{orderInfo.freightPrice}}</text>
                    </view>
                    <view class="t">
                        <text class="label">优惠：</text>
                        <text class="txt">￥-{{orderInfo.couponPrice}}</text>
                    </view>
                </view>
                <view class="pay-fee">
                    <text class="label">实付：</text>
                    <text class="txt">￥{{orderInfo.actualPrice}}</text>
                </view>
            </view>
        </view>

        <view @tap="expandDetail" class="order-express" v-if="orderInfo.expNo">
            <view class="order-express">
                <view class="title">
                    <view class="t">快递公司：{{orderInfo.expName}}</view>
                    <view class="b">物流单号：{{orderInfo.expNo}}</view>
                </view>
                <van-icon class="ti" name="arrow"></van-icon>
            </view>
            <view :key="index" class="traces" v-for="(iitem, index) in expressInfo.Traces" v-if="flag">
                <view class="trace">
                    <view class="acceptStation">{{iitem.AcceptStation}}</view>
                    <view class="acceptTime">{{iitem.AcceptTime}}</view>
                </view>
            </view>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/ucenter/orderDetail/orderDetail';
    var util = require('../../../utils/util.js');
    var api = require('../../../config/api.js');

    Page({
        data: {
            orderId: 0,
            orderInfo: {},
            orderGoods: [],
            expressInfo: {},
            flag: false,
            handleOption: {}
        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
            this.setData({
                orderId: options.id
            });
            this.getOrderDetail();
        },
        onPullDownRefresh() {
            wx.showNavigationBarLoading(); //在标题栏中显示加载
            this.getOrderDetail();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        },
        expandDetail: function () {
            let that = this;
            this.setData({
                flag: !that.data.flag
            })
        },
        getOrderDetail: function () {
            wx.showLoading({
                title: '加载中',
            });

            setTimeout(function () {
                wx.hideLoading()
            }, 2000);

            let that = this;
            util.request(api.OrderDetail, {
                orderId: that.data.orderId
            }).then(function (res) {
                if (res.errno === 0) {
                    console.log(res.data);
                    that.setData({
                        orderInfo: res.data.orderInfo,
                        orderGoods: res.data.orderGoods,
                        handleOption: res.data.orderInfo.handleOption,
                        expressInfo: res.data.expressInfo
                    });
                }

                wx.hideLoading();
            });
        },
        // “去付款”按钮点击效果
        payOrder: function () {
            let that = this;
            util.request(api.OrderPrepay, {
                orderId: that.data.orderId
            }, 'POST').then(function (res) {
                if (res.errno === 0) {
                    const payParam = res.data;
                    console.log("支付过程开始");
                    wx.requestPayment({
                        'timeStamp': payParam.timeStamp,
                        'nonceStr': payParam.nonceStr,
                        'package': payParam.packageValue,
                        'signType': payParam.signType,
                        'paySign': payParam.paySign,
                        'success': function (res) {
                            console.log("支付过程成功");
                            util.redirect('/pages/ucenter/order/order');
                        },
                        'fail': function (res) {
                            console.log("支付过程失败");
                            util.showErrorToast('支付失败');
                        },
                        'complete': function (res) {
                            console.log("支付过程结束")
                        }
                    });
                }
            });

        },
        // “取消订单”点击效果
        cancelOrder: function () {
            let that = this;
            let orderInfo = that.data.orderInfo;

            wx.showModal({
                title: '',
                content: '确定要取消此订单？',
                success: function (res) {
                    if (res.confirm) {
                        util.request(api.OrderCancel, {
                            orderId: orderInfo.id
                        }, 'POST').then(function (res) {
                            if (res.errno === 0) {
                                wx.showToast({
                                    title: '取消订单成功'
                                });
                                util.redirect('/pages/ucenter/order/order');
                            } else {
                                util.showErrorToast(res.errmsg);
                            }
                        });
                    }
                }
            });
        },
        // “取消订单并退款”点击效果
        refundOrder: function () {
            let that = this;
            let orderInfo = that.data.orderInfo;

            wx.showModal({
                title: '',
                content: '确定要取消此订单？',
                success: function (res) {
                    if (res.confirm) {
                        util.request(api.OrderRefund, {
                            orderId: orderInfo.id
                        }, 'POST').then(function (res) {
                            if (res.errno === 0) {
                                wx.showToast({
                                    title: '取消订单成功'
                                });
                                util.redirect('/pages/ucenter/order/order');
                            } else {
                                util.showErrorToast(res.errmsg);
                            }
                        });
                    }
                }
            });
        },
        // “删除”点击效果
        deleteOrder: function () {
            let that = this;
            let orderInfo = that.data.orderInfo;

            wx.showModal({
                title: '',
                content: '确定要删除此订单？',
                success: function (res) {
                    if (res.confirm) {
                        util.request(api.OrderDelete, {
                            orderId: orderInfo.id
                        }, 'POST').then(function (res) {
                            if (res.errno === 0) {
                                wx.showToast({
                                    title: '删除订单成功'
                                });
                                util.redirect('/pages/ucenter/order/order');
                            } else {
                                util.showErrorToast(res.errmsg);
                            }
                        });
                    }
                }
            });
        },
        // “确认收货”点击效果
        confirmOrder: function () {
            let that = this;
            let orderInfo = that.data.orderInfo;

            wx.showModal({
                title: '',
                content: '确认收货？',
                success: function (res) {
                    if (res.confirm) {
                        util.request(api.OrderConfirm, {
                            orderId: orderInfo.id
                        }, 'POST').then(function (res) {
                            if (res.errno === 0) {
                                wx.showToast({
                                    title: '确认收货成功！'
                                });
                                util.redirect('/pages/ucenter/order/order');
                            } else {
                                util.showErrorToast(res.errmsg);
                            }
                        });
                    }
                }
            });
        },
        // “申请售后”点击效果
        aftersaleOrder: function () {
            if (this.data.orderInfo.aftersaleStatus === 0) {
                util.redirect('/pages/ucenter/aftersale/aftersale?id=' + this.data.orderId);
            } else {
                util.redirect('/pages/ucenter/aftersaleDetail/aftersaleDetail?id=' + this.data.orderId);
            }
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
    export default global['__wxComponents']['pages/ucenter/orderDetail/orderDetail'];
</script>
<style>
    @import "./orderDetail.css";
</style>
<template>
    <view class="container">
        <view class="address-box">
            <view @tap="selectAddress" class="address-item" v-if="checkedAddress.id > 0">
                <view class="l">
                    <text class="name">{{checkedAddress.name}}</text>
                    <text class="default" v-if="checkedAddress.isDefault">默认</text>
                </view>
                <view class="m">
                    <text class="mobile">{{checkedAddress.tel}}</text>
                    <text class="address">{{checkedAddress.addressDetail}}</text>
                </view>
                <view class="r">
                    <van-icon name="arrow"></van-icon>
                </view>
            </view>
            <view @tap="selectAddress" class="address-item address-empty" v-else>
                <view class="m">还没有收货地址，去添加</view>
                <view class="r">
                    <van-icon name="arrow"></van-icon>
                </view>
            </view>
        </view>

        <view class="coupon-box">
            <view @tap="selectCoupon" class="coupon-item">
                <view class="l" v-if="couponId == 0">
                    <text class="name">没有可用的优惠券</text>
                    <text class="txt">0张</text>
                </view>
                <view class="l" v-else-if="couponId == -1">
                    <text class="name">优惠券</text>
                    <text class="txt">{{availableCouponLength}}张</text>
                </view>
                <view class="l" v-else>
                    <text class="name">优惠券</text>
                    <text class="txt">-￥{{couponPrice}}元</text>
                </view>
                <view class="r">
                    <van-icon name="arrow"></van-icon>
                </view>
            </view>
        </view>

        <view class="message-box">
            <input :value="message" @input="bindMessageInput" class="message-item" placeholder="如需要，请输入留言"></input>
        </view>

        <view class="order-box">
            <view class="order-item">
                <view class="l">
                    <text class="name">商品合计</text>
                </view>
                <view class="r">
                    <text class="txt">￥{{goodsTotalPrice}}元</text>
                </view>
            </view>
            <view class="order-item">
                <view class="l">
                    <text class="name">运费</text>
                </view>
                <view class="r">
                    <text class="txt">￥{{freightPrice}}元</text>
                </view>
            </view>
            <view class="order-item no-border">
                <view class="l">
                    <text class="name">优惠券</text>
                </view>
                <view class="r">
                    <text class="txt">-￥{{couponPrice}}元</text>
                </view>
            </view>
        </view>

        <view class="goods-items">
            <view :key="id" class="item" v-for="(item, id) in checkedGoodsList">
                <view class="img">
                    <image :src="item.picUrl"></image>
                </view>
                <view class="info">
                    <view class="t">
                        <text class="name">{{item.goodsName}}</text>
                        <text class="number">x{{item.number}}</text>
                    </view>
                    <view class="m">{{item.specifications}}</view>
                    <view class="b">￥{{item.price}}</view>
                </view>
            </view>
        </view>

        <view class="order-total">
            <view class="l">实付：￥{{actualPrice}}</view>
            <view @tap="submitOrder" class="r">去付款</view>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/checkout/checkout';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');

    var app = getApp();

    Page({
        data: {
            checkedGoodsList: [],
            checkedAddress: {},
            availableCouponLength: 0, // 可用的优惠券数量
            goodsTotalPrice: 0.00, //商品总价
            freightPrice: 0.00, //快递费
            couponPrice: 0.00, //优惠券的价格
            grouponPrice: 0.00, //团购优惠价格
            orderTotalPrice: 0.00, //订单总价
            actualPrice: 0.00, //实际需要支付的总价
            cartId: 0,
            addressId: 0,
            couponId: 0,
            userCouponId: 0,
            message: '',
            grouponLinkId: 0, //参与的团购
            grouponRulesId: 0 //团购规则ID
        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
        },

        //获取checkou信息
        getCheckoutInfo: function () {
            let that = this;
            util.request(api.CartCheckout, {
                cartId: that.data.cartId,
                addressId: that.data.addressId,
                couponId: that.data.couponId,
                userCouponId: that.data.userCouponId,
                grouponRulesId: that.data.grouponRulesId
            }).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        checkedGoodsList: res.data.checkedGoodsList,
                        checkedAddress: res.data.checkedAddress,
                        availableCouponLength: res.data.availableCouponLength,
                        actualPrice: res.data.actualPrice,
                        couponPrice: res.data.couponPrice,
                        grouponPrice: res.data.grouponPrice,
                        freightPrice: res.data.freightPrice,
                        goodsTotalPrice: res.data.goodsTotalPrice,
                        orderTotalPrice: res.data.orderTotalPrice,
                        addressId: res.data.addressId,
                        couponId: res.data.couponId,
                        userCouponId: res.data.userCouponId,
                        grouponRulesId: res.data.grouponRulesId,
                    });
                }
                wx.hideLoading();
            });
        },
        selectAddress() {
            wx.navigateTo({
                url: '/pages/ucenter/address/address',
            })
        },
        selectCoupon() {
            wx.navigateTo({
                url: '/pages/ucenter/couponSelect/couponSelect',
            })
        },
        bindMessageInput: function (e) {
            this.setData({
                message: e.detail.value
            });
        },
        onReady: function () {
            // 页面渲染完成

        },
        onShow: function () {
            // 页面显示
            wx.showLoading({
                title: '加载中...',
            });
            try {
                var cartId = wx.getStorageSync('cartId');
                if (cartId === "") {
                    cartId = 0;
                }
                var addressId = wx.getStorageSync('addressId');
                if (addressId === "") {
                    addressId = 0;
                }
                var couponId = wx.getStorageSync('couponId');
                if (couponId === "") {
                    couponId = 0;
                }
                var userCouponId = wx.getStorageSync('userCouponId');
                if (userCouponId === "") {
                    userCouponId = 0;
                }
                var grouponRulesId = wx.getStorageSync('grouponRulesId');
                if (grouponRulesId === "") {
                    grouponRulesId = 0;
                }
                var grouponLinkId = wx.getStorageSync('grouponLinkId');
                if (grouponLinkId === "") {
                    grouponLinkId = 0;
                }

                this.setData({
                    cartId: cartId,
                    addressId: addressId,
                    couponId: couponId,
                    userCouponId: userCouponId,
                    grouponRulesId: grouponRulesId,
                    grouponLinkId: grouponLinkId
                });

            } catch (e) {
                // Do something when catch error
                console.log(e);
            }

            this.getCheckoutInfo();
        },
        onHide: function () {
            // 页面隐藏

        },
        onUnload: function () {
            // 页面关闭

        },
        submitOrder: function () {
            if (this.data.addressId <= 0) {
                util.showErrorToast('请选择收货地址');
                return false;
            }
            util.request(api.OrderSubmit, {
                cartId: this.data.cartId,
                addressId: this.data.addressId,
                couponId: this.data.couponId,
                userCouponId: this.data.userCouponId,
                message: this.data.message,
                grouponRulesId: this.data.grouponRulesId,
                grouponLinkId: this.data.grouponLinkId
            }, 'POST').then(res => {
                if (res.errno === 0) {

                    // 下单成功，重置couponId
                    try {
                        wx.setStorageSync('couponId', 0);
                    } catch (error) {

                    }

                    const orderId = res.data.orderId;
                    const grouponLinkId = res.data.grouponLinkId;
                    util.request(api.OrderPrepay, {
                        orderId: orderId
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
                                    if (grouponLinkId) {
                                        setTimeout(() => {
                                            wx.redirectTo({
                                                url: '/pages/groupon/grouponDetail/grouponDetail?id=' + grouponLinkId
                                            })
                                        }, 1000);
                                    } else {
                                        wx.redirectTo({
                                            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                                        });
                                    }
                                },
                                'fail': function (res) {
                                    console.log("支付过程失败");
                                    wx.redirectTo({
                                        url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                                    });
                                },
                                'complete': function (res) {
                                    console.log("支付过程结束")
                                }
                            });
                        } else {
                            wx.redirectTo({
                                url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                            });
                        }
                    });

                } else {
                    util.showErrorToast(res.errmsg);
                }
            });
        }
    });
    export default global['__wxComponents']['pages/checkout/checkout'];
</script>
<style>
    @import "./checkout.css";
</style>
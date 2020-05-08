<template>
    <view class="container">
        <view class="no-login" v-if="!hasLogin">
            <view class="c">
                <text>还没有登录</text>
                <button @tap="goLogin" style="background-color:#A9A9A9">去登录</button>
            </view>
        </view>
        <view class="login" v-else>
            <view class="service-policy">
                <view class="item">30天无忧退货</view>
                <view class="item">48小时快速退款</view>
                <view class="item">满88元免邮费</view>
            </view>
            <view class="no-cart" v-if="cartGoods.length <= 0">
                <view class="c">
                    <text>空空如也~</text>
                    <text>去添加点什么吧</text>
                </view>
            </view>
            <view class="cart-view" v-else>
                <view class="list">
                    <view class="group-item">
                        <view class="goods">
                            <view :class="'item ' + (isEditCart ? 'edit' : '')" :key="id"
                                  v-for="(item, id) in cartGoods">
                                <van-checkbox :data-item-index="index" :value="item.checked"
                                              @change="checkedItem"></van-checkbox>
                                <view class="cart-goods">
                                    <image :src="item.picUrl" class="img"></image>
                                    <view class="info">
                                        <view class="t">
                                            <text class="name">{{item.goodsName}}</text>
                                            <text class="num">x{{item.number}}</text>
                                        </view>
                                        <view class="attr">{{ isEditCart ? '已选择:' : ''}}{{item.specifications||''}}
                                        </view>
                                        <view class="b">
                                            <text class="price">￥{{item.price}}</text>
                                            <view class="selnum">
                                                <view :data-item-index="index" @tap="cutNumber" class="cut">-</view>
                                                <input :value="item.number" class="number" disabled="true"
                                                       type="number"></input>
                                                <view :data-item-index="index" @tap="addNumber" class="add">+</view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                </view>
                <view class="cart-bottom">
                    <van-checkbox :value="checkedAllStatus" @change="checkedAll">全选（{{cartTotal.checkedGoodsCount}}）
                    </van-checkbox>
                    <view class="total">{{!isEditCart ? '￥'+cartTotal.checkedGoodsAmount : ''}}</view>
                    <view class="action_btn_area">
                        <view :class="!isEditCart ? 'edit' : 'sure'" @tap="editCart">{{!isEditCart ? '编辑' : '完成'}}
                        </view>
                        <view @tap="deleteCart" class="delete" v-if="isEditCart">删除({{cartTotal.checkedGoodsCount}})
                        </view>
                        <view @tap="checkoutOrder" class="checkout" v-if="!isEditCart">下单</view>
                        <!-- </view>  -->
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/cart/cart';
    var util = require('../../utils/util.js');
    var api = require('../../config/api.js');
    var user = require('../../utils/user.js');

    var app = getApp();

    Page({
        data: {
            cartGoods: [],
            cartTotal: {
                "goodsCount": 0,
                "goodsAmount": 0.00,
                "checkedGoodsCount": 0,
                "checkedGoodsAmount": 0.00
            },
            isEditCart: false,
            checkedAllStatus: true,
            editCartList: [],
            hasLogin: false
        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
        },
        onReady: function () {
            // 页面渲染完成
        },
        onPullDownRefresh() {
            wx.showNavigationBarLoading(); //在标题栏中显示加载
            this.getCartList();
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        },
        onShow: function () {
            // 页面显示
            if (app.globalData.hasLogin) {
                this.getCartList();
            }

            this.setData({
                hasLogin: app.globalData.hasLogin
            });

        },
        onHide: function () {
            // 页面隐藏
        },
        onUnload: function () {
            // 页面关闭
        },
        goLogin() {
            wx.navigateTo({
                url: "/pages/auth/login/login"
            });
        },
        getCartList: function () {
            let that = this;
            util.request(api.CartList).then(function (res) {
                if (res.errno === 0) {
                    that.setData({
                        cartGoods: res.data.cartList,
                        cartTotal: res.data.cartTotal
                    });

                    that.setData({
                        checkedAllStatus: that.isCheckedAll()
                    });
                }
            });
        },
        isCheckedAll: function () {
            //判断购物车商品已全选
            return this.data.cartGoods.every(function (element, index, array) {
                if (element.checked == true) {
                    return true;
                } else {
                    return false;
                }
            });
        },
        doCheckedAll: function () {
            let checkedAll = this.isCheckedAll();
            this.setData({
                checkedAllStatus: this.isCheckedAll()
            });
        },
        checkedItem: function (event) {
            let itemIndex = event.target.dataset.itemIndex;
            let that = this;

            let productIds = [];
            productIds.push(that.data.cartGoods[itemIndex].productId);
            if (!this.data.isEditCart) {
                util.request(api.CartChecked, {
                    productIds: productIds,
                    isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1
                }, 'POST').then(function (res) {
                    if (res.errno === 0) {
                        that.setData({
                            cartGoods: res.data.cartList,
                            cartTotal: res.data.cartTotal
                        });
                    }

                    that.setData({
                        checkedAllStatus: that.isCheckedAll()
                    });
                });
            } else {
                //编辑状态
                let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
                    if (index == itemIndex) {
                        element.checked = !element.checked;
                    }

                    return element;
                });

                that.setData({
                    cartGoods: tmpCartData,
                    checkedAllStatus: that.isCheckedAll(),
                    'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
                });
            }
        },
        getCheckedGoodsCount: function () {
            let checkedGoodsCount = 0;
            this.data.cartGoods.forEach(function (v) {
                if (v.checked === true) {
                    checkedGoodsCount += v.number;
                }
            });
            console.log(checkedGoodsCount);
            return checkedGoodsCount;
        },
        checkedAll: function () {
            let that = this;

            if (!this.data.isEditCart) {
                var productIds = this.data.cartGoods.map(function (v) {
                    return v.productId;
                });
                util.request(api.CartChecked, {
                    productIds: productIds,
                    isChecked: that.isCheckedAll() ? 0 : 1
                }, 'POST').then(function (res) {
                    if (res.errno === 0) {
                        console.log(res.data);
                        that.setData({
                            cartGoods: res.data.cartList,
                            cartTotal: res.data.cartTotal
                        });
                    }

                    that.setData({
                        checkedAllStatus: that.isCheckedAll()
                    });
                });
            } else {
                //编辑状态
                let checkedAllStatus = that.isCheckedAll();
                let tmpCartData = this.data.cartGoods.map(function (v) {
                    v.checked = !checkedAllStatus;
                    return v;
                });

                that.setData({
                    cartGoods: tmpCartData,
                    checkedAllStatus: that.isCheckedAll(),
                    'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
                });
            }

        },
        editCart: function () {
            var that = this;
            if (this.data.isEditCart) {
                this.getCartList();
                this.setData({
                    isEditCart: !this.data.isEditCart
                });
            } else {
                //编辑状态
                let tmpCartList = this.data.cartGoods.map(function (v) {
                    v.checked = false;
                    return v;
                });
                this.setData({
                    editCartList: this.data.cartGoods,
                    cartGoods: tmpCartList,
                    isEditCart: !this.data.isEditCart,
                    checkedAllStatus: that.isCheckedAll(),
                    'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
                });
            }

        },
        updateCart: function (productId, goodsId, number, id) {
            let that = this;

            util.request(api.CartUpdate, {
                productId: productId,
                goodsId: goodsId,
                number: number,
                id: id
            }, 'POST').then(function (res) {
                that.setData({
                    checkedAllStatus: that.isCheckedAll()
                });
            });

        },
        cutNumber: function (event) {

            let itemIndex = event.target.dataset.itemIndex;
            let cartItem = this.data.cartGoods[itemIndex];
            let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
            cartItem.number = number;
            this.setData({
                cartGoods: this.data.cartGoods
            });
            this.updateCart(cartItem.productId, cartItem.goodsId, number, cartItem.id);
        },
        addNumber: function (event) {
            let itemIndex = event.target.dataset.itemIndex;
            let cartItem = this.data.cartGoods[itemIndex];
            let number = cartItem.number + 1;
            cartItem.number = number;
            this.setData({
                cartGoods: this.data.cartGoods
            });
            this.updateCart(cartItem.productId, cartItem.goodsId, number, cartItem.id);

        },
        checkoutOrder: function () {
            //获取已选择的商品
            let that = this;

            var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
                if (element.checked == true) {
                    return true;
                } else {
                    return false;
                }
            });

            if (checkedGoods.length <= 0) {
                return false;
            }

            // storage中设置了cartId，则是购物车购买
            try {
                wx.setStorageSync('cartId', 0);
                wx.navigateTo({
                    url: '/pages/checkout/checkout'
                })
            } catch (e) {
            }

        },
        deleteCart: function () {
            //获取已选择的商品
            let that = this;

            let productIds = this.data.cartGoods.filter(function (element, index, array) {
                if (element.checked == true) {
                    return true;
                } else {
                    return false;
                }
            });

            if (productIds.length <= 0) {
                return false;
            }

            productIds = productIds.map(function (element, index, array) {
                if (element.checked == true) {
                    return element.productId;
                }
            });


            util.request(api.CartDelete, {
                productIds: productIds
            }, 'POST').then(function (res) {
                if (res.errno === 0) {
                    console.log(res.data);
                    let cartList = res.data.cartList.map(v => {
                        v.checked = false;
                        return v;
                    });

                    that.setData({
                        cartGoods: cartList,
                        cartTotal: res.data.cartTotal
                    });
                }

                that.setData({
                    checkedAllStatus: that.isCheckedAll()
                });
            });
        }
    });
    export default global['__wxComponents']['pages/cart/cart'];
</script>
<style>
    @import "./cart.css";
</style>
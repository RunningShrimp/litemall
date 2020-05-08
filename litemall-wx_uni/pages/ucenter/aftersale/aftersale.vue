<template>
    <view class="container">
        <view class="order-goods">
            <view class="h">退款商品</view>
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
                    </view>
                </view>
            </view>
        </view>

        <van-cell-group title="订单明细">
            <van-cell :value="'￥' + orderInfo.goodsPrice + '元'" title="商品总价"></van-cell>
            <van-cell :value="'￥' + orderInfo.freightPrice + '元'" title="运费"></van-cell>
            <van-cell :value="'-￥' + orderInfo.couponPrice + '元'" title="优惠"></van-cell>
            <van-cell :value="'￥' + orderInfo.actualPrice + '元'" title="订单实付"></van-cell>
        </van-cell-group>

        <van-cell-group title="操作">
            <van-field :value="aftersale.typeDesc" @tap="showTypePicker" clickable input-align="right" label="退款类型"
                       placeholder="请选择" required></van-field>
            <van-field :value="aftersale.reason" @change="onReasonChange" clearable input-align="right" label="退款原因"
                       placeholder="请输入" required></van-field>
            <van-cell :value="'￥' + aftersale.amount + '元'" label="不可修改，即订单实付- 运费" required title="退款金额"></van-cell>
            <van-field :value="aftersale.comment" autosize input-align="right" label="退款说明" placeholder="请输入"
                       type="textarea"></van-field>
            <van-cell label="最多上传三张" title="上传凭证">
                <van-uploader :file-list="fileList" @after-read="afterRead" @delete="deleteImage" max-count="3"
                              preview-size="50px"></van-uploader>
            </van-cell>
        </van-cell-group>

        <van-button @click="submit" block type="danger">申请售后</van-button>

        <van-popup :show="showPicker" position="bottom">
            <van-picker :columns="columns" @cancel="onCancel" @confirm="onConfirm" show-toolbar></van-picker>
        </van-popup>
    </view>
</template>


<script>

    global['__wxRoute'] = 'pages/ucenter/aftersale/aftersale';
    var util = require('../../../utils/util.js');
    var api = require('../../../config/api.js');

    Page({
        data: {
            orderId: 0,
            orderInfo: {},
            orderGoods: [],
            aftersale: {
                pictures: []
            },
            columns: ['未收货退款', '不退货退款', '退货退款'],
            contentLength: 0,
            fileList: []
        },
        onLoad: function (options) {
            // 页面初始化 options为页面跳转所带来的参数
            this.setData({
                orderId: options.id
            });
            this.getOrderDetail();
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
                        'aftersale.orderId': that.data.orderId,
                        'aftersale.amount': res.data.orderInfo.actualPrice - res.data.orderInfo.freightPrice
                    });
                }

                wx.hideLoading();
            });
        },
        deleteImage(event) {
            const {fileList = []} = this.data;
            fileList.splice(event.detail.index, 1);
            this.setData({
                fileList: fileList
            })
        },
        afterRead(event) {
            const {file} = event.detail;
            let that = this;
            const uploadTask = wx.uploadFile({
                url: api.StorageUpload,
                filePath: file.path,
                name: 'file',
                success: function (res) {
                    var _res = JSON.parse(res.data);
                    if (_res.errno === 0) {
                        var url = _res.data.url;
                        that.data.aftersale.pictures.push(url);
                        const {fileList = []} = that.data;
                        fileList.push({...file, url: url});
                        that.setData({
                            fileList: fileList
                        })
                    }
                },
                fail: function (e) {
                    wx.showModal({
                        title: '错误',
                        content: '上传失败',
                        showCancel: false
                    })
                },
            })
        },
        previewImage: function (e) {
            wx.previewImage({
                current: e.currentTarget.id, // 当前显示图片的http链接
                urls: this.data.files // 需要预览的图片http链接列表
            })
        },
        contentInput: function (e) {
            this.setData({
                contentLength: e.detail.cursor,
                'aftersale.comment': e.detail.value,
            });
        },
        onReasonChange: function (e) {
            this.setData({
                'aftersale.reason': e.detail,
            });
        },
        showTypePicker: function () {
            this.setData({
                showPicker: true,
            });
        },

        onCancel: function () {
            this.setData({
                showPicker: false,
            });
        },
        onConfirm: function (event) {
            this.setData({
                'aftersale.type': event.detail.index,
                'aftersale.typeDesc': event.detail.value,
                showPicker: false,
            });
        },
        submit: function () {
            let that = this;
            if (that.data.aftersale.type == undefined) {
                util.showErrorToast('请选择退款类型');
                return false;
            }

            if (that.data.reason == '') {
                util.showErrorToast('请输入退款原因');
                return false;
            }

            wx.showLoading({
                title: '提交中...',
                mask: true,
                success: function () {

                }
            });

            util.request(api.AftersaleSubmit, that.data.aftersale, 'POST').then(function (res) {
                wx.hideLoading();

                if (res.errno === 0) {
                    wx.showToast({
                        title: '申请售后成功',
                        icon: 'success',
                        duration: 2000,
                        complete: function () {
                            wx.switchTab({
                                url: '/pages/ucenter/index/index'
                            });
                        }
                    });
                } else {
                    util.showErrorToast(res.errmsg);
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
    export default global['__wxComponents']['pages/ucenter/aftersale/aftersale'];
</script>
<style>
    @import "./aftersale.css";
</style>
<template>
<view class="container">
  <van-cell-group title="退款明细">
    <van-cell :value="statusColumns[aftersale.status]" required title="售后状态"></van-cell>
    <van-cell :value="aftersale.addTime" required title="申请时间"></van-cell>
    <van-cell :value="aftersale.aftersaleSn" required title="服务编号"></van-cell>
    <van-cell :value="typeColumns[aftersale.type]" required title="退款类型"></van-cell>
    <van-cell :value="aftersale.reason" required title="退款原因"></van-cell>
    <van-cell :value="'￥' + aftersale.amount + '元'" label="即订单实付- 运费" required title="退款金额"></van-cell>
    <van-field :value="aftersale.comment" autosize disabled label="退款说明" type="textarea"></van-field>
    <van-cell title="上传凭证">
      <van-uploader :file-list="fileList" deletable="false" disabled max-count="0" preview-size="50px"></van-uploader>
    </van-cell>
  </van-cell-group>

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
    <van-cell :value="'￥' + order.goodsPrice + '元'" title="商品总价"></van-cell>
    <van-cell :value="'￥' + order.freightPrice + '元'" title="运费"></van-cell>
    <van-cell :value="'-￥' + order.couponPrice + '元'" title="优惠"></van-cell>
    <van-cell :value="'￥' + order.actualPrice + '元'" title="订单实付"></van-cell>
  </van-cell-group>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/ucenter/aftersaleDetail/aftersaleDetail';
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    order: {},
    orderGoods: [],
    aftersale: {},
    statusColumns: ['未申请', '已申请，待审核', '审核通过，待退款', '退款成功', '审核不通过，已拒绝'],
    typeColumns: ['未收货退款', '不退货退款', '退货退款'],
    fileList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getAftersaleDetail();
  },
  getAftersaleDetail: function () {
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function () {
      wx.hideLoading()
    }, 2000);

    let that = this;
    util.request(api.AftersaleDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      if (res.errno === 0) {
        let _fileList = []
        res.data.aftersale.pictures.forEach(function (v) {
          _fileList.push({
            url: v
          })
        });

        that.setData({
          order: res.data.order,
          orderGoods: res.data.orderGoods,
          aftersale: res.data.aftersale,
          fileList: _fileList
        });
      }

      wx.hideLoading();
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
})
export default global['__wxComponents']['pages/ucenter/aftersaleDetail/aftersaleDetail'];
</script>
<style>
@import "./aftersaleDetail.css";
</style>
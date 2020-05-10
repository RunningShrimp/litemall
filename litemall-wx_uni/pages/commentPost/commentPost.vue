<template>
<view class="container">
  <view class="post-comment">
    <view class="goods">
      <view class="img">
        <image :src="orderGoods.picUrl"></image>
      </view>
      <view class="info">
        <view class="t">
          <text class="name">{{orderGoods.goodsName}} x{{orderGoods.number}}</text>
        </view>
        <view class="attr">{{orderGoods.goodsSpecificationValues}}</view>
      </view>
    </view>
    <view class="rater">
      <text class="rater-title">评分</text>
      <block :key="index" v-for="(item, index) in stars">
        <van-icon :data-star="item" @tap="selectRater" color="#ab956d" name="star" v-if="item < star"></van-icon>
        <van-icon :data-star="item" @tap="selectRater" name="star-o" v-else></van-icon>
      </block>
      <text class="rater-desc">{{starText}}</text>
    </view>
    <view class="input-box">
      <textarea @input="bindInputValue" class="content" focus="true" maxlength="140" placeholder="留言经过筛选后，对所有人可见"></textarea>
      <text class="count">{{140 - content.length}}</text>
    </view>

    <view class="weui-uploader">
      <view class="weui-uploader__hd">
        <view class="weui-uploader__title">图片上传</view>
        <view class="weui-uploader__info">{{picUrls.length}}/{{files.length}}</view>
      </view>
      <view class="weui-uploader__bd">
        <view class="weui-uploader__files" id="uploaderFiles">
          <block :key="index" v-for="(item, index) in files">
            <view :id="item" @tap="previewImage" class="weui-uploader__file">
              <image :src="item" class="weui-uploader__img" mode="aspectFill"></image>
            </view>
            <!-- <view class="weui-uploader__file weui-uploader__file_status" bindtap="previewImage" id="{{item}}">
              <image class="weui-uploader__img" src="{{item}}" mode="aspectFill" />
              <view class="weui-uploader__file-content">50%</view>
            </view> -->
          </block>
          <view class="weui-uploader__input-box">
            <view @tap="chooseImage" class="weui-uploader__input"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="btns">
      <view @tap="onClose" class="close">取消</view>
      <view @tap="onPost" class="post">发表</view>
    </view>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/commentPost/commentPost';
// 上传组件 基于https://github.com/Tencent/weui-wxss/tree/master/src/example/uploader
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({
  data: {
    orderId: 0,
    type: 0,
    valueId: 0,
    orderGoods: {},
    content: '',
    stars: [0, 1, 2, 3, 4],
    star: 5,
    starText: '十分满意',
    hasPicture: false,
    picUrls: [],
    files: []
  },
  chooseImage: function(e) {
    if (this.data.files.length >= 5) {
      util.showErrorToast('只能上传五张图片')
      return false;
    }

    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        that.upload(res);
      }
    })
  },
  upload: function(res) {
    var that = this;
    const uploadTask = wx.uploadFile({
      url: api.StorageUpload,
      filePath: res.tempFilePaths[0],
      name: 'file',
      success: function(res) {
        var _res = JSON.parse(res.data);
        if (_res.errno === 0) {
          var url = _res.data.url
          that.data.picUrls.push(url)
          that.setData({
            hasPicture: true,
            picUrls: that.data.picUrls
          })
        }
      },
      fail: function(e) {
        wx.showModal({
          title: '错误',
          content: '上传失败',
          showCancel: false
        })
      },
    })

    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectRater: function(e) {
    var star = e.currentTarget.dataset.star + 1;
    var starText;
    if (star == 1) {
      starText = '很差';
    } else if (star == 2) {
      starText = '不太满意';
    } else if (star == 3) {
      starText = '满意';
    } else if (star == 4) {
      starText = '比较满意';
    } else {
      starText = '十分满意'
    }
    this.setData({
      star: star,
      starText: starText
    })

  },
  onLoad: function(options) {
    var that = this;
    that.setData({
      orderId: options.orderId,
      type: options.type,
      valueId: options.valueId
    });
    this.getOrderGoods();
  },
  getOrderGoods: function() {
    let that = this;
    util.request(api.OrderGoods, {
      orderId: that.data.orderId,
      goodsId: that.data.valueId
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          orderGoods: res.data,
        });
      }
    });
  },
  onClose: function() {
    wx.navigateBack();
  },
  onPost: function() {
    let that = this;

    if (!this.data.content) {
      util.showErrorToast('请填写评论')
      return false;
    }

    util.request(api.OrderComment, {
      orderGoodsId: that.data.orderGoods.id,
      content: that.data.content,
      star: that.data.star,
      hasPicture: that.data.hasPicture,
      picUrls: that.data.picUrls
    }, 'POST').then(function(res) {
      if (res.errno === 0) {
        wx.showToast({
          title: '评论成功',
          complete: function() {
            wx.switchTab({
              url: '/pages/ucenter/index/index'
            })
          }
        })
      }
    });
  },
  bindInputValue(event) {

    let value = event.detail.value;

    //判断是否超过140个字符
    if (value && value.length > 140) {
      return false;
    }

    this.setData({
      content: event.detail.value,
    })
  },
  onReady: function() {

  },
  onShow: function() {
    // 页面显示

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  }
})
export default global['__wxComponents']['pages/commentPost/commentPost'];
</script>
<style>
@import "./commentPost.css";
</style>
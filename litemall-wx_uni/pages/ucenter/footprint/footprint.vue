<template>
<view class="container">
  <view class="no-footprint" v-if="footprintList.length <= 0">
    <view class="c">
      <text>没有浏览足迹</text>
    </view>
  </view>
  <view class="footprint" v-if="footprintList.length > 0">
    <view :key="index" class="day-item" v-for="(item, index) in footprintList">
      <view class="day-hd" v-if="item.length > 0">{{item[0].addDate}}</view>
      <view class="day-list" v-if="item.length > 0">
        <view :data-iindex="iindex" :data-index="index" :key="iindex" @tap="deleteItem" @touchend="touchEnd" @touchstart="touchStart" class="item" v-for="(iitem, iindex) in item">
          <image :src="iitem.picUrl" class="img"></image>
          <view class="info">
            <view class="name">{{iitem.name}}</view>
            <view class="subtitle">{{iitem.brief}}</view>
            <view class="price">￥{{iitem.retailPrice}}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'pages/ucenter/footprint/footprint';
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();

Page({
  data: {
    footprintList: [],
    page: 1,
    limit: 10,
    totalPages: 1
  },
  getFootprintList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.FootprintList, {
      page: that.data.page,
      limit: that.data.limit
    }).then(function(res) {
      if (res.errno === 0) {
        let f1 = that.data.footprintList;
        let f2 = res.data.list;
        for (let i = 0; i < f2.length; i++) {
          f2[i].addDate = f2[i].addTime.substring(0, 10)
          let last = f1.length - 1;
          if (last >= 0 && f1[last][0].addDate === f2[i].addDate) {
            f1[last].push(f2[i]);
          } else {
            let tmp = [];
            tmp.push(f2[i])
            f1.push(tmp);
          }
        }

        that.setData({
          footprintList: f1,
          totalPages: res.data.pages
        });
      }
      wx.hideLoading();
    });
  },
  deleteItem(event) {
    let that = this;
    let index = event.currentTarget.dataset.index;
    let iindex = event.currentTarget.dataset.iindex;
    let footprintId = this.data.footprintList[index][iindex].id;
    let goodsId = this.data.footprintList[index][iindex].goodsId;
    var touchTime = that.data.touchEnd - that.data.touchStart;
    console.log(touchTime);
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '要删除所选足迹？',
        success: function(res) {
          if (res.confirm) {
            util.request(api.FootprintDelete, {
              id: footprintId
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.data.footprintList[index].splice(iindex, 1)
                if (that.data.footprintList[index].length == 0) {
                  that.data.footprintList.splice(index, 1)
                }
                that.setData({
                  footprintList: that.data.footprintList
                });
              }
            });
          }
        }
      });
    } else {
      wx.navigateTo({
        url: '/pages/goods/goods?id=' + goodsId,
      });
    }

  },
  onLoad: function(options) {
    this.getFootprintList();
  },
  onReachBottom() {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
      this.getFootprintList();
    } else {
      wx.showToast({
        title: '没有更多用户足迹了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  },
  onReady: function() {

  },
  onShow: function() {

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭
  },
  //按下事件开始  
  touchStart: function(e) {
    let that = this;
    that.setData({
      touchStart: e.timeStamp
    })
    console.log(e.timeStamp + '- touchStart')
  },
  //按下事件结束  
  touchEnd: function(e) {
    let that = this;
    that.setData({
      touchEnd: e.timeStamp
    })
    console.log(e.timeStamp + '- touchEnd')
  },
})
export default global['__wxComponents']['pages/ucenter/footprint/footprint'];
</script>
<style>
@import "./footprint.css";
</style>
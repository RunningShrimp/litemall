<template>
<view :class="( utils.bem('nav-bar', { fixed }) ) + ' custom-class ' + ( border ? 'van-hairline--bottom' : '' )" :style="'z-index: ' + zIndex + '; padding-top: ' + ( safeAreaInsetTop ? statusBarHeight : 0 ) + 'px;'">
  <view @tap="onClickLeft" class="van-nav-bar__left">
    <block v-if="leftArrow || leftText">
      <van-icon custom-class="van-nav-bar__arrow" name="arrow-left" size="16px" v-if="leftArrow"></van-icon>
      <view class="van-nav-bar__text" hover-class="van-nav-bar__text--hover" hover-stay-time="70" v-if="leftText">{{ leftText }}</view>
    </block>
    <slot name="left" v-else></slot>
  </view>
  <view class="van-nav-bar__title title-class van-ellipsis">
    <block v-if="title">{{ title }}</block>
    <slot name="title" v-else></slot>
  </view>
  <view @tap="onClickRight" class="van-nav-bar__right">
    <view class="van-nav-bar__text" hover-class="van-nav-bar__text--hover" hover-stay-time="70" v-if="rightText">{{ rightText }}</view>
    <slot name="right" v-else></slot>
  </view>
</view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/nav-bar/index';
import {VantComponent} from '../common/component';

VantComponent({
    classes: ['title-class'],
    props: {
        title: String,
        fixed: Boolean,
        leftText: String,
        rightText: String,
        leftArrow: Boolean,
        border: {
            type: Boolean,
            value: true
        },
        zIndex: {
            type: Number,
            value: 1
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: true
        },
    },
    data: {
        statusBarHeight: 0
    },
    created() {
        const { statusBarHeight } = wx.getSystemInfoSync();
        this.setData({ statusBarHeight });
    },
    methods: {
        onClickLeft() {
            this.$emit('click-left');
        },
        onClickRight() {
            this.$emit('click-right');
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/nav-bar/index'];
</script>
<style>
@import "./index.css";
</style>
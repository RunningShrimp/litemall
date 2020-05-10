<template>
<view class="van-panel van-hairline--top-bottom custom-class">
  <van-cell :label="desc" :title="title" :value="status" custom-class="header-class" v-if="title || desc || status" value-class="van-panel__header-value"></van-cell>
  <slot name="header" v-else></slot>

  <view class="van-panel__content">
    <slot></slot>
  </view>

  <view class="van-panel__footer van-hairline--top footer-class" v-if="useFooterSlot">
    <slot name="footer"></slot>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'lib/vant-weapp/panel/index';
import {VantComponent} from '../common/component';

VantComponent({
    classes: ['header-class', 'footer-class'],
    props: {
        desc: String,
        title: String,
        status: String,
        useFooterSlot: Boolean
    }
});

export default global['__wxComponents']['lib/vant-weapp/panel/index'];
</script>
<style>
@import "./index.css";
</style>
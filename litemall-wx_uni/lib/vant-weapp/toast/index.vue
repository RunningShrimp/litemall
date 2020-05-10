<template>
<view>
<van-overlay :custom-style="mask ? '' : 'background-color: transparent;'" :show="show" :z-index="zIndex" v-if="mask || forbidClick"></van-overlay>
<van-transition :custom-style="'z-index: ' + zIndex" :show="show" custom-class="van-toast__container">
  <view :class="'van-toast van-toast--' + ( type === 'text' ? 'text' : 'icon' ) + ' van-toast--' + position" catch:touchmove="noop">
    <!-- text only -->
    <text v-if="type === 'text'">{{ message }}</text>

    <!-- with icon -->
    <block v-else>
      <van-loading :type="loadingType" color="white" custom-class="van-toast__loading" v-if="type === 'loading'"></van-loading>
      <van-icon :name="type" class="van-toast__icon" v-else></van-icon>
      <text class="van-toast__text" v-if="message">{{ message }}</text>
    </block>

    <slot></slot>
  </view>
</van-transition>
</view>
</template>


<script>

global['__wxRoute'] = 'lib/vant-weapp/toast/index';
import {VantComponent} from '../common/component';

VantComponent({
    props: {
        show: Boolean,
        mask: Boolean,
        message: String,
        forbidClick: Boolean,
        zIndex: {
            type: Number,
            value: 1000
        },
        type: {
            type: String,
            value: 'text'
        },
        loadingType: {
            type: String,
            value: 'circular'
        },
        position: {
            type: String,
            value: 'middle'
        }
    },
    methods: {
        // for prevent touchmove
        noop() { }
    }
});

export default global['__wxComponents']['lib/vant-weapp/toast/index'];
</script>
<style>
@import "./index.css";
</style>
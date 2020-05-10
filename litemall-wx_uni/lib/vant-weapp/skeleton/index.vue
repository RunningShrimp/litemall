<template>
<view>
<view :class="'custom-class ' + utils.bem('skeleton', [{animate}])" v-if="loading">
  <view :class="utils.bem('skeleton__avatar', [avatarShape])" :style="'width:' + avatarSize + ';height:' + avatarSize" v-if="avatar"></view>
  <view :class="utils.bem('skeleton__content')">
    <view :class="utils.bem('skeleton__title')" :style="'width:' + titleWidth" v-if="title"></view>
    <view :class="utils.bem('skeleton__row')" :key="index" :style="'width:' + (isArray ? rowWidth[index] : rowWidth)" v-for="(item, index) in row"></view>
  </view>
</view>
<view :class="utils.bem('skeleton__content')" v-else>
  <slot></slot>
</view>
</view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/skeleton/index';
import {VantComponent} from '../common/component';

VantComponent({
    props: {
        row: {
            type: Number,
            value: 0
        },
        title: Boolean,
        avatar: Boolean,
        loading: {
            type: Boolean,
            value: true
        },
        animate: {
            type: Boolean,
            value: true
        },
        avatarSize: {
            type: String,
            value: '32px'
        },
        avatarShape: {
            type: String,
            value: 'round'
        },
        titleWidth: {
            type: String,
            value: '40%'
        },
        rowWidth: {
            type: null,
            value: '100%',
            observer(val) {
                this.setData({ isArray: val instanceof Array });
            }
        }
    },
    data: {
        isArray: false
    }
});

export default global['__wxComponents']['lib/vant-weapp/skeleton/index'];
</script>
<style>
@import "./index.css";
</style>
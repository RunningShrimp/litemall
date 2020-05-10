<template>
<view>
<view class="van-cell-group__title" v-if="title">{{ title }}</view>
<view :class="'custom-class van-cell-group ' + ( border ? 'van-hairline--top-bottom' : '' )">
  <slot></slot>
</view>
</view>
</template>


<script>

global['__wxRoute'] = 'lib/vant-weapp/cell-group/index';
import {VantComponent} from '../common/component';

VantComponent({
    props: {
        title: String,
        border: {
            type: Boolean,
            value: true
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/cell-group/index'];
</script>
<style>
@import "./index.css";
</style>
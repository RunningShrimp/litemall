<template>
<view :style="wrapperStyle" class="van-index-anchor-wrapper">
  <view :class="'van-index-anchor ' + ( active ? 'van-index-anchor--active van-hairline--bottom' : '' )" :style="anchorStyle">
    <slot v-if="useSlot"></slot>
    <block v-else>
      <text>{{ index }}</text>
    </block>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'lib/vant-weapp/index-anchor/index';
import {VantComponent} from '../common/component';

VantComponent({
    relation: {
        name: 'index-bar',
        type: 'ancestor',
        linked(target) {
            this.parent = target;
        },
        unlinked() {
            this.parent = null;
        }
    },
    props: {
        useSlot: Boolean,
        index: null
    },
    data: {
        active: false,
        wrapperStyle: '',
        anchorStyle: ''
    }
});

export default global['__wxComponents']['lib/vant-weapp/index-anchor/index'];
</script>
<style>
@import "./index.css";
</style>
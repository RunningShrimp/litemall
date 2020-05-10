<template>
<view :class="'custom-class ' + ( utils.bem('goods-action', { safe: safeAreaInsetBottom }) )">
  <slot></slot>
</view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/goods-action/index';
import {VantComponent} from '../common/component';

VantComponent({
    relation: {
        type: 'descendant',
        name: 'goods-action-button',
        linked(child) {
            this.children.push(child);
        },
        unlinked(child) {
            this.children = this.children.filter((item) => item !== child);
        }
    },
    beforeCreate() {
        this.children = [];
    },
    props: {
        safeAreaInsetBottom: {
            type: Boolean,
            value: true
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/goods-action/index'];
</script>
<style>
@import "./index.css";
</style>
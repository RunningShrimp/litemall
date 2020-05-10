<template>
<view :class="'custom-class ' + utils.bem('tag', [type, size, { mark, plain, round }]) + ' ' + ( plain ? 'van-hairline--surround' : '' )" :style="( color && !plain ? 'background-color: ' + color + ';' : '' ) + '' + ( textColor || (color && plain) ? 'color: ' + (textColor || color) : '' )">
  <slot></slot>
  <van-icon @click="onClose" custom-class="van-tag__close" name="cross" v-if="closeable"></van-icon>
</view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/tag/index';
import {VantComponent} from '../common/component';

VantComponent({
    props: {
        size: String,
        mark: Boolean,
        color: String,
        plain: Boolean,
        round: Boolean,
        textColor: String,
        type: {
            type: String,
            value: 'default'
        },
        closeable: Boolean
    },
    methods: {
        onClose() {
            this.$emit('close');
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/tag/index'];
</script>
<style>
@import "./index.css";
</style>
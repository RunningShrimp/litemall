<template>
<view :class="'custom-class ' + classPrefix + ' ' + ( isImageName ? 'van-icon--image' : classPrefix + '-' + name )" :style="( color ? 'color: ' + color + ';' : '' ) + '' + ( size ? 'font-size: ' + sizeWithUnit + ';' : '' ) + '' + customStyle" @tap="onClick">
  <van-info :dot="dot" :info="info" custom-class="van-icon__info" v-if="info !== null || dot"></van-info>
  <image :src="name" class="van-icon__image" mode="aspectFit" v-if="isImageName"></image>
</view>
</template>


<script>

global['__wxRoute'] = 'lib/vant-weapp/icon/index';
import {VantComponent} from '../common/component';
import {addUnit} from '../common/utils';

VantComponent({
    props: {
        dot: Boolean,
        info: null,
        size: {
            type: null,
            observer: 'setSizeWithUnit'
        },
        color: String,
        customStyle: String,
        classPrefix: {
            type: String,
            value: 'van-icon'
        },
        name: {
            type: String,
            observer(val) {
                this.setData({
                    isImageName: val.indexOf('/') !== -1
                });
            }
        }
    },
    data: {
        sizeWithUnit: null,
    },
    methods: {
        onClick() {
            this.$emit('click');
        },
        setSizeWithUnit(size) {
            this.setData({
                sizeWithUnit: addUnit(size)
            });
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/icon/index'];
</script>
<style>
@import "./index.css";
</style>
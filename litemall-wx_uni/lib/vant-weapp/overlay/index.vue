<template>
<van-transition :custom-style="'z-index: ' + zIndex + '; ' + customStyle" :duration="duration" :show="show" @tap="onClick" catch:touchmove="noop" custom-class="van-overlay">
  <slot></slot>
</van-transition>
</template>


<script>

global['__wxRoute'] = 'lib/vant-weapp/overlay/index';
import {VantComponent} from '../common/component';

VantComponent({
    props: {
        show: Boolean,
        customStyle: String,
        duration: {
            type: null,
            value: 300
        },
        zIndex: {
            type: Number,
            value: 1
        }
    },
    methods: {
        onClick() {
            this.$emit('click');
        },
        // for prevent touchmove
        noop() { }
    }
});

export default global['__wxComponents']['lib/vant-weapp/overlay/index'];
</script>
<style>
@import "./index.css";
</style>
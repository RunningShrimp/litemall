<template>
<uni-shadow-root class="vant-overlay-index"><van-transition :custom-style="'z-index: '+(zIndex)+'; '+(customStyle)" :duration="duration" :show="show" @click.native="onClick" @touchmove.native.stop.prevent="noop" custom-class="van-overlay">
  <slot></slot>
</van-transition></uni-shadow-root>
</template>

<script>
    import VanTransition from '../transition/index.vue'
    import {VantComponent} from '../common/component';

    global['__wxVueOptions'] = {components:{'van-transition': VanTransition}}

global['__wxRoute'] = 'vant/overlay/index'
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
export default global['__wxComponents']['vant/overlay/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.7);background-color:var(--overlay-background-color,rgba(0,0,0,.7))}
</style>
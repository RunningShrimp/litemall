<template>
    <view :class="'van-transition custom-class ' + classes"
          :style="'-webkit-transition-duration:' + currentDuration + 'ms; transition-duration:' + currentDuration + 'ms; ' + ( display ? '' : 'display: none;' ) + ' ' + customStyle"
          @transitionend="onTransitionEnd" v-if="inited">
        <slot></slot>
    </view>
</template>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/transition/index';
    import {VantComponent} from '../common/component';
    import {transition} from '../mixins/transition';

    VantComponent({
        classes: [
            'enter-class',
            'enter-active-class',
            'enter-to-class',
            'leave-class',
            'leave-active-class',
            'leave-to-class'
        ],
        mixins: [transition(true)]
    });

    export default global['__wxComponents']['lib/vant-weapp/transition/index'];
</script>
<style>
    @import "./index.css";
</style>
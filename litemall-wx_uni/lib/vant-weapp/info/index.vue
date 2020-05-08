<template>
    <view :class="'custom-class van-info ' + utils.bem('info', { dot })" :style="customStyle"
          v-if="info !== null && info !== '' || dot">{{ dot ? '' : info }}
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/info/index';
    import {VantComponent} from '../common/component';

    VantComponent({
        props: {
            dot: Boolean,
            info: null,
            customStyle: String
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/info/index'];
</script>
<style>
    @import "./index.css";
</style>
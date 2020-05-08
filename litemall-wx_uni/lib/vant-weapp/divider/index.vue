<template>
    <view :class="'custom-class ' + utils.bem('divider', [{dashed, hairline}, contentPosition])"
          :style="( borderColor  ? 'border-color: ' + borderColor + ';' : '' ) + '' + ( textColor ? 'color: ' + textColor + ';' : '' ) + ' ' + ( fontSize ? 'font-size: ' + fontSize + 'px;' : '' ) + ' ' + customStyle">
        <slot></slot>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/divider/index';
    import {VantComponent} from '../common/component';

    VantComponent({
        props: {
            dashed: {
                type: Boolean,
                value: false
            },
            hairline: {
                type: Boolean,
                value: false
            },
            contentPosition: {
                type: String,
                value: ''
            },
            fontSize: {
                type: Number,
                value: ''
            },
            borderColor: {
                type: String,
                value: ''
            },
            textColor: {
                type: String,
                value: ''
            },
            customStyle: {
                type: String,
                value: ''
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/divider/index'];
</script>
<style>
    @import "./index.css";
</style>
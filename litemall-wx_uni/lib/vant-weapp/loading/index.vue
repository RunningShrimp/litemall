<template>
    <view :class="'custom-class van-loading ' + ( vertical ? 'van-loading--vertical' : '' )">
        <view :class="'van-loading__spinner van-loading__spinner--' + type"
              :style="'color: ' + color + '; width: ' + sizeWithUnit + '; height: ' + sizeWithUnit">
            <view :key="index" class="van-loading__dot" v-for="(item, index) in 12" v-if="type === 'spinner'"></view>
        </view>
        <view :style="'font-size: ' + textSizeWithUnit + ';'" class="van-loading__text">
            <slot></slot>
        </view>
    </view>
</template>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/loading/index';
    import {VantComponent} from '../common/component';
    import {addUnit} from '../common/utils';

    VantComponent({
        props: {
            color: String,
            vertical: Boolean,
            type: {
                type: String,
                value: 'circular'
            },
            size: {
                type: String,
                observer: 'setSizeWithUnit'
            },
            textSize: {
                type: String,
                observer: 'setTextSizeWithUnit'
            }
        },
        methods: {
            setSizeWithUnit(size) {
                this.setData({
                    sizeWithUnit: addUnit(size)
                });
            },
            setTextSizeWithUnit(size) {
                this.set({
                    textSizeWithUnit: addUnit(size)
                });
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/loading/index'];
</script>
<style>
    @import "./index.css";
</style>
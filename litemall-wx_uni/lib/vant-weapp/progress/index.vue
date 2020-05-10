<template>
<view :style="'height: ' + strokeWidthUnit + '; ' + ( trackColor ? 'background: ' + trackColor : '' )" class="van-progress custom-class">
  <view :style="'width: ' + percentage + '%; background: ' + ( inactive ? '#cacaca' : color )" class="van-progress__portion">
    <view :style="'color: ' + textColor + '; background: ' + ( pivotColor ? pivotColor : inactive ? '#cacaca' : color )" class="van-progress__pivot" v-if="showPivot && getters.text(pivotText, percentage)">{{ getters.text(pivotText, percentage) }}</view>
  </view>
</view>
</template>

<script lang="wxs" module="getters" src="./index.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/progress/index';
import {VantComponent} from '../common/component';
import {BLUE} from '../common/color';
import {addUnit} from '../common/utils';

VantComponent({
    props: {
        inactive: Boolean,
        percentage: Number,
        pivotText: String,
        pivotColor: String,
        trackColor: String,
        showPivot: {
            type: Boolean,
            value: true
        },
        color: {
            type: String,
            value: BLUE
        },
        textColor: {
            type: String,
            value: '#fff'
        },
        strokeWidth: {
            type: null,
            observer: 'setStrokeWidthUnit'
        }
    },
    data: {
        strokeWidthUnit: '4px'
    },
    methods: {
        setStrokeWidthUnit(val) {
            this.setData({
                strokeWidthUnit: addUnit(val)
            });
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/progress/index'];
</script>
<style>
@import "./index.css";
</style>
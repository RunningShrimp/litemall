<template>
    <view :class="'custom-class ' + utils.bem('steps', [direction])">
        <view class="van-step__wrapper">
            <view :class="utils.bem('step', [direction, status(index, active)]) + ' van-hairline'" :key="index"
                  v-for="(item, index) in steps">
                <view :style="index === active ? 'color: ' + activeColor : ''" class="van-step__title">
                    <view>{{ item.text }}</view>
                    <view>{{ item.desc }}</view>
                </view>
                <view class="van-step__circle-container">
                    <block v-if="index !== active">
                        <van-icon :name="inactiveIcon" color="#969799" custom-class="van-step__icon"
                                  v-if="inactiveIcon"></van-icon>
                        <view :style="index < active ? 'background-color: ' + activeColor : ''" class="van-step__circle"
                              v-else></view>
                    </block>

                    <van-icon :color="activeColor" :name="activeIcon" custom-class="van-step__icon" v-else></van-icon>
                </view>
                <view :style="index < active ? 'background-color: ' + activeColor : ''" class="van-step__line"
                      v-if="index !== steps.length - 1"></view>
            </view>
        </view>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>
<script lang="wxs" module="status" src="./status.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/steps/index';
    import {VantComponent} from '../common/component';
    import {GREEN} from '../common/color';

    VantComponent({
        props: {
            icon: String,
            steps: Array,
            active: Number,
            direction: {
                type: String,
                value: 'horizontal'
            },
            activeColor: {
                type: String,
                value: GREEN
            },
            activeIcon: {
                type: String,
                value: 'checked'
            },
            inactiveIcon: String
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/steps/index'];
</script>
<style>
    @import "./index.css";
</style>
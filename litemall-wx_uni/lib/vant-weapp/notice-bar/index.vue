<template>
<view :class="'custom-class ' + ( utils.bem('notice-bar', { withicon: mode, wrapable }) )" :style="'color: ' + color + '; background-color: ' + backgroundColor + ';'" @tap="onClick" v-if="show">
  <van-icon :name="leftIcon" class="van-notice-bar__left-icon" size="16px" v-if="leftIcon"></van-icon>
  <slot name="left-icon" v-else></slot>

  <view class="van-notice-bar__wrap">
    <view :animation="animationData" :class="'van-notice-bar__content ' + ( !scrollable && !wrapable ? 'van-ellipsis' : '' )">{{ text }}</view>
  </view>

  <van-icon @tap.stop="onClickIcon" class="van-notice-bar__right-icon" name="cross" v-if="mode === 'closeable'"></van-icon>
  <navigator :open-type="openType" :url="url" v-else-if="mode === 'link'">
    <van-icon class="van-notice-bar__right-icon" name="arrow"></van-icon>
  </navigator>
  <slot name="right-icon" v-else></slot>
</view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/notice-bar/index';
import {VantComponent} from '../common/component';

const FONT_COLOR = '#ed6a0c';
const BG_COLOR = '#fffbe8';
VantComponent({
    props: {
        text: {
            type: String,
            value: ''
        },
        mode: {
            type: String,
            value: ''
        },
        url: {
            type: String,
            value: ''
        },
        openType: {
            type: String,
            value: 'navigate'
        },
        delay: {
            type: Number,
            value: 1
        },
        speed: {
            type: Number,
            value: 50
        },
        scrollable: {
            type: Boolean,
            value: true
        },
        leftIcon: {
            type: String,
            value: ''
        },
        color: {
            type: String,
            value: FONT_COLOR
        },
        backgroundColor: {
            type: String,
            value: BG_COLOR
        },
        wrapable: Boolean
    },
    data: {
        show: true
    },
    watch: {
        text() {
            this.setData({}, this.init);
        }
    },
    created() {
        this.resetAnimation = wx.createAnimation({
            duration: 0,
            timingFunction: 'linear'
        });
    },
    destroyed() {
        this.timer && clearTimeout(this.timer);
    },
    methods: {
        init() {
            Promise.all([
                this.getRect('.van-notice-bar__content'),
                this.getRect('.van-notice-bar__wrap')
            ]).then((rects) => {
                const [contentRect, wrapRect] = rects;
                if (contentRect == null ||
                    wrapRect == null ||
                    !contentRect.width ||
                    !wrapRect.width) {
                    return;
                }
                const { speed, scrollable, delay } = this.data;
                if (scrollable && wrapRect.width < contentRect.width) {
                    const duration = (contentRect.width / speed) * 1000;
                    this.wrapWidth = wrapRect.width;
                    this.contentWidth = contentRect.width;
                    this.duration = duration;
                    this.animation = wx.createAnimation({
                        duration,
                        timingFunction: 'linear',
                        delay
                    });
                    this.scroll();
                }
            });
        },
        scroll() {
            this.timer && clearTimeout(this.timer);
            this.timer = null;
            this.setData({
                animationData: this.resetAnimation
                    .translateX(this.wrapWidth)
                    .step()
                    .export()
            });
            setTimeout(() => {
                this.setData({
                    animationData: this.animation
                        .translateX(-this.contentWidth)
                        .step()
                        .export()
                });
            }, 20);
            this.timer = setTimeout(() => {
                this.scroll();
            }, this.duration);
        },
        onClickIcon() {
            this.timer && clearTimeout(this.timer);
            this.timer = null;
            this.setData({ show: false });
        },
        onClick(event) {
            this.$emit('click', event);
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/notice-bar/index'];
</script>
<style>
@import "./index.css";
</style>
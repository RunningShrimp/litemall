<template>
<view :catchtouchmove="catchMove ? 'noop' : ''" @tap.stop="onClick" @touchcancel="endDrag" @touchend="endDrag" @touchstart="startDrag" capture-bind:touchmove="onDrag" class="van-swipe-cell" data-key="cell">
  <view :style="wrapperStyle">
    <view @tap.stop="onClick" class="van-swipe-cell__left" data-key="left" v-if="leftWidth">
      <slot name="left"></slot>
    </view>
    <slot></slot>
    <view @tap.stop="onClick" class="van-swipe-cell__right" data-key="right" v-if="rightWidth">
      <slot name="right"></slot>
    </view>
  </view>
</view>
</template>


<script>

global['__wxRoute'] = 'lib/vant-weapp/swipe-cell/index';
import {VantComponent} from '../common/component';
import {touch} from '../mixins/touch';
import {range} from '../common/utils';

const THRESHOLD = 0.3;
let ARRAY = [];
VantComponent({
    props: {
        disabled: Boolean,
        leftWidth: {
            type: Number,
            value: 0
        },
        rightWidth: {
            type: Number,
            value: 0
        },
        asyncClose: Boolean,
        name: {
            type: [Number, String],
            value: ''
        }
    },
    mixins: [touch],
    data: {
        catchMove: false
    },
    created() {
        this.offset = 0;
        ARRAY.push(this);
    },
    destroyed() {
        ARRAY = ARRAY.filter(item => item !== this);
    },
    methods: {
        open(position) {
            const { leftWidth, rightWidth } = this.data;
            const offset = position === 'left' ? leftWidth : -rightWidth;
            this.swipeMove(offset);
            this.$emit('open', {
                position,
                name: this.data.name
            });
        },
        close() {
            this.swipeMove(0);
        },
        swipeMove(offset = 0) {
            this.offset = range(offset, -this.data.rightWidth, this.data.leftWidth);
            const transform = `translate3d(${this.offset}px, 0, 0)`;
            const transition = this.dragging
                ? 'none'
                : 'transform .6s cubic-bezier(0.18, 0.89, 0.32, 1)';
            this.setData({
                wrapperStyle: `
        -webkit-transform: ${transform};
        -webkit-transition: ${transition};
        transform: ${transform};
        transition: ${transition};
      `
            });
        },
        swipeLeaveTransition() {
            const { leftWidth, rightWidth } = this.data;
            const { offset } = this;
            if (rightWidth > 0 && -offset > rightWidth * THRESHOLD) {
                this.open('right');
            }
            else if (leftWidth > 0 && offset > leftWidth * THRESHOLD) {
                this.open('left');
            }
            else {
                this.swipeMove(0);
            }
            this.setData({ catchMove: false });
        },
        startDrag(event) {
            if (this.data.disabled) {
                return;
            }
            this.startOffset = this.offset;
            this.touchStart(event);
        },
        noop() { },
        onDrag(event) {
            if (this.data.disabled) {
                return;
            }
            this.touchMove(event);
            if (this.direction !== 'horizontal') {
                return;
            }
            this.dragging = true;
            ARRAY.filter(item => item !== this).forEach(item => item.close());
            this.setData({ catchMove: true });
            this.swipeMove(this.startOffset + this.deltaX);
        },
        endDrag() {
            if (this.data.disabled) {
                return;
            }
            this.dragging = false;
            this.swipeLeaveTransition();
        },
        onClick(event) {
            const { key: position = 'outside' } = event.currentTarget.dataset;
            this.$emit('click', position);
            if (!this.offset) {
                return;
            }
            if (this.data.asyncClose) {
                this.$emit('close', {
                    position,
                    instance: this,
                    name: this.data.name
                });
            }
            else {
                this.swipeMove(0);
            }
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/swipe-cell/index'];
</script>
<style>
@import "./index.css";
</style>
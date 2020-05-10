<template>
<view :class="'custom-class ' + utils.bem('cell', [size, { center, required, borderless: !border, clickable: isLink || clickable }])" :style="customStyle" @tap="onClick" hover-class="van-cell--hover hover-class" hover-stay-time="70">
  <van-icon :name="icon" class="van-cell__left-icon-wrap" custom-class="van-cell__left-icon" v-if="icon"></van-icon>
  <slot name="icon" v-else></slot>

  <view :style="titleWidth ? 'max-width:' + titleWidth + ';min-width:' + titleWidth : ''" class="van-cell__title title-class">
    <block v-if="title">{{ title }}</block>
    <slot name="title" v-else></slot>

    <view class="van-cell__label label-class" v-if="label || useLabelSlot">
      <slot name="label" v-if="useLabelSlot"></slot>
      <block v-else-if="label">{{ label }}</block>
    </view>
  </view>

  <view class="van-cell__value value-class">
    <block v-if="value || value === 0">{{ value }}</block>
    <slot v-else></slot>
  </view>

  <van-icon :name="arrowDirection ? 'arrow' + '-' + arrowDirection : 'arrow'" class="van-cell__right-icon-wrap right-icon-class" custom-class="van-cell__right-icon" v-if="isLink"></van-icon>
  <slot name="right-icon" v-else></slot>

  <slot name="extra"></slot>
</view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/cell/index';
import {link} from '../mixins/link';
import {VantComponent} from '../common/component';

VantComponent({
    classes: [
        'title-class',
        'label-class',
        'value-class',
        'right-icon-class',
        'hover-class'
    ],
    mixins: [link],
    props: {
        title: null,
        value: null,
        icon: String,
        size: String,
        label: String,
        center: Boolean,
        isLink: Boolean,
        required: Boolean,
        clickable: Boolean,
        titleWidth: String,
        customStyle: String,
        arrowDirection: String,
        useLabelSlot: Boolean,
        border: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        onClick(event) {
            this.$emit('click', event.detail);
            this.jumpLink();
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/cell/index'];
</script>
<style>
@import "./index.css";
</style>
<template>
<view :class="( utils.bem('tabbar-item', { active }) ) + ' custom-class'" :style="'color: ' + ( active ? activeColor : inactiveColor )" @tap="onClick">
  <view class="van-tabbar-item__icon">
    <van-icon :name="icon" custom-class="van-tabbar-item__icon__inner" v-if="icon"></van-icon>
    <block v-else>
      <slot name="icon-active" v-if="active"></slot>
      <slot name="icon" v-else></slot>
    </block>
    <van-info :dot="dot" :info="info" custom-class="van-tabbar-item__info"></van-info>
  </view>
  <view class="van-tabbar-item__text">
    <slot></slot>
  </view>
</view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/tabbar-item/index';
import {VantComponent} from '../common/component';

VantComponent({
    props: {
        info: null,
        name: null,
        icon: String,
        dot: Boolean
    },
    relation: {
        name: 'tabbar',
        type: 'ancestor'
    },
    data: {
        active: false
    },
    methods: {
        onClick() {
            if (this.parent) {
                this.parent.onChange(this);
            }
            this.$emit('click');
        },
        updateFromParent() {
            const { parent } = this;
            if (!parent) {
                return;
            }
            const index = parent.children.indexOf(this);
            const parentData = parent.data;
            const { data } = this;
            const active = (data.name || index) === parentData.active;
            const patch = {};
            if (active !== data.active) {
                patch.active = active;
            }
            if (parentData.activeColor !== data.activeColor) {
                patch.activeColor = parentData.activeColor;
            }
            if (parentData.inactiveColor !== data.inactiveColor) {
                patch.inactiveColor = parentData.inactiveColor;
            }
            return Object.keys(patch).length > 0
                ? this.set(patch)
                : Promise.resolve();
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/tabbar-item/index'];
</script>
<style>
@import "./index.css";
</style>
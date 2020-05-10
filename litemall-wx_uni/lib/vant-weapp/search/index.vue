<template>
<view :class="utils.bem('search', { withaction: showAction || useActionSlot }) + ' custom-class'" :style="'background: ' + background">
  <view :class="utils.bem('search__content', [shape])">
    <view class="van-search__label" v-if="label">{{ label }}</view>
    <slot name="label" v-else></slot>

    <van-field :clearable="clearable" :disabled="disabled" :error="error" :focus="focus" :input-align="inputAlign" :left-icon="!useLeftIconSlot ? leftIcon : ''" :maxlength="maxlength" :placeholder="placeholder" :placeholder-style="placeholderStyle" :readonly="readonly" :right-icon="!useRightIconSlot ? rightIcon : ''" :value="value" @blur="onBlur" @change="onChange" @clear="onClear" @confirm="onSearch" @focus="onFocus" border="false" class="van-search__field field-class" confirm-type="search" custom-style="padding: 5px 10px 5px 0 background-color: transparent" input-class="input-class" type="search">
      <slot name="left-icon" slot="left-icon" v-if="useLeftIconSlot"></slot>
      <slot name="right-icon" slot="right-icon" v-if="useRightIconSlot"></slot>
    </van-field>
  </view>

  <view class="van-search__action" hover-class="van-search__action--hover" hover-stay-time="70" v-if="showAction || useActionSlot">
    <slot name="action" v-if="useActionSlot"></slot>
    <view @tap="onCancel" class="cancel-class" v-else>{{ actionText }}</view>
  </view>
</view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/search/index';
import {VantComponent} from '../common/component';

VantComponent({
    field: true,
    classes: ['field-class', 'input-class', 'cancel-class'],
    props: {
        label: String,
        focus: Boolean,
        error: Boolean,
        disabled: Boolean,
        readonly: Boolean,
        inputAlign: String,
        showAction: Boolean,
        useActionSlot: Boolean,
        useLeftIconSlot: Boolean,
        useRightIconSlot: Boolean,
        leftIcon: {
            type: String,
            value: 'search'
        },
        rightIcon: String,
        placeholder: String,
        placeholderStyle: String,
        actionText: {
            type: String,
            value: '取消'
        },
        background: {
            type: String,
            value: '#ffffff'
        },
        maxlength: {
            type: Number,
            value: -1
        },
        shape: {
            type: String,
            value: 'square'
        },
        clearable: {
            type: Boolean,
            value: true
        }
    },
    methods: {
        onChange(event) {
            this.setData({ value: event.detail });
            this.$emit('change', event.detail);
        },
        onCancel() {
            /**
             * 修复修改输入框值时，输入框失焦和赋值同时触发，赋值失效
             * https://github.com/youzan/@vant/weapp/issues/1768
             */
            setTimeout(() => {
                this.setData({ value: '' });
                this.$emit('cancel');
                this.$emit('change', '');
            }, 200);
        },
        onSearch() {
            this.$emit('search', this.data.value);
        },
        onFocus() {
            this.$emit('focus');
        },
        onBlur() {
            this.$emit('blur');
        },
        onClear() {
            this.$emit('clear');
        },
    }
});

export default global['__wxComponents']['lib/vant-weapp/search/index'];
</script>
<style>
@import "./index.css";
</style>
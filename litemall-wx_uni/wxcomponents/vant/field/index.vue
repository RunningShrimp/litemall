<template>
<uni-shadow-root class="vant-field-index"><van-cell :arrow-direction="arrowDirection" :border="border" :center="center" :clickable="clickable" :custom-style="customStyle" :icon="leftIcon" :is-link="isLink" :required="required" :size="size" :title="label" :title-width="titleWidth" custom-class="van-field">
  <slot name="left-icon" slot="icon"></slot>
  <slot name="label" slot="title"></slot>
  <view :class="utils.bem('field__body', [type, system])">
    <textarea :adjust-position="adjustPosition" :auto-height="autosize" :class="'input-class '+(utils.bem('field__input', [inputAlign, type, { disabled, error }]))" :cursor-spacing="cursorSpacing" :disabled="disabled || readonly" :fixed="fixed" :focus="focus" :hold-keyboard="holdKeyboard" :maxlength="maxlength" :placeholder="placeholder" :placeholder-class="utils.bem('field__placeholder', { error })" :placeholder-style="placeholderStyle" :selection-end="selectionEnd" :selection-start="selectionStart" :show-confirm-bar="showConfirmBar" :value="value" @blur="onBlur" @confirm="onConfirm" @focus="onFocus" @input="onInput" v-if="type === 'textarea'">
    </textarea>
    <input :adjust-position="adjustPosition" :class="'input-class '+(utils.bem('field__input', [inputAlign, { disabled, error }]))" :confirm-hold="confirmHold" :confirm-type="confirmType" :cursor-spacing="cursorSpacing" :disabled="disabled || readonly" :focus="focus" :hold-keyboard="holdKeyboard" :maxlength="maxlength" :password="password || type === 'password'" :placeholder="placeholder" :placeholder-class="utils.bem('field__placeholder', { error })" :placeholder-style="placeholderStyle" :selection-end="selectionEnd" :selection-start="selectionStart" :type="type" :value="value" @blur="onBlur" @confirm="onConfirm" @focus="onFocus" @input="onInput" v-else></input>
    <van-icon @touchstart.native.stop.prevent="onClear" class="van-field__clear-root van-field__icon-root" name="clear" size="16px" v-if="clearable && focused && value && !readonly"></van-icon>
    <view @click="onClickIcon" class="van-field__icon-container">
      <van-icon :class="'van-field__icon-root '+(iconClass)" :name="rightIcon || icon" custom-class="right-icon-class" size="16px" v-if="rightIcon || icon"></van-icon>
      <slot name="right-icon"></slot>
      <slot name="icon"></slot>
    </view>
    <view class="van-field__button">
      <slot name="button"></slot>
    </view>
  </view>
  <view :class="'van-field__error-message '+(utils.bem('field__error', [errorMessageAlign, { disabled, error }]))" v-if="errorMessage">
    {{ errorMessage }}
  </view>
</van-cell></uni-shadow-root>
</template>
<wxs module="utils" src="../wxs/utils.wxs"></wxs>
<script>
    import VanCell from '../cell/index.vue'
    import VanIcon from '../icon/index.vue'
    import {VantComponent} from '../common/component';
    import {getSystemInfoSync} from '../common/utils';

    global['__wxVueOptions'] = {components:{'van-cell': VanCell,'van-icon': VanIcon}}

global['__wxRoute'] = 'vant/field/index'
    VantComponent({
    field: true,
    classes: ['input-class', 'right-icon-class'],
    props: {
        size: String,
        icon: String,
        label: String,
        error: Boolean,
        fixed: Boolean,
        focus: Boolean,
        center: Boolean,
        isLink: Boolean,
        leftIcon: String,
        rightIcon: String,
        disabled: Boolean,
        autosize: Boolean,
        readonly: Boolean,
        required: Boolean,
        password: Boolean,
        iconClass: String,
        clearable: Boolean,
        clickable: Boolean,
        inputAlign: String,
        placeholder: String,
        customStyle: String,
        confirmType: String,
        confirmHold: Boolean,
        holdKeyboard: Boolean,
        errorMessage: String,
        arrowDirection: String,
        placeholderStyle: String,
        errorMessageAlign: String,
        selectionEnd: {
            type: Number,
            value: -1
        },
        selectionStart: {
            type: Number,
            value: -1
        },
        showConfirmBar: {
            type: Boolean,
            value: true
        },
        adjustPosition: {
            type: Boolean,
            value: true
        },
        cursorSpacing: {
            type: Number,
            value: 50
        },
        maxlength: {
            type: Number,
            value: -1
        },
        type: {
            type: String,
            value: 'text'
        },
        border: {
            type: Boolean,
            value: true
        },
        titleWidth: {
            type: String,
            value: '90px'
        }
    },
    data: {
        focused: false,
        system: getSystemInfoSync().system.split(' ').shift().toLowerCase()
    },
    methods: {
        onInput(event) {
            const { value = '' } = event.detail || {};
            this.setData({ value });
            wx.nextTick(() => {
                this.emitChange(value);
            });
        },
        onFocus(event) {
            this.setData({ focused: true });
            this.$emit('focus', event.detail);
        },
        onBlur(event) {
            this.setData({ focused: false });
            this.$emit('blur', event.detail);
        },
        onClickIcon() {
            this.$emit('click-icon');
        },
        onClear() {
            this.setData({ value: '' });
            wx.nextTick(() => {
                this.emitChange('');
                this.$emit('clear', '');
            });
        },
        onConfirm() {
            this.$emit('confirm', this.data.value);
        },
        emitChange(value) {
            this.$emit('input', value);
            this.$emit('change', value);
        },
        noop() { }
    }
});
export default global['__wxComponents']['vant/field/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-field__body{display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center}.van-field__body--textarea{line-height:1.2em;min-height:24px;min-height:var(--cell-line-height,24px)}.van-field__body--textarea.van-field__body--ios{margin-top:-4.5px}.van-field__input{position:relative;display:block;box-sizing:border-box;width:100%;margin:0;padding:0;line-height:inherit;text-align:left;background-color:initial;border:0;resize:none;color:#323233;color:var(--field-input-text-color,#323233);height:24px;height:var(--cell-line-height,24px);min-height:24px;min-height:var(--cell-line-height,24px)}.van-field__input--textarea{height:18px;height:var(--field-text-area-min-height,18px);min-height:18px;min-height:var(--field-text-area-min-height,18px)}.van-field__input--error{color:#ee0a24;color:var(--field-input-error-text-color,#ee0a24)}.van-field__input--disabled{background-color:initial;opacity:1;color:#969799;color:var(--field-input-disabled-text-color,#969799)}.van-field__input--center{text-align:center}.van-field__input--right{text-align:right}.van-field__placeholder{position:absolute;top:0;right:0;left:0;pointer-events:none;color:#969799;color:var(--field-placeholder-text-color,#969799)}.van-field__placeholder--error{color:#ee0a24;color:var(--field-error-message-color,#ee0a24)}.van-field__icon-root{display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;min-height:24px;min-height:var(--cell-line-height,24px)}.van-field__clear-root,.van-field__icon-container{line-height:inherit;vertical-align:middle;padding:0 8px;padding:0 var(--padding-xs,8px);margin-right:-8px;margin-right:-var(--padding-xs,8px)}.van-field__button,.van-field__clear-root,.van-field__icon-container{-webkit-flex-shrink:0;flex-shrink:0}.van-field__clear-root{color:#c8c9cc;color:var(--field-clear-icon-color,#c8c9cc)}.van-field__icon-container{color:#969799;color:var(--field-icon-container-color,#969799)}.van-field__icon-container:empty{display:none}.van-field__button{padding-left:8px;padding-left:var(--padding-xs,8px)}.van-field__button:empty{display:none}.van-field__error-message{text-align:left;font-size:12px;font-size:var(--field-error-message-text-font-size,12px);color:#ee0a24;color:var(--field-error-message-color,#ee0a24)}.van-field__error-message--center{text-align:center}.van-field__error-message--right{text-align:right}
</style>
<template>
    <van-cell :arrow-direction="arrowDirection" :border="border" :center="center" :clickable="clickable"
              :custom-style="customStyle" :icon="leftIcon" :is-link="isLink" :required="required" :size="size"
              :title="label" :title-width="titleWidth" custom-class="van-field">
        <slot name="left-icon" slot="icon"></slot>
        <slot name="label" slot="title"></slot>
        <view :class="utils.bem('field__body', [type, system])">
    <textarea :adjust-position="adjustPosition" :auto-height="autosize"
              :class="'input-class ' + utils.bem('field__input', [inputAlign, type, { disabled, error }])"
              :cursor-spacing="cursorSpacing" :disabled="disabled || readonly" :fixed="fixed" :focus="focus"
              :hold-keyboard="holdKeyboard" :maxlength="maxlength" :placeholder="placeholder"
              :placeholder-class="utils.bem('field__placeholder', { error })" :placeholder-style="placeholderStyle"
              :selection-end="selectionEnd" :selection-start="selectionStart" :show-confirm-bar="showConfirmBar"
              :value="value" @blur="onBlur" @confirm="onConfirm" @focus="onFocus" @input="onInput"
              v-if="type === 'textarea'">
    </textarea>
            <input :adjust-position="adjustPosition"
                   :class="'input-class ' + utils.bem('field__input', [inputAlign, { disabled, error }])"
                   :confirm-hold="confirmHold" :confirm-type="confirmType" :cursor-spacing="cursorSpacing"
                   :disabled="disabled || readonly" :focus="focus" :hold-keyboard="holdKeyboard" :maxlength="maxlength"
                   :password="password || type === 'password'" :placeholder="placeholder"
                   :placeholder-class="utils.bem('field__placeholder', { error })" :placeholder-style="placeholderStyle"
                   :selection-end="selectionEnd" :selection-start="selectionStart" :type="type" :value="value"
                   @blur="onBlur" @confirm="onConfirm" @focus="onFocus" @input="onInput" v-else></input>
            <van-icon @touchstart="onClear" class="van-field__clear-root van-field__icon-root" name="clear" size="16px"
                      v-if="clearable && focused && value && !readonly"></van-icon>
            <view @tap="onClickIcon" class="van-field__icon-container">
                <van-icon :class="'van-field__icon-root ' + iconClass" :name="rightIcon || icon"
                          custom-class="right-icon-class" size="16px" v-if="rightIcon || icon"></van-icon>
                <slot name="right-icon"></slot>
                <slot name="icon"></slot>
            </view>
            <view class="van-field__button">
                <slot name="button"></slot>
            </view>
        </view>
        <view :class="'van-field__error-message ' + utils.bem('field__error', [errorMessageAlign, { disabled, error }])"
              v-if="errorMessage">{{ errorMessage }}
        </view>
    </van-cell>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/field/index';
    import {VantComponent} from '../common/component';
    import {getSystemInfoSync} from '../common/utils';

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
                const {value = ''} = event.detail || {};
                this.setData({value}, () => {
                    this.emitChange(value);
                });
            },
            onFocus(event) {
                this.setData({focused: true});
                this.$emit('focus', event.detail);
            },
            onBlur(event) {
                this.setData({focused: false});
                this.$emit('blur', event.detail);
            },
            onClickIcon() {
                this.$emit('click-icon');
            },
            onClear() {
                this.setData({value: ''}, () => {
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
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/field/index'];
</script>
<style>
    @import "./index.css";
</style>
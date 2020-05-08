<template>
    <view class="van-radio custom-class">
        <view :class="'label-class ' + utils.bem('radio__label', [labelPosition, { disabled }])" @tap="onClickLabel"
              v-if="labelPosition === 'left'">
            <slot></slot>
        </view>
        <view :style="'font-size: ' + iconSizeWithUnit + ';'" @tap="onChange" class="van-radio__icon-wrap">
            <slot name="icon" v-if="useIconSlot"></slot>
            <van-icon :class="utils.bem('radio__icon', [shape, { disabled, checked: value === name }])"
                      :custom-style="'line-height: ' + iconSizeWithUnit + ';font-size: .8em;display: block;'"
                      :style="checkedColor && !disabled && value === name ? 'border-color:' + checkedColor + '; background-color:' + checkedColor + ';' : ''"
                      custom-class="icon-class" name="success" v-else></van-icon>
        </view>
        <view :class="'label-class ' + utils.bem('radio__label', [labelPosition, { disabled }])" @tap="onClickLabel"
              v-if="labelPosition === 'right'">
            <slot></slot>
        </view>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/radio/index';
    import {VantComponent} from '../common/component';
    import {addUnit} from '../common/utils';

    VantComponent({
        field: true,
        relation: {
            name: 'radio-group',
            type: 'ancestor',
            linked(target) {
                this.parent = target;
            },
            unlinked() {
                this.parent = null;
            }
        },
        classes: ['icon-class', 'label-class'],
        props: {
            value: null,
            disabled: Boolean,
            useIconSlot: Boolean,
            checkedColor: String,
            labelPosition: {
                type: String,
                value: 'right'
            },
            labelDisabled: Boolean,
            shape: {
                type: String,
                value: 'round'
            },
            iconSize: {
                type: null,
                observer: 'setIconSizeUnit'
            }
        },
        data: {
            iconSizeWithUnit: '20px'
        },
        methods: {
            setIconSizeUnit(val) {
                this.setData({
                    iconSizeWithUnit: addUnit(val)
                });
            },
            emitChange(value) {
                const instance = this.parent || this;
                instance.$emit('input', value);
                instance.$emit('change', value);
            },
            onChange(event) {
                console.log(event);
                this.emitChange(this.data.name);
            },
            onClickLabel() {
                const {disabled, labelDisabled, name} = this.data;
                if (!disabled && !labelDisabled) {
                    this.emitChange(name);
                }
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/radio/index'];
</script>
<style>
    @import "./index.css";
</style>
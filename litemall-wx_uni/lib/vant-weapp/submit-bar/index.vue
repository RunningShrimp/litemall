<template>
    <view class="van-submit-bar custom-class">
        <slot name="top"></slot>

        <view class="van-submit-bar__tip">
            <van-icon :name="tipIcon" custom-class="van-submit-bar__tip-icon" size="12px" v-if="tipIcon"></van-icon>
            <view class="van-submit-bar__tip-text" v-if="hasTip">{{ tip }}</view>
            <slot name="tip"></slot>
        </view>

        <view :class="'bar-class ' + ( utils.bem('submit-bar__bar', { safe: safeAreaInsetBottom }) )">
            <slot></slot>
            <view class="van-submit-bar__text" v-if="hasPrice">
                <text>{{ label || '合计：' }}</text>
                <text class="van-submit-bar__price price-class">
                    <text class="van-submit-bar__currency">{{ currency }}</text>
                    <text>{{ priceStr }}</text>
                </text>
                <text class="van-submit-bar__suffix-label">{{ suffixLabel }}</text>
            </view>
            <van-button :disabled="disabled" :loading="loading" :type="buttonType" @click="onSubmit"
                        class="van-submit-bar__button" custom-class="button-class" size="large" square>{{ loading ? '' :
                buttonText }}
            </van-button>
        </view>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/submit-bar/index';
    import {VantComponent} from '../common/component';

    VantComponent({
        classes: [
            'bar-class',
            'price-class',
            'button-class'
        ],
        props: {
            tip: {
                type: null,
                observer: 'updateTip'
            },
            tipIcon: String,
            type: Number,
            price: {
                type: null,
                observer: 'updatePrice'
            },
            label: String,
            loading: Boolean,
            disabled: Boolean,
            buttonText: String,
            currency: {
                type: String,
                value: '¥'
            },
            buttonType: {
                type: String,
                value: 'danger'
            },
            decimalLength: {
                type: Number,
                value: 2,
                observer: 'updatePrice'
            },
            suffixLabel: String,
            safeAreaInsetBottom: {
                type: Boolean,
                value: true
            }
        },
        methods: {
            updatePrice() {
                const {price, decimalLength} = this.data;
                this.setData({
                    hasPrice: typeof price === 'number',
                    priceStr: (price / 100).toFixed(decimalLength)
                });
            },
            updateTip() {
                this.setData({hasTip: typeof this.data.tip === 'string'});
            },
            onSubmit(event) {
                this.$emit('submit', event.detail);
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/submit-bar/index'];
</script>
<style>
    @import "./index.css";
</style>
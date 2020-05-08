<template>
    <van-popup :close-on-click-overlay="closeOnClickOverlay" :overlay="overlay" :round="round"
               :safe-area-inset-bottom="safeAreaInsetBottom" :show="show" :z-index="zIndex" @close="onClickOverlay"
               custom-class="van-action-sheet" position="bottom">
        <view class="van-hairline--bottom van-action-sheet__header" v-if="title">{{ title }}
            <van-icon @click="onClose" custom-class="van-action-sheet__close" name="close"></van-icon>
        </view>
        <view class="van-action-sheet__description" v-if="description">{{ description }}</view>
        <view v-if="actions && actions.length">
            <!-- button外包一层view，防止actions动态变化，导致渲染时button被打散 -->
            <button :class="( utils.bem('action-sheet__item', { disabled: item.disabled || item.loading }) ) + ' van-hairline--top ' + item.className || ''"
                    :data-index="index" :key="index" :open-type="item.openType"
                    :style="item.color ? 'color: ' + item.color : ''" @tap="onSelect"
                    hover-class="van-action-sheet__item--hover" v-for="(item, index) in actions">
                <block v-if="!item.loading">{{ item.name }}
                    <text class="van-action-sheet__subname" v-if="item.subname">{{ item.subname }}</text>
                </block>
                <van-loading custom-class="van-action-sheet__loading" size="20px" v-else></van-loading>
            </button>
        </view>
        <slot></slot>
        <view @tap="onCancel" class="van-action-sheet__cancel" hover-class="van-action-sheet__cancel--hover"
              hover-stay-time="70" v-if="cancelText">{{ cancelText }}
        </view>
    </van-popup>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/action-sheet/index';
    import {VantComponent} from '../common/component';

    VantComponent({
        props: {
            show: Boolean,
            title: String,
            cancelText: String,
            description: String,
            round: {
                type: Boolean,
                value: true
            },
            zIndex: {
                type: Number,
                value: 100
            },
            actions: {
                type: Array,
                value: []
            },
            overlay: {
                type: Boolean,
                value: true
            },
            closeOnClickOverlay: {
                type: Boolean,
                value: true
            },
            closeOnClickAction: {
                type: Boolean,
                value: true
            },
            safeAreaInsetBottom: {
                type: Boolean,
                value: true
            }
        },
        methods: {
            onSelect(event) {
                const {index} = event.currentTarget.dataset;
                const item = this.data.actions[index];
                if (item && !item.disabled && !item.loading) {
                    this.$emit('select', item);
                    if (this.data.closeOnClickAction) {
                        this.onClose();
                    }
                }
            },
            onCancel() {
                this.$emit('cancel');
            },
            onClose() {
                this.$emit('close');
            },
            onClickOverlay() {
                this.$emit('click-overlay');
                this.onClose();
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/action-sheet/index'];
</script>
<style>
    @import "./index.css";
</style>
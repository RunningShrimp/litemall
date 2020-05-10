<template>
<uni-shadow-root class="vant-action-sheet-index"><van-popup :close-on-click-overlay="closeOnClickOverlay" :overlay="overlay" :round="round" :safe-area-inset-bottom="safeAreaInsetBottom" :show="show" :z-index="zIndex" @close="onClickOverlay" custom-class="van-action-sheet" position="bottom">
  <view class="van-hairline--bottom van-action-sheet__header" v-if="title">
    {{ title }}
    <van-icon @click="onClose" custom-class="van-action-sheet__close" name="close"></van-icon>
  </view>
  <view class="van-action-sheet__description" v-if="description">
    {{ description }}
  </view>
  <view v-if="actions && actions.length">
    
    <button :app-parameter="appParameter" :class="(utils.bem('action-sheet__item', { disabled: item.disabled || item.loading }))+' van-hairline--top '+(item.className || '')" :data-index="index" :key="item.index" :lang="lang" :open-type="item.openType" :send-message-img="sendMessageImg" :send-message-path="sendMessagePath" :send-message-title="sendMessageTitle" :session-from="sessionFrom" :show-message-card="showMessageCard" :style="item.color ? 'color: ' + item.color : ''" @click="onSelect" @contact="bindContact" @error="bindError" @getphonenumber="bindGetPhoneNumber" @getuserinfo="bindGetUserInfo" @launchapp="bindLaunchApp" @opensetting="bindOpenSetting" hover-class="van-action-sheet__item--hover" v-for="(item,index) in (actions)">
      <block v-if="(!item.loading)">
        {{ item.name }}
        <text class="van-action-sheet__subname" v-if="item.subname">{{ item.subname }}</text>
      </block>
      <van-loading custom-class="van-action-sheet__loading" size="20px" v-else></van-loading>
    </button>
  </view>
  <slot></slot>
  <view @click="onCancel" class="van-action-sheet__cancel" hover-class="van-action-sheet__cancel--hover" hover-stay-time="70" v-if="cancelText">
    {{ cancelText }}
  </view>
</van-popup></uni-shadow-root>
</template>
<wxs module="utils" src="../wxs/utils.wxs"></wxs>
<script>
    import VanIcon from '../icon/index.vue'
    import VanPopup from '../popup/index.vue'
    import VanLoading from '../loading/index.vue'
    import {VantComponent} from '../common/component';
    import {button} from '../mixins/button';
    import {openType} from '../mixins/open-type';

    global['__wxVueOptions'] = {components:{'van-icon': VanIcon,'van-popup': VanPopup,'van-loading': VanLoading}}

global['__wxRoute'] = 'vant/action-sheet/index'
    VantComponent({
    mixins: [button, openType],
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
            const { index } = event.currentTarget.dataset;
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
export default global['__wxComponents']['vant/action-sheet/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-action-sheet{max-height:90%!important;max-height:var(--action-sheet-max-height,90%)!important;color:#323233;color:var(--action-sheet-item-text-color,#323233)}.van-action-sheet__cancel,.van-action-sheet__item{text-align:center;font-size:16px;font-size:var(--action-sheet-item-font-size,16px);line-height:50px;line-height:var(--action-sheet-item-height,50px);background-color:#fff;background-color:var(--action-sheet-item-background,#fff)}.van-action-sheet__cancel--hover,.van-action-sheet__item--hover{background-color:#f2f3f5;background-color:var(--active-color,#f2f3f5)}.van-action-sheet__cancel:before{display:block;content:" ";height:8px;height:var(--action-sheet-cancel-padding-top,8px);background-color:#f7f8fa;background-color:var(--action-sheet-cancel-padding-color,#f7f8fa)}.van-action-sheet__item--disabled{color:#c8c9cc;color:var(--action-sheet-item-disabled-text-color,#c8c9cc)}.van-action-sheet__item--disabled.van-action-sheet__item--hover{background-color:#fff;background-color:var(--action-sheet-item-background,#fff)}.van-action-sheet__subname{margin-left:4px;margin-left:var(--padding-base,4px);font-size:12px;font-size:var(--action-sheet-subname-font-size,12px);color:#646566;color:var(--action-sheet-subname-color,#646566)}.van-action-sheet__header{text-align:center;font-weight:500;font-weight:var(--font-weight-bold,500);font-size:16px;font-size:var(--action-sheet-header-font-size,16px);line-height:44px;line-height:var(--action-sheet-header-height,44px)}.van-action-sheet__description{text-align:center;padding:16px;padding:var(--padding-md,16px);color:#646566;color:var(--action-sheet-description-color,#646566);font-size:14px;font-size:var(--action-sheet-description-font-size,14px);line-height:20px;line-height:var(--action-sheet-description-line-height,20px)}.van-action-sheet__close{position:absolute!important;top:0;right:0;line-height:inherit!important;padding:0 12px;padding:var(--action-sheet-close-icon-padding,0 12px);font-size:18px!important;font-size:var(--action-sheet-close-icon-size,18px)!important;color:#969799;color:var(--action-sheet-close-icon-color,#969799)}.van-action-sheet__loading{display:-webkit-flex!important;display:flex!important;height:50px;height:var(--action-sheet-item-height,50px)}
</style>
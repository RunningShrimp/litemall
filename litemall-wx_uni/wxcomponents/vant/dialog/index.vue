<template>
<uni-shadow-root class="vant-dialog-index"><van-popup :close-on-click-overlay="closeOnClickOverlay" :custom-class="'van-dialog '+(className)" :custom-style="'width: '+(utils.addUnit(width))+';'+(customStyle)" :overlay="overlay" :overlay-style="overlayStyle" :show="show" :transition="transition" :z-index="zIndex" @close="onClickOverlay">
  <view :class="'van-dialog__header '+(message || useSlot ? '' : 'van-dialog--isolated')" v-if="title || useTitleSlot">
    <slot name="title" v-if="useTitleSlot"></slot>
    <block v-else-if="title"> {{ title }}</block>
  </view>

  <slot v-if="useSlot"></slot>
  <view :class="'van-dialog__message '+(title ? 'van-dialog__message--has-title' : '')+' '+(messageAlign ? 'van-dialog__message--' + messageAlign : '')" v-else-if="message">
    <text class="van-dialog__message-text">{{ message }}</text>
  </view>

  <view class="van-hairline--top van-dialog__footer">
    <van-button :custom-style="'color: '+(cancelButtonColor)" :loading="loading.cancel" @click="onCancel" class="van-dialog__button van-hairline--right" custom-class="van-dialog__cancel" size="large" v-if="showCancelButton">
      {{ cancelButtonText }}
    </van-button>
    <van-button :app-parameter="appParameter" :business-id="businessId" :custom-style="'color: '+(confirmButtonColor)" :lang="lang" :loading="loading.confirm" :open-type="confirmButtonOpenType" :send-message-img="sendMessageImg" :send-message-path="sendMessagePath" :send-message-title="sendMessageTitle" :session-from="sessionFrom" :show-message-card="showMessageCard" @click="onConfirm" @contact="bindContact" @error="bindError" @getphonenumber="bindGetPhoneNumber" @getuserinfo="bindGetUserInfo" @launchapp="bindLaunchApp" @opensetting="bindOpenSetting" class="van-dialog__button" custom-class="van-dialog__confirm" size="large" v-if="showConfirmButton">
      {{ confirmButtonText }}
    </van-button>
  </view>
</van-popup></uni-shadow-root>
</template>
<wxs module="utils" src="../wxs/utils.wxs"></wxs>
<script>
    import VanPopup from '../popup/index.vue'
    import VanButton from '../button/index.vue'
    import {VantComponent} from '../common/component';
    import {button} from '../mixins/button';
    import {openType} from '../mixins/open-type';
    import {BLUE, GRAY} from '../common/color';

    global['__wxVueOptions'] = {components:{'van-popup': VanPopup,'van-button': VanButton}}

global['__wxRoute'] = 'vant/dialog/index'
    VantComponent({
    mixins: [button, openType],
    props: {
        show: {
            type: Boolean,
            observer(show) {
                !show && this.stopLoading();
            }
        },
        title: String,
        message: String,
        useSlot: Boolean,
        className: String,
        customStyle: String,
        asyncClose: Boolean,
        messageAlign: String,
        overlayStyle: String,
        useTitleSlot: Boolean,
        showCancelButton: Boolean,
        closeOnClickOverlay: Boolean,
        confirmButtonOpenType: String,
        width: null,
        zIndex: {
            type: Number,
            value: 2000
        },
        confirmButtonText: {
            type: String,
            value: '确认'
        },
        cancelButtonText: {
            type: String,
            value: '取消'
        },
        confirmButtonColor: {
            type: String,
            value: BLUE
        },
        cancelButtonColor: {
            type: String,
            value: GRAY
        },
        showConfirmButton: {
            type: Boolean,
            value: true
        },
        overlay: {
            type: Boolean,
            value: true
        },
        transition: {
            type: String,
            value: 'scale'
        }
    },
    data: {
        loading: {
            confirm: false,
            cancel: false
        }
    },
    methods: {
        onConfirm() {
            this.handleAction('confirm');
        },
        onCancel() {
            this.handleAction('cancel');
        },
        onClickOverlay() {
            this.onClose('overlay');
        },
        handleAction(action) {
            if (this.data.asyncClose) {
                this.setData({
                    [`loading.${action}`]: true
                });
            }
            this.onClose(action);
        },
        close() {
            this.setData({
                show: false
            });
        },
        stopLoading() {
            this.setData({
                loading: {
                    confirm: false,
                    cancel: false
                }
            });
        },
        onClose(action) {
            if (!this.data.asyncClose) {
                this.close();
            }
            this.$emit('close', action);
            // 把 dialog 实例传递出去，可以通过 stopLoading() 在外部关闭按钮的 loading
            this.$emit(action, { dialog: this });
            const callback = this.data[action === 'confirm' ? 'onConfirm' : 'onCancel'];
            if (callback) {
                callback(this);
            }
        }
    }
});
export default global['__wxComponents']['vant/dialog/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-dialog{top:45%!important;overflow:hidden;width:320px;width:var(--dialog-width,320px);font-size:16px;font-size:var(--dialog-font-size,16px);border-radius:16px;border-radius:var(--dialog-border-radius,16px);background-color:#fff;background-color:var(--dialog-background-color,#fff)}@media (max-width:321px){.van-dialog{width:90%;width:var(--dialog-small-screen-width,90%)}}.van-dialog__header{text-align:center;padding-top:24px;padding-top:var(--dialog-header-padding-top,24px);font-weight:500;font-weight:var(--dialog-header-font-weight,500);line-height:24px;line-height:var(--dialog-header-line-height,24px)}.van-dialog__header--isolated{padding:24px 0;padding:var(--dialog-header-isolated-padding,24px 0)}.van-dialog__message{overflow-y:auto;text-align:center;-webkit-overflow-scrolling:touch;font-size:14px;font-size:var(--dialog-message-font-size,14px);line-height:20px;line-height:var(--dialog-message-line-height,20px);max-height:60vh;max-height:var(--dialog-message-max-height,60vh);padding:24px;padding:var(--dialog-message-padding,24px)}.van-dialog__message-text{word-wrap:break-word}.van-dialog__message--has-title{padding-top:12px;padding-top:var(--dialog-has-title-message-padding-top,12px);color:#646566;color:var(--dialog-has-title-message-text-color,#646566)}.van-dialog__message--left{text-align:left}.van-dialog__message--right{text-align:right}.van-dialog__footer{display:-webkit-flex;display:flex}.van-dialog__button{-webkit-flex:1;flex:1}.van-dialog__cancel,.van-dialog__confirm{border:0!important}.van-dialog-bounce-enter{-webkit-transform:translate3d(-50%,-50%,0) scale(.7);transform:translate3d(-50%,-50%,0) scale(.7);opacity:0}.van-dialog-bounce-leave-active{-webkit-transform:translate3d(-50%,-50%,0) scale(.9);transform:translate3d(-50%,-50%,0) scale(.9);opacity:0}
</style>
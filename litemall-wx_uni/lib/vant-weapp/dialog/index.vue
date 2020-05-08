<template>
    <van-popup :close-on-click-overlay="closeOnClickOverlay" :custom-class="'van-dialog ' + className"
               :custom-style="( widthWithUnit ? 'width: ' + widthWithUnit + ';' : '' ) + '' + customStyle"
               :overlay="overlay" :overlay-style="overlayStyle" :show="show" :transition="transition" :z-index="zIndex"
               @close="onClickOverlay">
        <view :class="'van-dialog__header ' + ( message || useSlot ? '' : 'van-dialog--isolated' )"
              v-if="title || useTitleSlot ">
            <slot name="title" v-if="useTitleSlot"></slot>
            <block v-else-if="title">{{ title }}</block>
        </view>

        <slot v-if="useSlot"></slot>
        <view :class="'van-dialog__message ' + ( title ? 'van-dialog__message--has-title' : '' ) + ' ' + ( messageAlign ? 'van-dialog__message--' + messageAlign : '' )"
              v-else-if="message">
            <text class="van-dialog__message-text">{{ message }}</text>
        </view>

        <view class="van-hairline--top van-dialog__footer">
            <van-button :custom-style="'color: ' + cancelButtonColor" :loading="loading.cancel" @click="onCancel"
                        class="van-dialog__button van-hairline--right" custom-class="van-dialog__cancel" size="large"
                        v-if="showCancelButton">{{ cancelButtonText }}
            </van-button>
            <van-button :app-parameter="appParameter" :business-id="businessId"
                        :custom-style="'color: ' + confirmButtonColor" :lang="lang" :loading="loading.confirm"
                        :open-type="confirmButtonOpenType" :send-message-img="sendMessageImg"
                        :send-message-path="sendMessagePath" :send-message-title="sendMessageTitle"
                        :session-from="sessionFrom" :show-message-card="showMessageCard" @click="onConfirm"
                        @contact="bindContact" @error="bindError" @getphonenumber="bindGetPhoneNumber"
                        @getuserinfo="bindGetUserInfo" @launchapp="bindLaunchApp" @opensetting="bindOpenSetting"
                        class="van-dialog__button" custom-class="van-dialog__confirm" size="large"
                        v-if="showConfirmButton">{{ confirmButtonText }}
            </van-button>
        </view>
    </van-popup>
</template>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/dialog/index';
    import {VantComponent} from '../common/component';
    import {button} from '../mixins/button';
    import {openType} from '../mixins/open-type';
    import {addUnit} from '../common/utils';
    import {BLUE, GRAY} from '../common/color';

    VantComponent({
        mixins: [button, openType],
        props: {
            show: Boolean,
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
            width: {
                type: null,
                observer: 'setWidthWithUnit'
            },
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
        watch: {
            show(show) {
                !show && this.stopLoading();
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
                this.$emit(action, {dialog: this});
                const callback = this.data[action === 'confirm' ? 'onConfirm' : 'onCancel'];
                if (callback) {
                    callback(this);
                }
            },
            setWidthWithUnit(val) {
                this.setData({
                    widthWithUnit: addUnit(val)
                });
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/dialog/index'];
</script>
<style>
    @import "./index.css";
</style>
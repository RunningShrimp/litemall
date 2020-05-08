<template>
    <button :app-parameter="appParameter" :aria-label="ariaLabel" :business-id="businessId"
            :class="'custom-class ' + utils.bem('button', [type, size, { block, round, plain, square, loading, disabled, hairline, unclickable: disabled || loading }]) + ' ' + ( hairline ? 'van-hairline--surround' : '' )"
            :id="id" :lang="lang" :open-type="openType" :send-message-img="sendMessageImg"
            :send-message-path="sendMessagePath" :send-message-title="sendMessageTitle" :session-from="sessionFrom"
            :show-message-card="showMessageCard" :style="style + ' ' + customStyle" @contact="bindContact"
            @error="bindError" @getphonenumber="bindGetPhoneNumber" @getuserinfo="bindGetUserInfo"
            @launchapp="bindLaunchApp" @opensetting="bindOpenSetting" @tap="onClick"
            hover-class="van-button--active hover-class">
        <block v-if="loading">
            <van-loading :color="type === 'default' ? '#c9c9c9' : 'white'" :size="loadingSize" :type="loadingType"
                         custom-class="loading-class"></van-loading>
            <view class="van-button__loading-text" v-if="loadingText">{{ loadingText }}</view>
        </block>
        <block v-else>
            <van-icon :name="icon" class="van-button__icon" custom-style="line-height: inherit" size="1.2em"
                      v-if="icon"></van-icon>
            <view class="van-button__text">
                <slot></slot>
            </view>
        </block>
    </button>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/button/index';
    import {VantComponent} from '../common/component';
    import {button} from '../mixins/button';
    import {openType} from '../mixins/open-type';

    VantComponent({
        mixins: [button, openType],
        classes: ['hover-class', 'loading-class'],
        data: {
            style: ''
        },
        props: {
            icon: String,
            plain: Boolean,
            block: Boolean,
            round: Boolean,
            square: Boolean,
            loading: Boolean,
            hairline: Boolean,
            disabled: Boolean,
            loadingText: String,
            customStyle: String,
            loadingType: {
                type: String,
                value: 'circular'
            },
            type: {
                type: String,
                value: 'default'
            },
            size: {
                type: String,
                value: 'normal'
            },
            loadingSize: {
                type: String,
                value: '20px'
            },
            color: {
                type: String,
                observer(color) {
                    let style = '';
                    if (color) {
                        style += `color: ${this.data.plain ? color : 'white'};`;
                        if (!this.data.plain) {
                            // Use background instead of backgroundColor to make linear-gradient work
                            style += `background: ${color};`;
                        }
                        // hide border when color is linear-gradient
                        if (color.indexOf('gradient') !== -1) {
                            style += 'border: 0;';
                        } else {
                            style += `border-color: ${color};`;
                        }
                    }
                    if (style !== this.data.style) {
                        this.setData({style});
                    }
                }
            }
        },
        methods: {
            onClick() {
                if (!this.data.disabled && !this.data.loading) {
                    this.$emit('click');
                }
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/button/index'];
</script>
<style>
    @import "./index.css";
</style>
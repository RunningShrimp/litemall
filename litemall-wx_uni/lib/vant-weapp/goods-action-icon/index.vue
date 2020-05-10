<template>
<van-button :app-parameter="appParameter" :business-id="businessId" :disabled="disabled" :id="id" :lang="lang" :loading="loading" :open-type="openType" :send-message-img="sendMessageImg" :send-message-path="sendMessagePath" :send-message-title="sendMessageTitle" :session-from="sessionFrom" :show-message-card="showMessageCard" @click="onClick" @contact="bindContact" @error="bindError" @getphonenumber="bindGetPhoneNumber" @getuserinfo="bindGetUserInfo" @launchapp="bindLaunchApp" @opensetting="bindOpenSetting" custom-class="van-goods-action-icon" size="large" square>
  <view class="van-goods-action-icon__content">
    <van-icon :dot="dot" :info="info" :name="icon" class="van-goods-action-icon__icon" custom-class="icon-class" size="20px" v-if="icon"></van-icon>
    <slot name="icon"></slot>
    <text class="text-class">{{ text }}</text>
  </view>
</van-button>
</template>


<script>

global['__wxRoute'] = 'lib/vant-weapp/goods-action-icon/index';
import {VantComponent} from '../common/component';
import {link} from '../mixins/link';
import {button} from '../mixins/button';
import {openType} from '../mixins/open-type';

VantComponent({
    classes: ['icon-class', 'text-class'],
    mixins: [link, button, openType],
    props: {
        text: String,
        dot: Boolean,
        info: String,
        icon: String,
        disabled: Boolean,
        loading: Boolean
    },
    methods: {
        onClick(event) {
            this.$emit('click', event.detail);
            this.jumpLink();
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/goods-action-icon/index'];
</script>
<style>
@import "./index.css";
</style>
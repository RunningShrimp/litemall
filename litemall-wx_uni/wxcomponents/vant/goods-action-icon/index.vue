<template>
    <uni-shadow-root class="vant-goods-action-icon-index">
        <van-button :app-parameter="appParameter" :business-id="businessId" :disabled="disabled" :id="id" :lang="lang"
                    :loading="loading" :open-type="openType" :send-message-img="sendMessageImg"
                    :send-message-path="sendMessagePath" :send-message-title="sendMessageTitle"
                    :session-from="sessionFrom" :show-message-card="showMessageCard" @click="onClick"
                    @contact="bindContact" @error="bindError" @getphonenumber="bindGetPhoneNumber"
                    @getuserinfo="bindGetUserInfo" @launchapp="bindLaunchApp" @opensetting="bindOpenSetting"
                    custom-class="van-goods-action-icon" size="large" square>
            <view class="van-goods-action-icon__content">
                <van-icon :dot="dot" :info="info" :name="icon" class="van-goods-action-icon__icon"
                          custom-class="icon-class" size="20px" v-if="icon"></van-icon>
                <slot name="icon"></slot>
                <text class="text-class">{{ text }}</text>
            </view>
        </van-button>
    </uni-shadow-root>
</template>

<script>
    import VanIcon from '../icon/index.vue'
    import VanButton from '../button/index.vue'
    import {VantComponent} from '../common/component';
    import {link} from '../mixins/link';
    import {button} from '../mixins/button';
    import {openType} from '../mixins/open-type';

    global['__wxVueOptions'] = {components: {'van-icon': VanIcon, 'van-button': VanButton}}

    global['__wxRoute'] = 'vant/goods-action-icon/index'
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
    export default global['__wxComponents']['vant/goods-action-icon/index']
</script>
<style platform="mp-weixin">
    @import '../common/index.css';

    .van-goods-action-icon {
        border: none !important;
        width: 50px !important;
        width: var(--goods-action-icon-height, 50px) !important
    }

    .van-goods-action-icon__content {
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        flex-direction: column;
        -webkit-justify-content: center;
        justify-content: center;
        height: 100%;
        line-height: 1;
        font-size: 10px;
        font-size: var(--goods-action-icon-font-size, 10px);
        color: #646566;
        color: var(--goods-action-icon-text-color, #646566)
    }

    .van-goods-action-icon__icon {
        margin-bottom: 4px
    }
</style>
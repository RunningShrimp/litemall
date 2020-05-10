<template>
<van-button :app-parameter="appParameter" :business-id="businessId" :color="color" :custom-class="utils.bem('goods-action-button', [type, { first: isFirst, last: isLast }])" :disabled="disabled" :id="id" :lang="lang" :loading="loading" :open-type="openType" :send-message-img="sendMessageImg" :send-message-path="sendMessagePath" :send-message-title="sendMessageTitle" :session-from="sessionFrom" :show-message-card="showMessageCard" :type="type" @click="onClick" @contact="bindContact" @error="bindError" @getphonenumber="bindGetPhoneNumber" @getuserinfo="bindGetUserInfo" @launchapp="bindLaunchApp" @opensetting="bindOpenSetting" square>{{ text }}</van-button>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

global['__wxRoute'] = 'lib/vant-weapp/goods-action-button/index';
import {VantComponent} from '../common/component';
import {link} from '../mixins/link';
import {button} from '../mixins/button';
import {openType} from '../mixins/open-type';

VantComponent({
    mixins: [link, button, openType],
    relation: {
        type: 'ancestor',
        name: 'goods-action',
        linked(parent) {
            this.parent = parent;
        }
    },
    props: {
        text: String,
        color: String,
        loading: Boolean,
        disabled: Boolean,
        type: {
            type: String,
            value: 'danger'
        }
    },
    mounted() {
        this.updateStyle();
    },
    methods: {
        onClick(event) {
            this.$emit('click', event.detail);
            this.jumpLink();
        },
        updateStyle() {
            const { children = [] } = this.parent;
            const index = children.indexOf(this);
            this.setData({
                isFirst: index === 0,
                isLast: index === children.length - 1
            });
        }
    }
});

export default global['__wxComponents']['lib/vant-weapp/goods-action-button/index'];
</script>
<style>
@import "./index.css";
</style>
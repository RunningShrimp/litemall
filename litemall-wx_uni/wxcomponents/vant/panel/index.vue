<template>
    <uni-shadow-root class="vant-panel-index">
        <view class="van-panel van-hairline--top-bottom custom-class">
            <van-cell :label="desc" :title="title" :value="status" custom-class="header-class"
                      v-if="title || desc || status" value-class="van-panel__header-value"></van-cell>
            <slot name="header" v-else></slot>

            <view class="van-panel__content">
                <slot></slot>
            </view>

            <view class="van-panel__footer van-hairline--top footer-class" v-if="useFooterSlot">
                <slot name="footer"></slot>
            </view>
        </view>
    </uni-shadow-root>
</template>

<script>
    import VanCell from '../cell/index.vue'
    import {VantComponent} from '../common/component';

    global['__wxVueOptions'] = {components: {'van-cell': VanCell}}

    global['__wxRoute'] = 'vant/panel/index'
    VantComponent({
        classes: ['header-class', 'footer-class'],
        props: {
            desc: String,
            title: String,
            status: String,
            useFooterSlot: Boolean
        }
    });
    export default global['__wxComponents']['vant/panel/index']
</script>
<style platform="mp-weixin">
    @import '../common/index.css';

    .van-panel {
        background: #fff;
        background: var(--panel-background-color, #fff)
    }

    .van-panel__header-value {
        color: #ee0a24;
        color: var(--panel-header-value-color, #ee0a24)
    }

    .van-panel__footer {
        padding: 8px 16px;
        padding: var(--panel-footer-padding, 8px 16px)
    }
</style>
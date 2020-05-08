<template>
    <van-transition :custom-style="'z-index: ' + zIndex + ';'" :show="show" @tap="onTap"
                    custom-class="van-notify__container" name="slide-down">
        <view :class="'van-notify van-notify--' + type" :style="'background:' + background + ';color:' + color + ';'">
            <view class="van-notify__safe-area" v-if="safeAreaInsetTop"></view>
            <text>{{ message }}</text>
        </view>
    </van-transition>
</template>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/notify/index';
    import {VantComponent} from '../common/component';
    import {WHITE} from '../common/color';

    VantComponent({
        props: {
            message: String,
            background: String,
            type: {
                type: String,
                value: 'danger'
            },
            color: {
                type: String,
                value: WHITE
            },
            duration: {
                type: Number,
                value: 3000
            },
            zIndex: {
                type: Number,
                value: 110
            },
            safeAreaInsetTop: {
                type: Boolean,
                value: false
            }
        },
        created() {
            const {statusBarHeight} = wx.getSystemInfoSync();
            this.setData({statusBarHeight});
        },
        methods: {
            show() {
                const {duration, onOpened} = this.data;
                clearTimeout(this.timer);
                this.setData({
                    show: true
                }, onOpened);
                if (duration > 0 && duration !== Infinity) {
                    this.timer = setTimeout(() => {
                        this.hide();
                    }, duration);
                }
            },
            hide() {
                const {onClose} = this.data;
                clearTimeout(this.timer);
                this.setData({
                    show: false
                }, onClose);
            },
            onTap(event) {
                const {onClick} = this.data;
                if (onClick) {
                    onClick(event.detail);
                }
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/notify/index'];
</script>
<style>
    @import "./index.css";
</style>
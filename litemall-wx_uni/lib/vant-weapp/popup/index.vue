<template>
    <view>
        <van-overlay :custom-style="overlayStyle" :duration="duration" :show="show" :z-index="zIndex"
                     @click="onClickOverlay" v-if="overlay"></van-overlay>
        <view :class="'custom-class ' + classes + ' ' + utils.bem('popup', [position, { round, safe: safeAreaInsetBottom, safeTop: safeAreaInsetTop }])"
              :style="'z-index: ' + zIndex + '; -webkit-transition-duration:' + currentDuration + 'ms; transition-duration:' + currentDuration + 'ms; ' + ( display ? '' : 'display: none;' ) + ';' + customStyle"
              @transitionend="onTransitionEnd" v-if="inited">
            <slot></slot>
            <van-icon :class="'van-popup__close-icon van-popup__close-icon--' + closeIconPosition" :name="closeIcon"
                      @tap="onClickCloseIcon" v-if="closeable"></van-icon>
        </view>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/popup/index';
    import {VantComponent} from '../common/component';
    import {transition} from '../mixins/transition';

    VantComponent({
        classes: [
            'enter-class',
            'enter-active-class',
            'enter-to-class',
            'leave-class',
            'leave-active-class',
            'leave-to-class'
        ],
        mixins: [transition(false)],
        props: {
            round: Boolean,
            closeable: Boolean,
            customStyle: String,
            overlayStyle: String,
            transition: {
                type: String,
                observer: 'observeClass'
            },
            zIndex: {
                type: Number,
                value: 100
            },
            overlay: {
                type: Boolean,
                value: true
            },
            closeIcon: {
                type: String,
                value: 'cross'
            },
            closeIconPosition: {
                type: String,
                value: 'top-right'
            },
            closeOnClickOverlay: {
                type: Boolean,
                value: true
            },
            position: {
                type: String,
                value: 'center',
                observer: 'observeClass'
            },
            safeAreaInsetBottom: {
                type: Boolean,
                value: true
            },
            safeAreaInsetTop: {
                type: Boolean,
                value: false
            }
        },
        created() {
            this.observeClass();
        },
        methods: {
            onClickCloseIcon() {
                this.$emit('close');
            },
            onClickOverlay() {
                this.$emit('click-overlay');
                if (this.data.closeOnClickOverlay) {
                    this.$emit('close');
                }
            },
            observeClass() {
                const {transition, position} = this.data;
                const updateData = {
                    name: transition || position
                };
                if (transition === 'none') {
                    updateData.duration = 0;
                }
                this.setData(updateData);
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/popup/index'];
</script>
<style>
    @import "./index.css";
</style>
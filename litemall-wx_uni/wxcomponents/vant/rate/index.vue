<template>
    <uni-shadow-root class="vant-rate-index">
        <view @touchmove="onTouchMove" class="van-rate custom-class">
            <view :key="item.index" :style="'padding-right: '+(index !== count - 1 ? utils.addUnit(gutter) : '')"
                  class="van-rate__item" v-for="(item,index) in (count)">
                <van-icon :color="disabled ? disabledColor : index + 1 <= innerValue ? color : voidColor"
                          :data-score="index" :name="index + 1 <= innerValue ? icon : voidIcon"
                          :style="'font-size: '+(utils.addUnit(size))" @click="onSelect" class="van-rate__icon"
                          custom-class="icon-class"></van-icon>

                <van-icon :class="utils.bem('rate__icon', ['half'])"
                          :color="disabled ? disabledColor : index + 0.5 <= innerValue ? color : voidColor"
                          :data-score="index - 0.5" :name="index + 0.5 <= innerValue ? icon : voidIcon"
                          :style="'font-size: '+(utils.addUnit(size))" @click="onSelect" custom-class="icon-class"
                          v-if="allowHalf"></van-icon>
            </view>
        </view>
    </uni-shadow-root>
</template>
<wxs module="utils" src="../wxs/utils.wxs"></wxs>
<script>
    import VanIcon from '../icon/index.vue'
    import {VantComponent} from '../common/component';

    global['__wxVueOptions'] = {components: {'van-icon': VanIcon}}

    global['__wxRoute'] = 'vant/rate/index'
    VantComponent({
        field: true,
        classes: ['icon-class'],
        props: {
            value: {
                type: Number,
                observer(value) {
                    if (value !== this.data.innerValue) {
                        this.setData({innerValue: value});
                    }
                }
            },
            readonly: Boolean,
            disabled: Boolean,
            allowHalf: Boolean,
            size: null,
            icon: {
                type: String,
                value: 'star'
            },
            voidIcon: {
                type: String,
                value: 'star-o'
            },
            color: {
                type: String,
                value: '#ffd21e'
            },
            voidColor: {
                type: String,
                value: '#c7c7c7'
            },
            disabledColor: {
                type: String,
                value: '#bdbdbd'
            },
            count: {
                type: Number,
                value: 5
            },
            gutter: null,
            touchable: {
                type: Boolean,
                value: true
            }
        },
        data: {
            innerValue: 0
        },
        methods: {
            onSelect(event) {
                const {data} = this;
                const {score} = event.currentTarget.dataset;
                if (!data.disabled && !data.readonly) {
                    this.setData({innerValue: score + 1});
                    this.$emit('input', score + 1);
                    this.$emit('change', score + 1);
                }
            },
            onTouchMove(event) {
                const {touchable} = this.data;
                if (!touchable)
                    return;
                const {clientX} = event.touches[0];
                this.getRect('.van-rate__icon', true).then((list) => {
                    const target = list
                        .sort(item => item.right - item.left)
                        .find(item => clientX >= item.left && clientX <= item.right);
                    if (target != null) {
                        this.onSelect(Object.assign(Object.assign({}, event), {currentTarget: target}));
                    }
                });
            }
        }
    });
    export default global['__wxComponents']['vant/rate/index']
</script>
<style platform="mp-weixin">
    @import '../common/index.css';

    .van-rate {
        display: -webkit-inline-flex;
        display: inline-flex;
        -webkit-user-select: none;
        user-select: none
    }

    .van-rate__item {
        position: relative;
        padding: 0 2px;
        padding: 0 var(--rate-horizontal-padding, 2px)
    }

    .van-rate__icon {
        display: block;
        height: 1em;
        font-size: 20px;
        font-size: var(--rate-icon-size, 20px)
    }

    .van-rate__icon--half {
        position: absolute;
        top: 0;
        width: .5em;
        overflow: hidden;
        left: 2px;
        left: var(--rate-horizontal-padding, 2px)
    }
</style>
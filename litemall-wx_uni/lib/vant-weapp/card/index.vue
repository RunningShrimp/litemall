<template>
    <view class="custom-class van-card">
        <view :class="utils.bem('card__header', { center: centered })">
            <view @tap="onClickThumb" class="van-card__thumb">
                <image :lazy-load="lazyLoad" :mode="thumbMode" :src="thumb" class="van-card__img thumb-class"
                       v-if="thumb"></image>
                <slot name="thumb"></slot>
                <van-tag custom-class="van-card__tag" mark type="danger" v-if="tag">{{ tag }}</van-tag>
            </view>

            <view class="van-card__content">
                <view class="van-card__title title-class" v-if="title">{{ title }}</view>
                <slot name="title" v-else></slot>

                <view class="van-card__desc desc-class" v-if="desc">{{ desc }}</view>
                <slot name="desc" v-else></slot>

                <slot name="tags"></slot>

                <view class="van-card__bottom">
                    <view class="van-card__price price-class" v-if="price || price === 0">{{ currency }} {{ price }}
                    </view>
                    <view class="van-card__origin-price origin-price-class" v-if="originPrice || originPrice === 0">{{
                        currency }} {{ originPrice }}
                    </view>
                    <view class="van-card__num num-class" v-if="num">x {{ num }}</view>
                    <slot name="bottom"></slot>
                </view>
            </view>
        </view>

        <view class="van-card__footer">
            <slot name="footer"></slot>
        </view>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/card/index';
    import {link} from '../mixins/link';
    import {VantComponent} from '../common/component';

    VantComponent({
        classes: [
            'num-class',
            'desc-class',
            'thumb-class',
            'title-class',
            'price-class',
            'origin-price-class',
        ],
        mixins: [link],
        props: {
            tag: String,
            num: String,
            desc: String,
            thumb: String,
            title: String,
            price: String,
            centered: Boolean,
            lazyLoad: Boolean,
            thumbLink: String,
            originPrice: String,
            thumbMode: {
                type: String,
                value: 'aspectFit'
            },
            currency: {
                type: String,
                value: '¥'
            }
        },
        methods: {
            onClickThumb() {
                this.jumpLink('thumbLink');
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/card/index'];
</script>
<style>
    @import "./index.css";
</style>
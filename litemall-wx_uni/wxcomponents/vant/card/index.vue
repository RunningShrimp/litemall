<template>
<uni-shadow-root class="vant-card-index"><view class="custom-class van-card">
  <view :class="utils.bem('card__header', { center: centered })">
    <view @click="onClickThumb" class="van-card__thumb">
      <image :lazy-load="lazyLoad" :mode="thumbMode" :src="thumb" class="van-card__img thumb-class" v-if="thumb"></image>
      <slot name="thumb"></slot>
      <van-tag custom-class="van-card__tag" mark type="danger" v-if="tag">
        {{ tag }}
      </van-tag>
    </view>

    <view class="van-card__content">
      <view class="van-card__title title-class" v-if="title">{{ title }}</view>
      <slot name="title" v-else></slot>

      <view class="van-card__desc desc-class" v-if="desc">{{ desc }}</view>
      <slot name="desc" v-else></slot>

      <slot name="tags"></slot>

      <view class="van-card__bottom">
        <view class="van-card__price price-class" v-if="price || price === 0">{{ currency }} {{ price }}</view>
        <view class="van-card__origin-price origin-price-class" v-if="originPrice || originPrice === 0">{{ currency }} {{ originPrice }}</view>
        <view class="van-card__num num-class" v-if="num">x {{ num }}</view>
        <slot name="bottom"></slot>
      </view>
    </view>
  </view>

  <view class="van-card__footer">
    <slot name="footer"></slot>
  </view>
</view></uni-shadow-root>
</template>
<wxs module="utils" src="../wxs/utils.wxs"></wxs>
<script>
    import VanTag from '../tag/index.vue'
    import {link} from '../mixins/link';
    import {VantComponent} from '../common/component';

    global['__wxVueOptions'] = {components:{'van-tag': VanTag}}

global['__wxRoute'] = 'vant/card/index'
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
export default global['__wxComponents']['vant/card/index']
</script>
<style platform="mp-weixin">
@import '../common/index.css';.van-card{position:relative;box-sizing:border-box;padding:8px 16px;padding:var(--card-padding,8px 16px);font-size:12px;font-size:var(--card-font-size,12px);color:#323233;color:var(--card-text-color,#323233);background-color:#fafafa;background-color:var(--card-background-color,#fafafa)}.van-card__header{display:-webkit-flex;display:flex}.van-card__header--center{-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center}.van-card__thumb{position:relative;-webkit-flex:none;flex:none;width:90px;width:var(--card-thumb-size,90px);height:90px;height:var(--card-thumb-size,90px);margin-right:8px;margin-right:var(--padding-xs,8px)}.van-card__thumb:empty{display:none}.van-card__img{width:100%;height:100%}.van-card__content{position:relative;-webkit-flex:1;flex:1;min-width:0}.van-card__desc,.van-card__title{word-wrap:break-word}.van-card__title{font-weight:700;line-height:16px;line-height:var(--card-title-line-height,16px)}.van-card__desc{line-height:20px;line-height:var(--card-desc-line-height,20px);color:#646566;color:var(--card-desc-color,#646566)}.van-card__bottom{line-height:20px}.van-card__price{display:inline-block;font-weight:700;color:#ee0a24;color:var(--card-price-color,#ee0a24)}.van-card__origin-price{display:inline-block;margin-left:5px;text-decoration:line-through;font-size:10px;font-size:var(--card-origin-price-font-size,10px);color:#646566;color:var(--card-origin-price-color,#646566)}.van-card__num{float:right}.van-card__tag{position:absolute;top:2px;left:0}.van-card__footer{-webkit-flex:none;flex:none;width:100%;text-align:right}
</style>
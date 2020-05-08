<template>
    <view :class="utils.bem('grid-item', { square })" :style="style" @tap="onClick">
        <view :class="( utils.bem('grid-item__content', { center, square, clickable, surround: border && gutter }) ) + ' ' + ( border ? 'van-hairline--surround' : '' )"
              :style="contentStyle">
            <block v-if="useSlot">
                <slot></slot>
            </block>
            <block v-else>
                <view class="van-grid-item__icon">
                    <van-icon :dot="dot" :info="info" :name="icon" v-if="icon"></van-icon>
                    <slot name="icon" v-else></slot>
                </view>
                <view class="van-grid-item__text">
                    <text v-if="text">{{ text }}</text>
                    <slot name="text" v-else></slot>
                </view>
            </block>
        </view>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/grid-item/index';
    import {link} from '../mixins/link';
    import {VantComponent} from '../common/component';
    import {addUnit} from '../common/utils';

    VantComponent({
        relation: {
            name: 'grid',
            type: 'ancestor',
            linked(parent) {
                this.parent = parent;
            }
        },
        mixins: [link],
        props: {
            icon: String,
            dot: Boolean,
            info: null,
            text: String,
            useSlot: Boolean
        },
        mounted() {
            this.updateStyle();
        },
        methods: {
            updateStyle() {
                if (!this.parent) {
                    return;
                }
                const {data, children} = this.parent;
                const {columnNum, border, square, gutter, clickable, center} = data;
                const width = `${100 / columnNum}%`;
                const styleWrapper = [];
                styleWrapper.push(`width: ${width}`);
                if (square) {
                    styleWrapper.push(`padding-top: ${width}`);
                }
                if (gutter) {
                    const gutterValue = addUnit(gutter);
                    styleWrapper.push(`padding-right: ${gutterValue}`);
                    const index = children.indexOf(this);
                    if (index >= columnNum) {
                        styleWrapper.push(`margin-top: ${gutterValue}`);
                    }
                }
                let contentStyle = '';
                if (square && gutter) {
                    const gutterValue = addUnit(gutter);
                    contentStyle = `
          right: ${gutterValue};
          bottom: ${gutterValue};
          height: auto;
        `;
                }
                this.setData({
                    style: styleWrapper.join('; '),
                    contentStyle,
                    center,
                    border,
                    square,
                    gutter,
                    clickable
                });
            },
            onClick() {
                this.$emit('click');
                this.jumpLink();
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/grid-item/index'];
</script>
<style>
    @import "./index.css";
</style>
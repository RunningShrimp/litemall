<template>
    <view :class="'custom-class ' + utils.bem('col', [span]) + ' ' + ( offset ? 'van-col--offset-' + offset : '' )"
          :style="style">
        <slot></slot>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/col/index';
    import {VantComponent} from '../common/component';

    VantComponent({
        relation: {
            name: 'row',
            type: 'ancestor'
        },
        props: {
            span: Number,
            offset: Number
        },
        data: {
            style: ''
        },
        methods: {
            setGutter(gutter) {
                const padding = `${gutter / 2}px`;
                const style = gutter ? `padding-left: ${padding}; padding-right: ${padding};` : '';
                if (style !== this.data.style) {
                    this.setData({style});
                }
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/col/index'];
</script>
<style>
    @import "./index.css";
</style>
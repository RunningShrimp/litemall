<template>
    <view :class="'van-grid ' + ( border && !gutter ? 'van-hairline--top' : '' )" :style="style">
        <slot></slot>
    </view>
</template>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/grid/index';
    import {VantComponent} from '../common/component';
    import {addUnit} from '../common/utils';

    VantComponent({
        relation: {
            name: 'grid-item',
            type: 'descendant',
            linked(child) {
                this.children.push(child);
            },
            unlinked(child) {
                this.children = this.children.filter((item) => item !== child);
            }
        },
        props: {
            square: {
                type: Boolean,
                observer: 'updateChildren'
            },
            gutter: {
                type: [Number, String],
                value: 0,
                observer: 'updateChildren'
            },
            clickable: {
                type: Boolean,
                observer: 'updateChildren'
            },
            columnNum: {
                type: Number,
                value: 4,
                observer: 'updateChildren'
            },
            center: {
                type: Boolean,
                value: true,
                observer: 'updateChildren'
            },
            border: {
                type: Boolean,
                value: true,
                observer: 'updateChildren'
            }
        },
        beforeCreate() {
            this.children = [];
        },
        created() {
            const {gutter} = this.data;
            if (gutter) {
                this.setData({
                    style: `padding-left: ${addUnit(gutter)}`
                });
            }
        },
        methods: {
            updateChildren() {
                this.children.forEach((child) => {
                    child.updateStyle();
                });
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/grid/index'];
</script>
<style>
    @import "./index.css";
</style>
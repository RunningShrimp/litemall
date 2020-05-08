<template>
    <view :class="'custom-class van-collapse ' + ( border ? 'van-hairline--top-bottom' : '' )">
        <slot></slot>
    </view>
</template>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/collapse/index';
    import {VantComponent} from '../common/component';

    VantComponent({
        relation: {
            name: 'collapse-item',
            type: 'descendant',
            linked(child) {
                this.children.push(child);
            },
            unlinked(child) {
                this.children = this.children.filter((item) => item !== child);
            }
        },
        props: {
            value: {
                type: null,
                observer: 'updateExpanded'
            },
            accordion: {
                type: Boolean,
                observer: 'updateExpanded'
            },
            border: {
                type: Boolean,
                value: true
            }
        },
        beforeCreate() {
            this.children = [];
        },
        methods: {
            updateExpanded() {
                this.children.forEach((child) => {
                    child.updateExpanded();
                });
            },
            switch(name, expanded) {
                const {accordion, value} = this.data;
                if (!accordion) {
                    name = expanded
                        ? (value || []).concat(name)
                        : (value || []).filter((activeName) => activeName !== name);
                } else {
                    name = expanded ? name : '';
                }
                this.$emit('change', name);
                this.$emit('input', name);
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/collapse/index'];
</script>
<style>
    @import "./index.css";
</style>
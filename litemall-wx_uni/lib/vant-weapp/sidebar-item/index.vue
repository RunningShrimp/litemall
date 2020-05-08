<template>
    <view :class="( utils.bem('sidebar-item', { selected, disabled }) ) + ' ' + ( selected ? 'active-class' : '' ) + ' ' + ( disabled ? 'disabled-class' : '' ) + ' custom-class'"
          @tap="onClick" hover-class="van-sidebar-item--hover" hover-stay-time="70">
        <view class="van-sidebar-item__text">
            <van-info :dot="dot" :info="info" custom-style="right: 4px" v-if="info !== null || dot"></van-info>
            {{ title }}
        </view>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/sidebar-item/index';
    import {VantComponent} from '../common/component';

    VantComponent({
        classes: [
            'active-class',
            'disabled-class',
        ],
        relation: {
            type: 'ancestor',
            name: 'sidebar',
            linked(target) {
                this.parent = target;
            }
        },
        props: {
            dot: Boolean,
            info: null,
            title: String,
            disabled: Boolean
        },
        methods: {
            onClick() {
                const {parent} = this;
                if (!parent || this.data.disabled) {
                    return;
                }
                const index = parent.children.indexOf(this);
                parent.setActive(index).then(() => {
                    this.$emit('click', index);
                    parent.$emit('change', index);
                });
            },
            setActive(selected) {
                return this.setData({selected});
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/sidebar-item/index'];
</script>
<style>
    @import "./index.css";
</style>
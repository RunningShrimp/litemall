<template>
    <view :style="'height: ' + innerHeight" class="van-tree-select">
        <scroll-view class="van-tree-select__nav" scroll-y>
            <van-sidebar :active-key="mainActiveIndex" @change="onClickNav" custom-class="van-tree-select__nav__inner">
                <van-sidebar-item :disabled="item.disabled" :key="index" :title="item.text"
                                  active-class="main-active-class" custom-class="main-item-class"
                                  disabled-class="main-disabled-class"
                                  v-for="(item, index) in items"></van-sidebar-item>
            </van-sidebar>
        </scroll-view>
        <scroll-view class="van-tree-select__content" scroll-y>
            <slot name="content"></slot>
            <view :class="'van-ellipsis content-item-class ' + ( utils.bem('tree-select__item', { active: wxs.isActive(activeId, item.id), disabled: item.disabled }) ) + ' ' + ( wxs.isActive(activeId, item.id) ? 'content-active-class' : '' ) + ' ' + ( item.disabled ? 'content-disabled-class' : '' )"
                  :data-item="item" :key="id" @tap="onSelectItem" v-for="(item, id) in subItems">{{ item.text }}
                <van-icon class="van-tree-select__selected" name="checked" size="16px"
                          v-if="wxs.isActive(activeId, item.id)"></van-icon>
            </view>
        </scroll-view>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>
<script lang="wxs" module="wxs" src="./index.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/tree-select/index';
    import {VantComponent} from '../common/component';
    import {addUnit} from '../common/utils';

    VantComponent({
        classes: [
            'main-item-class',
            'content-item-class',
            'main-active-class',
            'content-active-class',
            'main-disabled-class',
            'content-disabled-class'
        ],
        props: {
            items: {
                type: Array,
                observer: 'updateSubItems'
            },
            activeId: null,
            mainActiveIndex: {
                type: Number,
                value: 0,
                observer: 'updateSubItems'
            },
            height: {
                type: [Number, String],
                value: 300,
                observer: 'updateHeight'
            },
            max: {
                type: Number,
                value: Infinity
            }
        },
        data: {
            subItems: []
        },
        created() {
            this.updateHeight();
        },
        methods: {
            // 当一个子项被选择时
            onSelectItem(event) {
                const {item} = event.currentTarget.dataset;
                const isArray = Array.isArray(this.data.activeId);
                // 判断有没有超出右侧选择的最大数
                const isOverMax = isArray && this.data.activeId.length >= this.data.max;
                // 判断该项有没有被选中, 如果有被选中，则忽视是否超出的条件
                const isSelected = isArray
                    ? this.data.activeId.indexOf(item.id) > -1
                    : this.data.activeId === item.id;
                if (!item.disabled && (!isOverMax || isSelected)) {
                    this.$emit('click-item', item);
                }
            },
            // 当一个导航被点击时
            onClickNav(event) {
                const index = event.detail;
                const item = this.data.items[index];
                if (!item.disabled) {
                    this.$emit('click-nav', {index});
                }
            },
            // 更新子项列表
            updateSubItems() {
                const {items, mainActiveIndex} = this.data;
                const {children = []} = items[mainActiveIndex] || {};
                return this.set({subItems: children});
            },
            updateHeight() {
                this.setData({
                    innerHeight: addUnit(this.data.height)
                });
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/tree-select/index'];
</script>
<style>
    @import "./index.css";
</style>
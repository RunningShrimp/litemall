<template>
    <view class="van-dropdown-menu van-dropdown-menu--top-bottom">
        <view :class="utils.bem('dropdown-menu__item', { disabled: item.disabled })" :data-index="index" :key="index"
              @tap="onTitleTap" v-for="(item, index) in itemListData">
            <view :class="item.titleClass + ' ' + ( utils.bem('dropdown-menu__title', { active: item.showPopup, down: item.showPopup === (direction === 'down') }) )"
                  :style="item.showPopup ? 'color:' + activeColor : ''">
                <view class="van-ellipsis">{{ computed.displayTitle(item) }}</view>
            </view>
        </view>

        <slot></slot>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>
<script lang="wxs" module="computed" src="./index.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/dropdown-menu/index';
    import {VantComponent} from '../common/component';
    import {addUnit} from '../common/utils';

    let ARRAY = [];
    VantComponent({
        field: true,
        relation: {
            name: 'dropdown-item',
            type: 'descendant',
            linked(target) {
                this.children.push(target);
                this.updateItemListData();
            },
            unlinked(target) {
                this.children = this.children.filter((child) => child !== target);
                this.updateItemListData();
            }
        },
        props: {
            activeColor: {
                type: String,
                observer: 'updateChildrenData'
            },
            overlay: {
                type: Boolean,
                value: true,
                observer: 'updateChildrenData'
            },
            zIndex: {
                type: Number,
                value: 10
            },
            duration: {
                type: Number,
                value: 200,
                observer: 'updateChildrenData'
            },
            direction: {
                type: String,
                value: 'down',
                observer: 'updateChildrenData'
            },
            closeOnClickOverlay: {
                type: Boolean,
                value: true,
                observer: 'updateChildrenData'
            },
            closeOnClickOutside: {
                type: Boolean,
                value: true
            }
        },
        data: {
            itemListData: []
        },
        beforeCreate() {
            const {windowHeight} = wx.getSystemInfoSync();
            this.windowHeight = windowHeight;
            this.children = [];
            ARRAY.push(this);
        },
        destroyed() {
            ARRAY = ARRAY.filter(item => item !== this);
        },
        methods: {
            updateItemListData() {
                this.setData({
                    itemListData: this.children.map((child) => child.data)
                });
            },
            updateChildrenData() {
                this.children.forEach((child) => {
                    child.updateDataFromParent();
                });
            },
            toggleItem(active) {
                this.children.forEach((item, index) => {
                    const {showPopup} = item.data;
                    if (index === active) {
                        item.toggle();
                    } else if (showPopup) {
                        item.toggle(false, {immediate: true});
                    }
                });
            },
            close() {
                this.children.forEach((child) => {
                    child.toggle(false, {immediate: true});
                });
            },
            getChildWrapperStyle() {
                const {zIndex, direction} = this.data;
                return this.getRect('.van-dropdown-menu').then((rect) => {
                    const {top = 0, bottom = 0} = rect;
                    const offset = direction === 'down' ? bottom : this.windowHeight - top;
                    let wrapperStyle = `z-index: ${zIndex};`;
                    if (direction === 'down') {
                        wrapperStyle += `top: ${addUnit(offset)};`;
                    } else {
                        wrapperStyle += `bottom: ${addUnit(offset)};`;
                    }
                    return wrapperStyle;
                });
            },
            onTitleTap(event) {
                const {index} = event.currentTarget.dataset;
                const child = this.children[index];
                if (!child.data.disabled) {
                    ARRAY.forEach(menuItem => {
                        if (menuItem &&
                            menuItem.data.closeOnClickOutside &&
                            menuItem !== this) {
                            menuItem.close();
                        }
                    });
                    this.toggleItem(index);
                }
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/dropdown-menu/index'];
</script>
<style>
    @import "./index.css";
</style>
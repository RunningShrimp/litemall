<template>
    <view :class="'van-collapse-item custom-class ' + ( index !== 0 ? 'van-hairline--top' : '' )">
        <van-cell :border="border && expanded" :class="utils.bem('collapse-item__title', { disabled, expanded })"
                  :clickable="clickable" :icon="icon" :is-link="isLink" :label="label" :title="title" :value="value"
                  @click="onClick" custom-class="van-cell" hover-class="van-cell--hover"
                  right-icon-class="van-cell__right-icon" title-class="title-class">
            <slot name="title" slot="title"></slot>
            <slot name="icon" slot="icon"></slot>
            <slot name="value"></slot>
            <slot name="right-icon" slot="right-icon"></slot>
        </van-cell>
        <view :class="utils.bem('collapse-item__wrapper', { transition })" :style="'height: ' + contentHeight + ';'"
              @transitionend="onTransitionEnd">
            <view class="van-collapse-item__content content-class">
                <slot></slot>
            </view>
        </view>
    </view>
</template>

<script lang="wxs" module="utils" src="../wxs/utils.wxs"></script>


<script>

    global['__wxRoute'] = 'lib/vant-weapp/collapse-item/index';
    import {VantComponent} from '../common/component';

    const nextTick = () => new Promise(resolve => setTimeout(resolve, 20));
    VantComponent({
        classes: ['title-class', 'content-class'],
        relation: {
            name: 'collapse',
            type: 'ancestor',
            linked(parent) {
                this.parent = parent;
            }
        },
        props: {
            name: null,
            title: null,
            value: null,
            icon: String,
            label: String,
            disabled: Boolean,
            clickable: Boolean,
            border: {
                type: Boolean,
                value: true
            },
            isLink: {
                type: Boolean,
                value: true
            }
        },
        data: {
            contentHeight: 0,
            expanded: false,
            transition: false
        },
        mounted() {
            this.updateExpanded()
                .then(nextTick)
                .then(() => {
                    const data = {transition: true};
                    if (this.data.expanded) {
                        data.contentHeight = 'auto';
                    }
                    this.setData(data);
                });
        },
        methods: {
            updateExpanded() {
                if (!this.parent) {
                    return Promise.resolve();
                }
                const {value, accordion} = this.parent.data;
                const {children = []} = this.parent;
                const {name} = this.data;
                const index = children.indexOf(this);
                const currentName = name == null ? index : name;
                const expanded = accordion
                    ? value === currentName
                    : (value || []).some((name) => name === currentName);
                const stack = [];
                if (expanded !== this.data.expanded) {
                    stack.push(this.updateStyle(expanded));
                }
                stack.push(this.set({index, expanded}));
                return Promise.all(stack);
            },
            updateStyle(expanded) {
                return this.getRect('.van-collapse-item__content')
                    .then((rect) => rect.height)
                    .then((height) => {
                        if (expanded) {
                            return this.set({
                                contentHeight: height ? `${height}px` : 'auto'
                            });
                        }
                        return this.set({contentHeight: `${height}px`})
                            .then(nextTick)
                            .then(() => this.set({contentHeight: 0}));
                    });
            },
            onClick() {
                if (this.data.disabled) {
                    return;
                }
                const {name, expanded} = this.data;
                const index = this.parent.children.indexOf(this);
                const currentName = name == null ? index : name;
                this.parent.switch(currentName, !expanded);
            },
            onTransitionEnd() {
                if (this.data.expanded) {
                    this.setData({
                        contentHeight: 'auto'
                    });
                }
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/collapse-item/index'];
</script>
<style>
    @import "./index.css";
</style>
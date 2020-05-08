<template>
    <view>


        <view class="van-picker custom-class">
            <block data-attr="showToolbar, cancelButtonText, title, confirmButtonText" data-is="toolbar"
                   data-type="template" v-if="toolbarPosition === 'top'">
                <view class="van-picker__toolbar van-hairline--top-bottom toolbar-class" v-if="showToolbar">
                    <view @tap="emit" class="van-picker__cancel" data-type="cancel"
                          hover-class="van-picker__cancel--hover" hover-stay-time="70">{{cancelButtonText}}
                    </view>
                    <view class="van-picker__title van-ellipsis" v-if="title">{{title}}</view>
                    <view @tap="emit" class="van-picker__confirm" data-type="confirm"
                          hover-class="van-picker__confirm--hover" hover-stay-time="70">{{confirmButtonText}}
                    </view>
                </view>
            </block>
            <view class="van-picker__loading" v-if="loading">
                <loading color="#1989fa"></loading>
            </view>
            <view :style="'height: ' + ( itemHeight * visibleItemCount ) + 'px'" catch:touchmove="noop"
                  class="van-picker__columns">
                <picker-column :data-index="index" :default-index="item.defaultIndex || defaultIndex"
                               :initial-options="isSimple(columns) ? item : item.values" :item-height="itemHeight"
                               :key="index" :value-key="valueKey" :visible-item-count="visibleItemCount"
                               @change="onChange" active-class="active-class" class="van-picker__column"
                               custom-class="column-class"
                               v-for="(item, index) in isSimple(columns) ? [columns] : columns"></picker-column>
                <view :style="'height: ' + itemHeight + 'px'" class="van-picker__frame van-hairline--top-bottom"></view>
            </view>
            <block data-attr="showToolbar, cancelButtonText, title, confirmButtonText" data-is="toolbar"
                   data-type="template" v-if="toolbarPosition === 'bottom'">
                <view class="van-picker__toolbar van-hairline--top-bottom toolbar-class" v-if="showToolbar">
                    <view @tap="emit" class="van-picker__cancel" data-type="cancel"
                          hover-class="van-picker__cancel--hover" hover-stay-time="70">{{cancelButtonText}}
                    </view>
                    <view class="van-picker__title van-ellipsis" v-if="title">{{title}}</view>
                    <view @tap="emit" class="van-picker__confirm" data-type="confirm"
                          hover-class="van-picker__confirm--hover" hover-stay-time="70">{{confirmButtonText}}
                    </view>
                </view>
            </block>
        </view>
    </view>
</template>

<script lang="wxs" module="isSimple" src="./isSimple.wxs"></script>


<script>
    import pickerColumn from '../picker-column/index'
    import loading from '../loading/index'
    import {VantComponent} from '../common/component';
    import {pickerProps} from './shared';

    global['__wxVueOptions'] = {components: {'picker-column': pickerColumn, 'loading': loading}};
    global['__wxRoute'] = 'lib/vant-weapp/picker/index';

    VantComponent({
        classes: ['active-class', 'toolbar-class', 'column-class'],
        props: Object.assign(Object.assign({}, pickerProps), {
            valueKey: {
                type: String,
                value: 'text'
            }, toolbarPosition: {
                type: String,
                value: 'top'
            }, defaultIndex: {
                type: Number,
                value: 0
            }, columns: {
                type: Array,
                value: [],
                observer(columns = []) {
                    this.simple = columns.length && !columns[0].values;
                    this.children = this.selectAllComponents('.van-picker__column');
                    if (Array.isArray(this.children) && this.children.length) {
                        this.setColumns().catch(() => {
                        });
                    }
                }
            }
        }),
        beforeCreate() {
            this.children = [];
        },
        methods: {
            noop() {
            },
            setColumns() {
                const {data} = this;
                const columns = this.simple ? [{values: data.columns}] : data.columns;
                const stack = columns.map((column, index) => this.setColumnValues(index, column.values));
                return Promise.all(stack);
            },
            emit(event) {
                const {type} = event.currentTarget.dataset;
                if (this.simple) {
                    this.$emit(type, {
                        value: this.getColumnValue(0),
                        index: this.getColumnIndex(0)
                    });
                } else {
                    this.$emit(type, {
                        value: this.getValues(),
                        index: this.getIndexes()
                    });
                }
            },
            onChange(event) {
                if (this.simple) {
                    this.$emit('change', {
                        picker: this,
                        value: this.getColumnValue(0),
                        index: this.getColumnIndex(0)
                    });
                } else {
                    this.$emit('change', {
                        picker: this,
                        value: this.getValues(),
                        index: event.currentTarget.dataset.index
                    });
                }
            },
            // get column instance by index
            getColumn(index) {
                return this.children[index];
            },
            // get column value by index
            getColumnValue(index) {
                const column = this.getColumn(index);
                return column && column.getValue();
            },
            // set column value by index
            setColumnValue(index, value) {
                const column = this.getColumn(index);
                if (column == null) {
                    return Promise.reject(new Error('setColumnValue: 对应列不存在'));
                }
                return column.setValue(value);
            },
            // get column option index by column index
            getColumnIndex(columnIndex) {
                return (this.getColumn(columnIndex) || {}).data.currentIndex;
            },
            // set column option index by column index
            setColumnIndex(columnIndex, optionIndex) {
                const column = this.getColumn(columnIndex);
                if (column == null) {
                    return Promise.reject(new Error('setColumnIndex: 对应列不存在'));
                }
                return column.setIndex(optionIndex);
            },
            // get options of column by index
            getColumnValues(index) {
                return (this.children[index] || {}).data.options;
            },
            // set options of column by index
            setColumnValues(index, options, needReset = true) {
                const column = this.children[index];
                if (column == null) {
                    return Promise.reject(new Error('setColumnValues: 对应列不存在'));
                }
                const isSame = JSON.stringify(column.data.options) === JSON.stringify(options);
                if (isSame) {
                    return Promise.resolve();
                }
                return column.set({options}).then(() => {
                    if (needReset) {
                        column.setIndex(0);
                    }
                });
            },
            // get values of all columns
            getValues() {
                return this.children.map((child) => child.getValue());
            },
            // set values of all columns
            setValues(values) {
                const stack = values.map((value, index) => this.setColumnValue(index, value));
                return Promise.all(stack);
            },
            // get indexes of all columns
            getIndexes() {
                return this.children.map((child) => child.data.currentIndex);
            },
            // set indexes of all columns
            setIndexes(indexes) {
                const stack = indexes.map((optionIndex, columnIndex) => this.setColumnIndex(columnIndex, optionIndex));
                return Promise.all(stack);
            }
        }
    });

    export default global['__wxComponents']['lib/vant-weapp/picker/index'];
</script>
<style>
    @import "./index.css";
</style>
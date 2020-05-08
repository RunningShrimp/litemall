<template name="toolbar">
    <view class="van-picker__toolbar van-hairline--top-bottom toolbar-class" v-if="showToolbar">
        <view @tap="emit" class="van-picker__cancel" data-type="cancel" hover-class="van-picker__cancel--hover"
              hover-stay-time="70">{{cancelButtonText}}
        </view>
        <view class="van-picker__title van-ellipsis" v-if="title">{{title}}</view>
        <view @tap="emit" class="van-picker__confirm" data-type="confirm" hover-class="van-picker__confirm--hover"
              hover-stay-time="70">{{confirmButtonText}}
        </view>
    </view>
</template>
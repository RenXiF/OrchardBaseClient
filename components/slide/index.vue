<template>
	<!-- 滑动组件 -->
	<view class="flex_columns">
		<swiper class="swiperck" :autoplay="false" :interval="interval" :duration="duration"
			previous-margin="0rpx" next-margin="460rpx">
			<swiper-item class="" v-for="(item, index) in list" :key="index" v-if="item.yprice != 0">
				<view class="list_block bg_radius box_shadow flex_jufy_center flex_columns u-m-20"
					:style="{'background-color':item.show?'#FFE3C3' :'#ffffff','border-color':item.show?'#FFB639' :'#ffffff'}" @click="click(index)">
					<view class=" flex_center flex_columns" style="border-radius: 20rpx;">
						<view class="right_one flex_jufy_center">
							<money :money="item.yprice*10" :size="22" :showUnit="false" color="#fff"></money>
							<text class="u-font-xs ft-wh " style="">折</text>
						</view>
						<text class="u-font-lg ft-wh">{{item.tit}}</text>
						<money :money="item.price" thousandth :size="44" unitPosition="right" color="#FC8B00"></money>
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import money from '@/components/cn-money/cn-money.vue';
	export default {
		components: {
			money
		},
		name: "slide",
		props: {
			// vipT:{
			// 	type:Number,
			// 	default:0
			// },
			list: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data() {
			return {
				interval: 3000,
				duration: 500
			};
		},
		methods:{
			click(index){
				this.$emit('ckindex',index)
			}
		}
	}
</script>

<style lang="scss">
	.swiperck {
		max-height: 250rpx;
	}
	.right_one{
		width: 100rpx;
		position: absolute;
		right: 25rpx;
		top: 30rpx;
		background-color: #F64939;
		color: #FFFFFF;
		border-radius:  0 10rpx 0 10rpx;
	}
	.list_block {
		max-width: 100%;
		height: 200rpx;
		border-width: 4rpx;
		border-style: solid;
		image {
			max-width: 100%;
			border-radius: 10rpx;
		}
	}
</style>

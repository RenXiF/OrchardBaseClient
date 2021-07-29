<template>
	<view class="flex_columns index_video u-p-20">
		<view class="flex_columns u-m-b-20">
			<text class="u-font-xl ft-wh u-m-t-20">早上好</text>
			<text class="u-font-md ft-wh u-m-t-20">愿美味的美食给你带来美好的一天</text>
		</view>
		<view class="flex_rows flex_center ">
			<u-avatar src="/static/logo.png"></u-avatar>
			<text class="u-font-xl ft-wh u-m-l-20">遵义草莓种植园</text>
		</view>
		<HCard :cardDatas='data' @coreCK="corCK"></HCard>
		<view class="flex_jufy_center flex_columns " style="margin-top: 750rpx;">
			<!-- <text class="u-font-lg u-m-b-20 ft-wh">正在直播中......</text> -->
			<button type="default" class="ft-wh one_button" style="color: #FFFFFF; ">点击进入</button>
		</view>
	</view>
</template>

<script>
	import HCard from "@/components/hg-cards/hg-cards.vue";
	export default {
		components: {
			HCard
		},
		data() {
			return {
				data: [{
						name: '张1',
						color: '#aaff00',
						video:'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4'
					},
					{
						name: '张2',
						color: '#23ffde',
						video:'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4'
					},
					{
						name: '张3',
						color: '#78beff',
						video:'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4'
					},
					{
						name: '张4',
						color: '#d87dff',
						video:'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4'
					},
					// {
					// 	name: '张5',
					// 	color: '#ffc39b'
					// },
					// {
					// 	name: '张6',
					// 	color: '#ffcef7'
					// },
					// {
					// 	name: '张7',
					// 	color: '#eaff9d'
					// },
					// {
					// 	name: '张8',
					// 	color: '#8c92ff'
					// },
				]
			}
		},
		methods: {
			corCK(item){
				// console.log(item)
				uni.setStorageSync('videolist',item);
				this.doUrl('pages/video/video_details')
			}
		}
	}
</script>

<style lang="scss">
	.index_video{
		width: 100%;
		// height: 100%;
	}
	.one_button{
		background-image: linear-gradient(45deg, #F24735, #FC6F3B);
		border-radius: 40rpx;
		padding: 0 70rpx;
	}
</style>

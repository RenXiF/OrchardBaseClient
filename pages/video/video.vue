<template>
	<view class="flex_columns index_video u-p-20">
		<view class="flex_columns u-m-b-20">
			<text class="u-font-xl ft-wh u-m-t-20">{{titledat}}</text>
			<text class="u-font-md ft-wh u-m-t-20">愿美味的美食给你带来美好的一天</text>
		</view>
		<view class="flex_rows ">
			<u-avatar :src="datalist[inde].videoCover? datalist[inde].videoCover :'/static/logo.png'"></u-avatar>
			<text class="u-font-xl ft-wh u-m-l-20">{{datalist[inde].title}}</text>
		</view>
		<HCard :cardDatas='datalist' @coreCK="corCK" @coreIndex="indexc"></HCard>
		<view class="flex_jufy_center flex_columns " style="margin-top: 750rpx;">
			<button type="default" class="ft-wh one_button" style="color: #FFFFFF; "
				@click="corCK(datalist[inde])">点击进入</button>
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
				datalist: [{
						color: '#FFFFFF'
					},
					{
						color: '#FFFFFF'
					},
					{
						color: '#FFFFFF'
					},
					{
						color: '#FFFFFF'
					}
				],
				inde: 0,
				titledat:'',
				list: ['#aaff00']
			}
		},
		onLoad() {

		},
		onShow() {
			this.videolist()
			this.datanew()
		},
		//下拉刷新
		onPullDownRefresh() {},
		//触底加载更多
		onReachBottom() {},
		methods: {
			datanew() {
				let now = new Date();
				let hour = now.getHours()
				if (hour < 6) {
					this.titledat = '凌晨好!'
				} else if (hour < 9) {
					this.titledat = '早上好!'
				} else if (hour < 12) {
					this.titledat = '上午好!'
				} else if (hour < 14) {
					this.titledat = '中午好!'
				} else if (hour < 17) {
					this.titledat = '下午好!'
				} else if (hour < 19) {
					this.titledat = '傍晚好!'
				} else if (hour < 22) {
					this.titledat = '晚上好!'
				} else {
					this.titledat = '夜里好!'
				}
			},
			corCK(item) {
				// console.log(item)
				uni.setStorageSync('videolist', item);
				this.doUrl('pages/video/video_details')
			},
			indexc(i) {
				this.inde = i
			},
			videolist() {
				let li = {
					// keyWord: "string",
					pageNum: 0,
					pageSize: 0
				};
				this.http.getApi('video/list', li, 'post').then(res => {
					console.log(res);
					this.datalist = res.list;

				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
		}
	}
</script>

<style lang="scss">
	.index_video {
		width: 100%;
		// height: 100%;
	}

	.one_button {
		background-image: linear-gradient(45deg, #F24735, #FC6F3B);
		border-radius: 40rpx;
		padding: 0 70rpx;
	}
</style>

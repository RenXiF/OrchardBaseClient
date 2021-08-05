<template>
	<!-- 我的优惠券页面 -->
	<view class="flex_columns ">
		<view class="comhome">
			<view class="comhome_bock" v-for="(item, index) in datalist" :key="index">
				<coupon :key="index" @couponCk="couponCk" v-bind:item="item" theme="#ff6c00" color="#f8f8f8"
					solid="#ff6c00" cktit="立即使用"></coupon>
			</view>

			<u-empty text="暂无记录" mode="list" v-if="datalist.length==0"></u-empty>
		</view>
	</view>
</template>

<script>
	import coupon from '@/components/coolc-coupon/coolc-coupon'; //优惠券组件
	export default {
		components: {
			coupon
		},
		data() {
			return {
				loadStatus: 'nomore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				userlist: {},
				datalist: [],
				more: false, //是否下页
				pageNum: 1, // 第几页
				pageSize: 5, // 每页数
				total: 5, // 数据总条数
			}
		},
		onLoad() {
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				console.log(this.userlist);
				this.initialization(); //初始化
			} else {
				this.utils.error('请先登录账号！', () => {
					this.utils.navback();
				});
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			console.log('下拉刷新');
			// this.utils.showloading('正在刷新');
			// this.initialization(); //初始化
			// this.utils.success('刷新成功！', () => {
			// 	uni.stopPullDownRefresh();
			// });
		},
		//触底加载更多
		onReachBottom() {
			if (this.more == false) {
				this.loadStatus = 'nomore';
				return;
			} else {
				console.log('触底刷新');
				this.oyhjCk(); //初始化
			}
		},
		methods: {
			// 初始化数据
			initialization() {
				this.datalist = [];
				this.oyhjCk(); //初始化
			},
			//点击优惠券
			couponCk(list) {
				console.log(list);
				this.doSwitch('/pages/index/index')
			},
			oyhjCk() {
				this.http.getApi('oyhj/oyhj', {
					userId: this.userlist.id
				}, 'post').then(res => {
					console.log(res);
					this.datalist = res.oyhjEntities
					uni.hideLoading();
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
	page {
		background-color: #F1F1F1;
	}

	.comhome {
		width: 100%;
		height: 100%;
		padding: 20rpx;

		&_bock {
			width: 100%;
			min-height: 200rpx;
			margin-bottom: 30rpx;
			border-radius: 15rpx;
			background-color: #FFFFFF;

			image {
				width: 150rpx;
				flex: 0 0 150rpx;
				height: 150rpx;
				margin-right: 20rpx;
				border-radius: 12rpx;
			}

			text {
				margin-bottom: 10rpx;
			}

		}
	}
</style>

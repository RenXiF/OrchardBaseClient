<template>
	<!-- 我的订单页面 -->
	<view class="flex_columns" style="max-width: 100%;">
		<u-tabs-swiper ref="tabs" name="name" count="count" active-color="#ff8878" :list="menuTabs"
			:current="currentTab" :is-scroll="false" @change="tabsChange">
		</u-tabs-swiper>
		<load-refresh ref="loadRefresh" :isRefresh="true" :refreshTime="800" :heightReduce="10"
			:backgroundCover="'#FFFFFF'" :pageNo="pageNum" :totalPageNo="totalPage" @loadMore="loadMore"
			@refresh="refresh">
			<view slot="content-list">
				<!-- 数据列表 -->
				<view class="orderlist flex_columns">
					<view class="notice_ck flex_columns box_shadow" v-for="(item ,index) in menuLists" :key="index"
						v-if="menuLists.length!=0">
						<view class="tit_list flex_wrap flex_center flex_rows">
							<u-icon name="order" size="38" color="#ff8878"></u-icon>
							<text>自营店</text>
						</view>
						<view class="flex_between u-p-t-20 u-p-l-20 u-p-r-20 u-p-b-10"
							v-for="(item2 ,index2) in item.corderList" :key="index2">
							<view class="goodlog flex_rows">
								<image :src="item2.imgRess" class="" mode=""></image>
								<view class=" flex_wrap u-p-l-20">
									<text class="u-font-lg ft-wh">{{item2.spareOne}}</text>
								</view>
							</view>
							<view class="one_ck_two flex_columns flex_align_end">
								<cn-money :money="item2.goodsPrice" thousandth :size="30" color="#989898"></cn-money>
								<text>x{{item2.goodsSum}}</text>
							</view>
						</view>
						<view class="tit_ck flex_between">
							<text>订单号:</text>
							<text>{{item.order.orderNo}}</text>
						</view>
						<view class="tit_ck flex_between" v-if="item.order.spareThree">
							<text>物流号:</text>
							<text>{{item.order.spareThree}}</text>
						</view>
						<view class="tit_ck flex_between">
							<text>总价:</text>
							<text class="tit_b">{{item.order.amount/100}}元</text>
						</view>
						<view class="tit_ck flex_between">
							<text>创建时间:</text>
							<text>{{item.order.createdTime.substring(0,16)}}</text>
						</view>
						<view class="bt_ck flex_center flex_wrap flex_row_reverse">
							<view v-if="item.order.status == 0">
								<button type="warn" class=""  @click="qupay(item.order)">去支付</button>
							</view>
							<view v-if="item.order.status === 0">
								<button type="default" class="buttB" @click="exitOrder(item.order)">取消订单</button>
							</view>
							<view v-if="item.order.status != 0" >
								<button type="default" :disabled="true" class="buttA">{{menuTabs[item.order.status].name}}</button>
							</view>
							<view v-if="item.order.status == 2">
								<button type="default" class="buttB" @click="confirmOrder(item.order)">确认收货</button>
							</view>
						</view>
					</view>
					<u-loadmore :status="loadStatus" :load-text="loadText" />
					<view class="null flex_columns flex_center" :style="{height:screenHeight+'px'}"
						v-if="menuLists.length == 0">
						<u-empty text="暂无订单" mode="order"></u-empty>
					</view>
				</view>
			</view>
		</load-refresh>

	</view>
</template>

<script>
	import loadRefresh from '@/components/load-refresh/load-refresh.vue';
	import money from '@/components/cn-money/cn-money.vue';
	export default {
		components: {
			loadRefresh,
			money
		},
		data() {
			return {
				screenHeight: 0,
				list: [], // 数据集
				currPage: 1, // 当前页码
				totalPage: 1, // 总页数
				pageNum: 1,
				pageSize: 5, // 每页数
				currentTab: 0,
				menuTabs: [
					{
						name: '待付款'
					},
					{
						name: '待发货'
					},
					{
						name: '待收货'
					},
					{
						name: '已完成'
					},
					{
						name: '全部'
					},
				],
				exit: false,
				menuLists: [], //加载订单
				userlist: '', //用户缓存
				more: false, //是否下页
				loadStatus: 'nomore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
			};
		},
		onReady() {
			const res = uni.getSystemInfoSync();
			// console.log(res);
			this.screenHeight = res.windowHeight;
		},
		onLoad(e) {
			// if (this.utils.isLogin()) {
			// 	console.log(e);
			// 	if(e.index){
			// 		this.currentTab = e.index;
			// 	}
			// 	this.userlist = uni.getStorageSync('userlist');
			// 	console.log(this.userlist);
			// 	this.initialization();
			// } else {
			// 	this.utils.error('请先登录账号！', () => {
			// 		this.utils.navback();
			// 	});
			// }
		},
		methods: {
			// 上划加载更多
			loadMore() {
				console.log('loadMore')
				// 请求新数据完成后调用 组件内loadOver()方法
				// 注意更新当前页码 currPage
				this.judgeOrder(this.currentTab);
				this.$refs.loadRefresh.loadOver();
			},
			// 下拉刷新数据列表
			refresh() {
				console.log('refresh')
				this.initialization();
				this.utils.success('刷新成功！');
				this.$refs.loadRefresh.runRefresh()
			},
			swichMenu: async function(current) { //点击其中一个选项
				console.log(current)
				if (this.currentTab == current) {
					return false;
				} else {
					this.currentTab = current;
					this.initialization();
				}
			},
			// tabs通知swiper切换
			tabsChange(index) {
				console.log(index)
				this.currentTab = index;
				this.initialization();
			},
			// 初始化数据
			initialization() {
				this.utils.showloading();
				this.more = true;
				this.pageNum = 1;
				this.menuLists = [];
				this.judgeOrder(this.currentTab);
			},
			// 获取全部进订单
			judgeOrder(status) {
				if (this.more == false) {
					this.utils.error('暂无下页');
					this.loadStatus = 'nomore';
					uni.hideLoading();
					return;
				}
				let li = {
					UsrId: this.userlist.usrId,
					status: status==4?5:status,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				console.log(li)
				// this.utils.showloading();
				this.http.getApi('Order/getMyOrder', li, 'get').then(res => {
					uni.hideLoading();
					console.log(res);
					this.more = res.data[0].pageInfo.hasNextPage;
					this.totalPage = res.data[0].pageInfo.total;
					this.pageNum = res.data[0].pageInfo.hasNextPage ? this.pageNum + 1 : this.pageNum;
					this.menuLists = this.pageNum > 1 ? this.menuLists.concat(res.data) : res.data;
					this.loadStatus = this.more ? 'loadmore' : 'nomore';
				}).catch(err => {
					uni.hideLoading();
					console.log(err);
					this.loadStatus = 'nomore';
				});
			},
			qupay(order){//去支付
				console.log(order);
				let li = {
					orderNo: order.orderNo,
					// amount: 0.01,
					amount: order.amount / 100,
					body: order.body,
					opendid: this.userlist.openId
				}
				console.log(li);
				this.utils.showloading();
				this.http.getApi('wxPay/unifiedOrder', li, 'get').then(res => {
					console.log(res);
					// uni.hideLoading();
					this.paymentorder(res.data);
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.msg);
				});
			},
			paymentorder(data) {
				// console.log('执行');
				console.log(data);
				var _this = this;
				console.log('执行支付');
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: data, //微信、支付宝订单数据
					// #ifdef MP-WEIXIN 
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType,
					paySign: data.paySign,
					// #endif
					success: function(res) {
						console.log(res);
						uni.hideLoading();
						_this.utils.success('支付成功！',()=>{
							_this.initialization();
						});
					},
					fail: function(err) {
						console.log(data);
						console.log(err);
						uni.hideLoading();
						_this.utils.error('您已取消支付！');
					}
				});
			},
			exitOrder(order) {//取消订单
				console.log(order);
				this.utils.showloading();
				this.http.getApi('Order/de', {
						orderId: order.orderId
					}, 'get').then(res => {
						uni.hideLoading();
						console.log(res);
						this.utils.success('取消成功！', () => {
							this.initialization();
						});
					})
					.catch(err => {
						uni.hideLoading();
						console.log(err);
					});
			},
			confirmOrder(li){//确认收货
			var _this = this;
				console.log(li);
				uni.showModal({
				    title: '提示',
				    content: '点击确认即可完成收货！',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
							_this.upOrder(li.orderId,li.status);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			upOrder(orderId,status) {//取消订单
				console.log(orderId);
				console.log(status);
				this.utils.showloading();
				this.http.getApi('Order/up', {
						orderId: orderId,
						status:status+1
					}, 'post').then(res => {
						uni.hideLoading();
						console.log(res);
						this.utils.success('收货成功！');
						this.initialization();
					})
					.catch(err => {
						uni.hideLoading();
						console.log(err);
						this.utils.error(err.msg);
					});
			},

		}
	};
</script>

<style lang="scss">

	//订单列表
	.orderlist {
		max-width: 100%;
		min-height: 1500rpx;
		// padding-top: 100rpx;
		padding: 30rpx;
		background-color: #F8F8F8;

		.goodlog {
			margin-right: 30upx;

			>image {
				width: 180upx;
				height: 150upx;
				border-radius: 15upx;
			}
		}

		/* 内容 */
		.notice_ck {
			max-width: 100%;
			min-height: 300rpx;
			margin-bottom: 40rpx;
			padding: 20rpx;
			color: #333333;
			border-radius: 20rpx;
			// box-shadow: 1px 2px 6px #185044;
			// box-shadow: 1px 2px 6px #787878;
			background-color: #FFFFFF;

			.tit_list {
				padding: 10rpx 0;
				border-bottom: #F1F1F1 1px solid;

				text {
					margin-left: 20rpx;
					// border: #24BD9F 2rpx solid;
				}

				image {
					// border: #24BD9F 2rpx solid;
					width: 80rpx;
				}
			}

			.tit_ck {
				padding: 10rpx;

				.tit_b {
					font-size: 40rpx;
					color: #E54D42;
				}
			}

			// 按钮
			.bt_ck {
				width: 100%;
				padding: 10rpx 0;

				button {
					font-size: 30rpx;
					margin-left: 20rpx;
				}

				.buttA {
					background-color: #1BCAA7;
					color: #FFFFFF;
				}

				.buttB {
					background-color: #ffaa7f;
					color: #FFFFFF;
				}
			}
		}
	}
</style>

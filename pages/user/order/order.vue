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
							v-for="(item2 ,index2) in item.orderEntityList" :key="index2">
							<view class="goodlog flex_rows ">
								<image :src="item2.img" class="" mode=""></image>
								<view class=" flex_wrap u-p-l-20 ellipsis" style="max-width: 50%;">
									<!-- <text class="u-font-lg ft-wh ">{{item2.title}}</text> -->
									<u-read-more :toggle="true" show-height="150" close-text="展开" text-indent="0" font-size="25" color="#333">
										<rich-text :nodes="item2.title"></rich-text>
									</u-read-more>
								</view>
							</view>
							<view class="one_ck_two flex_columns flex_align_end ">
								<cn-money :money="item2.price" thousandth :size="35" color="#df473c"></cn-money>
								<text>{{item2.specificationsNname}}</text>
								<text>x{{item2.quantity}}</text>
							</view>
						</view>
						<view class="tit_ck flex_between flex_center">
							<text>订单号:</text>
							<text>{{item.orders}}</text>
						</view>
						<view class="tit_ck flex_between flex_center" v-if="item.spareThree">
							<text>物流号:</text>
							<text>{{item.spareThree}}</text>
						</view>
						<view class="tit_ck flex_between flex_center">
							<text>支付金额:</text>
							<!-- <text class="tit_b">{{item.totalAmount}}元</text> -->
							<cn-money :money="item.totalAmount" thousandth :size="50" color="#E54D42"></cn-money>
						</view>
						<view class="tit_ck flex_between">
							<text>创建时间:</text>
							<text>{{item.addTime}}</text>
						</view>
						<view class="bt_ck flex_center flex_wrap flex_row_reverse">
							<view v-if="item.state == 1">
								<button type="default" class="buttA"  @click="qupay(item)">去支付</button>
							</view>
							<view v-if="item.state == 1">
								<button type="default" class="buttB" @click="exitOrder(item)">取消订单</button>
							</view>
							<view v-if="item.state != 1" >
								<button type="default" :disabled="true" class="buttA">{{menuTabs[item.state-1].name}}</button>
							</view>
							<view v-if="item.state == 3">
								<button type="default" class="buttB" @click="confirmOrder(item)">确认收货</button>
							</view>
							<view v-if="item.state == 4">
								<button type="default" class="buttB" @click="evaluate(item)">去评价</button>
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
						name: '待评价'
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
				openid:'',
			};
		},
		onReady() {
			const res = uni.getSystemInfoSync();
			// console.log(res);
			this.screenHeight = res.windowHeight;
		},
		onLoad(e) {
			if (this.utils.isLogin()) {
				console.log(e);
				if(e.index){
					this.currentTab = Number(e.index);
				}
				this.userlist = uni.getStorageSync('userlist');
				this.openid = uni.getStorageSync('WXopenid');
				console.log(this.userlist);
				// this.initialization();
			} else {
				this.utils.error('请先登录账号！', () => {
					this.utils.navback();
				});
			}
		},
		onShow() {
			if (this.utils.isLogin()) {
				var _this = this
				setTimeout(function() {
					_this.initialization();
				}, 500)
			}
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
					userId: this.userlist.id,
					state: status==5 ? 0 : status+1,
					pageNum: this.pageNum,
					pageSize: this.pageSize
				}
				console.log(li)
				// if(li.state ==6){
					
				// }
				// this.utils.showloading();
				this.http.getApi('order/querys', li, 'post').then(res => {
					uni.hideLoading();
					console.log(res);
					this.more = res.pages>this.pageNum?true :false;
					this.totalPage = res.pages;
					this.pageNum = this.more ? this.pageNum + 1 : this.pageNum;
					this.menuLists = this.pageNum > 1 ? this.menuLists.concat(res.list) : res.list;
					this.loadStatus = this.more ? 'loadmore' : 'nomore';
				}).catch(err => {
					uni.hideLoading();
					console.log(err);
					this.loadStatus = 'nomore';
				});
			},
			//getOpenId
			getOpenId(open) {
				var _this = this;
				if(_this.openid !=''){
					open(_this.openid)
					return
				}
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes);
						_this.utils.getOpenId(loginRes.code,(res)=>{
							console.log(res);
							open(res.openid)
						})
					}
				});
			},
			qupay(item){//去支付
				console.log(item);
				let li = {
					orderNo: item.orders,
					amount: 0.01,
					// amount: item.totalAmount,
					body: '商品下单',
					openid: ''
				}
				console.log(li);
				this.getOpenId(res=>{
					li.openid = res
					if (li.openid != '') {
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
					} else{
						this.utils.error('服务端错误！请联系管理员')
					}
				})
				
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
				this.http.getApi('order/deleteOrder', {
						orders: order.orders
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
							_this.upOrder(li.orders);
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			upOrder(orders) {//确认收货订单
				console.log(orders);
				// console.log(status);
				this.utils.showloading();
				this.http.getApi('order/confirm', {
						orders: orders,
						state:4
					}, 'get').then(res => {
						uni.hideLoading();
						console.log(res);
						this.utils.success('收货成功！',()=>{
							this.initialization();
						});
						
					})
					.catch(err => {
						uni.hideLoading();
						console.log(err);
						this.utils.error(err.msg);
					});
			},
			evaluate(item){
				console.log(item)
				uni.setStorageSync('evaluate', item);
				this.doUrl('pages/user/comment/add')
			}

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
			width: 70%;
			>image {
				width: 180upx;
				height: 150upx;
				border-radius: 15upx;
			}
		}
		.one_ck_two{
			width: 30%;
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

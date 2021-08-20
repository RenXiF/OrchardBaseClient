<template>
	<!-- 开通vip记录列表 -->
	<view class="flex_columns">
		<view class="comhome">
			<view class="comhome_bock flex_between flex_center u-font-md u-p-30 box_shadow " v-for="(item ,index) in datalist" :key="index" v-if="datalist.length!=0">
				<view class="flex_columns u-font-md">
					<text>开通等级：{{item.grade}}</text>
					<text>订单号：{{item.orders}}</text>
					<view class="flex_center flex_rows ">
						<text class="">价格：</text>
						<text class="u-type-error">{{formatPrice(item.money)}}元</text>
					</view>
					
				</view>
				<view class="flex_row_reverse u-p-10" @click="payck(item)">
					<u-tag text="去支付" mode="light" type="error" v-if="item.state ==1"/>
					<u-tag text="已支付" mode="light" type="success" v-else/>
				</view>
			</view>
			<u-empty text="暂无记录" mode="list"  v-if="datalist.length==0"></u-empty>
		</view>
		<u-gap height="80" bg-color="#f8f8f8"></u-gap>
		<!-- <view class="foot">
			<u-button type="warning" @click="doUrl('pages/user/onelist/complaint')">添加反馈</u-button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadStatus: 'nomore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				userlist:{},
				datalist:[
					// {usrNaem:'张三',order:'123123132132',pay:10}
				],
				more: false, //是否下页
				pageNum: 1, // 第几页
				pageSize: 10, // 每页数
				total: 5, // 数据总条数
				openid:''
			}
		},
		computed: {
			//保留两位小数
			formatPrice() {
				return function(val) {
					return parseFloat(val).toFixed(2);
				}
			},
		},
		onLoad() {
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				this.openid = uni.getStorageSync('WXopenid');
				console.log(this.userlist);
				this.initialization(); //初始化
			}else{
				this.utils.error('请先登录账号！',()=>{
					this.utils.navback();
				});
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			console.log('下拉刷新');
			this.utils.showloading('正在刷新');
			this.initialization(); //初始化
			this.utils.success('刷新成功！', () => {
				uni.stopPullDownRefresh();
			});
		},
		//触底加载更多
		onReachBottom() {
			if (this.more == false) {
				this.loadStatus = 'nomore';
				return;
			} else {
				console.log('触底刷新');
				this.getGoods(); //初始化
			}
		},
		methods: {
			// 初始化数据
			initialization() {
				this.loadStatus = 'loading';
				this.more = true;
				this.pageNum = 1;
				this.datalist = [];
				this.getGoods(); //初始化
			},
			getGoods(){
				if (this.more == false) {
					this.utils.error('暂无下页');
					this.loadStatus = 'nomore';
					return;
				}
				let li = {
					userId:this.userlist.id,
					state:0,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}
				console.log(li)
				this.http.getApi('vipor/list', li, 'get').then(res => {
					console.log(res);
					this.more = res.pages>this.pageNum?true :false;
					this.total = res.pages;
					this.pageNum = this.more ? this.pageNum + 1 : this.pageNum;
					this.datalist = this.pageNum > 1 ? this.datalist.concat(res.list) : res.list;
					this.loadStatus = this.more ? 'loadmore' : 'nomore';
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			//点击支付
			payck(item){
				if (item.state == 1) {
					this.verificationLogin(item)
				} else{
					
				}
			},
			//获取openid
			verificationLogin(item) {
				var _this = this;
				if(_this.openid !=''){
					_this.wxPayorder(item,_this.openid)
					return
				}
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes);
						// _this.opengid(loginRes.code);
						_this.utils.getOpenId(loginRes.code,(res)=>{
							console.log(res);
							_this.wxPayorder(item,res.openid)
						})
					}
				});
			},
			 //支付订单
			wxPayorder(item,openid) {
				let li = {
					orderNo: item.orders,
					amount: 0.01,
					// amount: item.money,
					body: 'vip开通',
					openid: openid
				}
				console.log(li);
				this.http.getApi('wxPay/unifiedOrder', li, 'get').then(res => {
					console.log(res);
					console.log('执行支付');
					this.paymentorder(res.data);
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.msg);
				});
			},
			//拉起支付
			paymentorder(data) {
				console.log(data);
				var _this = this;
				_this.utils.showloading('正在支付');
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
						_this.utils.success('支付成功！', () => {
							_this.utils.refLogin()
							_this.initialization(); //初始化
						});
					},
					fail: function(err) {
						console.log(err);
						uni.hideLoading();
						_this.utils.error('您已取消支付！', () => {
							// _this.utils.refLogin()
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F8F8F8;
	}
	.comhome{
		width: 100%;
		height: 100%;
		padding: 20rpx;
		&_bock{
			width: 100%;
			min-height: 200rpx;
			margin-bottom: 50rpx;
			border-radius: 15rpx;
			background-color: #FFFFFF;
			
		}
	}
	.foot{
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: 40rpx;
		// background-color: #FFFFFF;
	}
</style>

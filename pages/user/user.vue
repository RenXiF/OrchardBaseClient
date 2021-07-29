<template>
	<!-- 用户中心 -->
	<view class="flex_columns">
		<view class="bg_three"></view>
		<view class="u-p-30">
			<view class="flex_columns bg_radius box_shadow one_ck">
				<view class="flex_between flex_center u-p-20">
					<view class="flex_center flex_rows">
						<u-avatar :src="wxlist.avatarUrl?wxlist.avatarUrl : src" size="large"></u-avatar>
						<text class="ft-wh u-m-l-20">{{wxlist.nickName ? wxlist.nickName : '未登录'}}</text>
					</view>
					<view class="flex_center">
						<button class="bg-gradual-red" size="mini" @click="exitLogin" v-if="lognum == 1">退出登录</button>
						<button class="bg-gradual-red" size="mini" @click="appLoginWx" v-if="lognum == 0">登录</button>
					</view>
				</view>
			</view>

			<view class="bg_radius box_shadow u-m-t-30 u-p-20 flex_columns">
				<view class="flex_between flex_center" @click="doUrl('pages/user/order/order')">
					<text class="u-font-md u-main-color">我的订单</text>
					<!-- <text class="u-font-xs u-border-color">全部订单</text> -->
				</view>
				<view class="">
					<u-grid :col="4" :border="false">
						<u-grid-item v-for="(item ,index) in menulist" :key="index"
							@click="doUrl(item.http,{index:index})">
							<u-icon :name="item.icon" :size="46" color="#ef654d"></u-icon>
							<view class="grid-text">{{item.title}}</view>
						</u-grid-item>
					</u-grid>
				</view>
			</view>
			<view class="bg_radius box_shadow u-m-t-30 u-p-10 flex_columns">
				<u-grid :col="3" :border="false">
					<u-grid-item v-for="(item ,index) in menulist2" :key="index" @click="YZdoUrl(item)">
						<u-icon :name="item.icon" :size="46" color="#7c7c7c"></u-icon>
						<view class="grid-text">{{item.title}}</view>
					</u-grid-item>
				</u-grid>
			</view>
			<!-- <view class="boder">
				<text>打印：{{shareli}}</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lognum: 0,
				src: '/static/logo.png',
				menulist: [{
						title: '待付款',
						icon: 'photo',
						http: 'pages/user/order/order'
					},
					{
						title: '待发货',
						icon: 'lock',
						http: 'pages/user/order/order'
					},
					{
						title: '待收货',
						icon: 'hourglass',
						http: 'pages/user/order/order'
					},
					{
						title: '待评价',
						icon: 'more-dot-fill',
						http: 'pages/user/order/order'
					}
				],
				menulist2: [{
						title: '收藏',
						icon: 'thumb-up',
						http: 'pages/user/onelist/Collection'
					},
					{
						title: '购物车',
						icon: 'shopping-cart',
						http: 'pages/user/onelist/Cart'
					},
					{
						title: '收货地址',
						icon: 'car',
						http: 'pages/address/ment_address'
					},
					{
						title: '在线客服',
						icon: 'server-fill',
						http: 'no'
					},
					{
						title: '投诉建议',
						icon: 'edit-pen',
						http: 'pages/user/onelist/complaintList'
					},
					{
						title: '关于我们',
						icon: 'setting',
						http: 'pages/user/onelist/aboutApp'
					}

				],
				wxlist: '',
				userlist: {},
				shareli: '',
				share: {
					title: '快来加入我们吧',
					path: '/pages/index/index',
					imageUrl: '',
					desc: '',
					content: ''
				},
				openId: '',

			}
		},
		onLoad() {},
		onShow() {
			if (this.utils.isLogin()) {
				this.openId = uni.getStorageSync('WXopenid');
				this.userlist = uni.getStorageSync('userlist');
				if (this.userlist.usrId) {
					this.lognum = 1;
				}
				console.log('执行赋值')
				console.log(this.userlist)
				// console.log(this.openId)
			}
			if (!this.userlist.usrId) {
				this.lognum = 0;
			}
		},
		onShareAppMessage(res) {
			console.log(res);
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res);
				console.log(res.target);
				uni.setStorageSync('shareli', res.target);
			}
		},
		methods: {
			exitLogin() {
				if (this.utils.logout()) {
					this.utils.success('退出成功！');
					this.lognum = 0;
					this.userlist = {};
					this.openId = '';
					this.wxlist = '';
					this.utils.logout();
				}
			},
			appLoginWx() {
				this.doUrl('pages/user/login')
				// var _this = this;
				// if (_this.wxlist != '') {
				// 	_this.verificationLogin();
				// } else {
				// 	uni.getUserProfile({
				// 		desc: '获取基本资料',
				// 		success: function(loginRes) {
				// 			console.log(loginRes);
				// 			_this.wxlist = loginRes.userInfo;
				// 			_this.verificationLogin();
				// 		},
				// 		fail: function(err) {
				// 			console.log(err);
				// 			_this.utils.error('请先同意授权')
				// 		}
				// 	});
				// }
			},
			panduan() {
				if (this.userlist.spareOne !== this.wxlist.avatarUrl && this.wxlist != '') {
					this.userUp();
				}
			},
			userUp() { //更新用户信息
				let uer = {
					usrId: this.userlist.usrId,
					spareOne: this.wxlist.avatarUrl,
					// usrName: this.wxlist.nickName
				}
				console.log(uer);
				this.http.getApi('user/up', uer, 'post').then(res => {
					console.log(res);
					console.log('12313213213');
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
				});
			},
			//验证登录状态
			verificationLogin() {
				// this.utils.showloading();
				this.lognum = 1;
				// var _this = this;
				// if (this.openId != '' && this.openId != undefined) {
				// 	this.userLogin();
				// } else {
				// 	uni.login({
				// 		provider: 'weixin',
				// 		success: function(loginRes) {
				// 			console.log(loginRes);
				// 			_this.opengid(loginRes.code);
				// 		}
				// 	});
				// }
			},
			opengid(code) {
				// console.log('code:'+code);
				this.http.getApi('user/test', {
					code: code
				}, 'get').then(res => {
					console.log(res);
					if (res.data) {
						this.openId = res.data;
						uni.setStorageSync('WXopenid', this.openId);
						this.userLogin();
					} else {
						this.utils.error('登录失败！');
					}
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
				});
			},
			//登录
			userLogin() {
				this.http.getApi('user/login', {
					openId: this.openId
				}, 'get').then(res => {
					console.log(res);
					this.userlist = res.data;
					uni.setStorageSync('userlist', this.userlist);
					this.panduan();
					if (this.userlist.usrLevel > 0) {
						this.Gvalueji();
					}
					this.utils.success('登录成功！');
					this.lognum = 1;
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					if (err.status == 19) {
						// this.userRegister();
						var _this = this;
						this.utils.error('该用户未注册', () => {
							let li = {
								openId: _this.openId,
								usrName: _this.wxlist.nickName,
								spareOne: _this.wxlist.avatarUrl
							}
							uni.setStorageSync('wxlist', li);
							_this.doUrl('pages/user/register');

						});
					} else {
						this.utils.error(err.msg);
					}
				});
			},
			userRegister() {
				let li = {
					openId: this.openId,
					usrName: this.wxlist.nickName,
					spareOne: this.wxlist.avatarUrl
				}
				console.log(li)
				this.http.getApi('user/register', li, 'post').then(res => {
					console.log(res);
					this.userLogin();
					// uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			YZdoUrl(item) { //跳转页面
				if (item.title == '在线客服') {
					this.callPhone(this.phone);
				} else {
					this.doUrl(item.http);
				}

			}
		}
	}
</script>

<style lang="scss">
	.bg_three {
		width: 100%;
		height: 200rpx;
		position: fixed;
		top: 0;
		z-index: -1;
		background-color: #F95D37;
		border-radius: 0 0 30rpx 30rpx;
	}

	.one_ck {
		margin-top: 40rpx;

		&_two {
			padding: 10rpx;
			border-radius: 0 0 15rpx 15rpx;
			background-color: #000000;
			color: #F95D37;
		}
	}
</style>

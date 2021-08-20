<template>
	<!-- 用户中心 -->
	<view class="flex_columns">
		<view class="bg_three"></view>
		<view class="u-p-30">
			<view class="flex_columns bg_radius box_shadow one_ck">
				<view class="flex_between flex_center u-p-20">
					<!-- <view class="flex_center flex_rows">
						<u-avatar :src="wxlist.avatarUrl?wxlist.avatarUrl : src" size="large"></u-avatar>
						<text class="ft-wh u-m-l-20">{{wxlist.nickName ? wxlist.nickName : '未登录'}}</text>
					</view> -->
					<view class="flex_center flex_rows">
						<u-avatar :src="userlist.userImg?userlist.userImg : src" size="large"></u-avatar>
						<view class="u-m-l-20 flex_columns">
							<text
								class="ft-wh u-font-lg u-m-b-10">{{userlist.userName ? userlist.userName : '未登录'}}</text>
							<text class="u-font-md  u-type-warning-disabled"
								v-if="userlist.userRole">{{userlist.userRole}}</text>
						</view>
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
		</view>
		<!-- <u-modal v-model="show" @confirm="confirm" ref="uModal" :async-close="true">
			<view class="slot-content">
				<u-field v-model="mobile" label="手机号" placeholder="请填写手机号"></u-field>
			</view>
		</u-modal> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lognum: 0,
				show: false,
				src: '/static/logo.png',
				mobile:'',
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
						title: '会员中心',
						icon: 'level',
						http: 'pages/user/onelist/vip'
					},
					{
						title: '设置',
						icon: 'edit-pen',
						http: 'pages/user/onelist/userlist'
					},
					{
						title: '在线客服',
						icon: 'server-fill',
						http: 'no'
					},
					// {
					// 	title: '投诉建议',
					// 	icon: 'edit-pen',
					// 	http: 'pages/user/onelist/complaintList'
					// },
					{
						title: '关于我们',
						icon: 'setting',
						http: 'pages/user/onelist/aboutApp'
					}

				],
				userlist: {},
				shareli: '',
				share: {
					title: '快来加入我们吧',
					path: '/pages/index/index',
					imageUrl: '',
					desc: '',
					content: ''
				},

			}
		},
		onLoad() {},
		onShow() {
			var _this = this
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				if (this.userlist.id) {
					this.lognum = 1;
				}
				console.log(this.userlist)
			}
			if (!this.userlist.id) {
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
			showModal() {
				this.show = true;
			},
			confirm() {
				setTimeout(() => {
					// 3秒后自动关闭
					this.show = false;
					// 如果不想关闭，而单是清除loading状态，需要通过ref手动调用方法
					// this.$refs.uModal.clearLoading();
				}, 3000)
			},
			exitLogin() {
				if (this.utils.logout()) {
					this.utils.success('退出成功！');
					this.lognum = 0;
					this.userlist = {};
				}
			},
			appLoginWx() {
				this.doUrl('pages/user/login')
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

<!-- 蓝色简洁登录页面 -->
<template>
	<view class="">
		<nav-bar ref="navBar" transparentFixedFontColor="#333" type="transparentFixed"></nav-bar>
		<view class="navhei"></view>
		<view class="t-login ">
			<!-- 页面装饰图片 -->
			<image class="img-a" src="@/static/login/2.png"></image>
			<image class="img-b" src="@/static/login/3.png"></image>
			<!-- 标题 -->
			<view class="t-b">{{ title }}</view>
			<form class="cl ">
				<view class="t-a">
					<!-- <image src="@/static/login/sj.png"></image> -->
					<u-icon name="account" :color="icolor" size="45" class="l_icon"></u-icon>
					<input type="number" name="phone" placeholder="请输入手机号" v-model="name" />
				</view>
				<view class="t-a">
					<!-- <image src="@/static/login/yz.png"></image> -->
					<u-icon class="l_icon" @click="shwopass=!shwopass" :name="!shwopass?'eye-fill':'eye-off'"
						:color="icolor" size="45"></u-icon>
					<input type="text" name="code" :password="shwopass" placeholder="请输入密码" v-model="pass" />
					<!-- <view v-if="showText" class="t-c" @click="getCode()">发送短信</view>
				<view v-else class="t-c" style="background-color: #A7A7A7;">重新发送({{ second }})</view> -->
				</view>
				<button @click="login()" class="login_but">登 录</button>
				<button @click="register()" class="register_but">注 册</button>
				<button @click="doUrl('pages/user/onelist/forgetPass')" class="register_but">忘记密码</button>
			</form>
			<view class="t-f"><text>————— 第三方账号登录 —————</text></view>
			<view class="t-e cl flex_jufy_center">
				<view class="t-g" @tap="wxLogin()">
					<image src="@/static/login/wx.png"></image>
				</view>
				<!-- <view class="t-g" @tap="zfbLogin()"><image src="@/static/login/qq.png"></image></view> -->
			</view>

		</view>
		<u-modal v-model="show" @confirm="confirm" ref="uModal" :async-close="true" show-cancel-button title="填写手机号"
			height="20%">
			<view class="slot-content flex_center flex_around u-p-20">
				<text>手机号：</text>
				<input type="number" v-model="mobile" placeholder="请填写手机号"/>
			</view>
		</u-modal>
	</view>

</template>
<script>
	export default {
		/**
		 * 2020年12月1日   李新雷编写（练习）  适用所有app登录
		 * vue版本简洁又美观的登录页面（个人感觉插件市场的登录都不太好看，哈哈 O(∩_∩)O）
		 * 该模板只是登录模板：验证、倒计时等都已经写好，
		 * 如果需要注册（注册可以设计在登录按钮下方），
		 * 直接复制该页面稍微改动即可
		 */
		data() {
			return {
				title: '果园基地', //填写logo或者app名称，也可以用：欢迎回来，看您需求
				second: 60, //默认60秒
				shwopass: true,
				showText: true, //判断短信是否发送
				show: false,
				mobile: '',
				name: '', //手机号码
				pass: '', //密码
				icolor: '#3f3f3f',
				wxli:''
			};
		},
		onLoad() {},
		methods: {
			confirm() {
				if(this.mobile == '' || this.utils.checkMobile(this.mobile) == false){
					this.utils.error('请填写正常手机号！');
					this.$refs.uModal.clearLoading();
					return
				}
				this.wxli.phone = this.mobile
				var _this = this
				this.http.getApi('user/xgphone', this.wxli, 'post').then(res => {
					console.log(res);
					this.utils.success("登录成功！", function() {
						_this.show = false;
						uni.setStorageSync('WXopenid', res.user.openId);
						uni.setStorageSync('userlist', res.user);
						uni.switchTab({
							url: '/pages/user/user'
						});
					});
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.message)
				});
			},
			//当前登录按钮操作
			login() {
				var that = this;
				if (!that.name || that.utils.checkMobile(that.name) == false) {
					that.utils.error('请输入正确手机号')
					return;
				}
				if (!that.pass) {
					uni.showToast({
						title: '请输入密码',
						icon: 'none'
					});
					return;
				}
				//....此处省略，这里需要调用后台验证一下密码是否正确，根据您的需求来
				// uni.showToast({ title: '登录成功！', icon: 'none' });
				this.userLogin()
			},
			//登录
			userLogin() {
				let uer = {
					userName: this.name,
					password: this.pass,
				}
				console.log(uer);
				this.http.getApi('user/login', uer, 'post').then(res => {
					console.log(res);
					uni.setStorageSync('userlist', res.user)
					uni.setStorageSync('WXopenid', res.user.openId);
					this.utils.success(res.message, () => {
						this.utils.navback()
					})
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.message)
				});
			},
			//当前注册按钮操作
			register() {
				this.doUrl('pages/user/register')
			},
			//获取短信密码
			getCode() {
				var that = this;
				var interval = setInterval(() => {
					that.showText = false;
					var times = that.second - 1;
					that.second = times < 10 ? '0' + times : times; //小于10秒补 0
					that.second = times;
					console.log(times);
				}, 1000);
				setTimeout(() => {
					clearInterval(interval);
					that.second = 60;
					that.showText = true;
				}, 60000);
				//这里请求后台获取短信密码
				uni.request({
					//......//此处省略
					success: function(res) {
						that.showText = false;
					}
				});
			},
			//等三方微信登录
			wxLogin() {
				var _this = this
				uni.getUserProfile({
					desc: '获取基本资料',
					success: function(loginRes) {
						// console.log(loginRes);
						let li = {
							openId: "",
							userImg: "",
							userName: "",
						}
						li.userImg = loginRes.userInfo.avatarUrl
						li.userName = loginRes.userInfo.nickName
						_this.utils.showloading();
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								console.log(loginRes);
								// #ifdef MP-WEIXIN
								_this.utils.getOpenId(loginRes.code, (res) => {
									console.log(res);
									li.openId = res.openid
									// console.log(li);
									_this.loginWeiXin(li);
								})
								// #endif
							},
							fail: function(err) {
								console.log(err);
								uni.hideLoading();
								_this.utils.error('您已取消授权！');
							}
						});
					},
					fail: function(err) {
						console.log(err);
						_this.utils.error('请先同意授权')
					}
				});
			},
			//微信验证登录
			loginWeiXin(list) {
				console.log(list);
				this.http.getApi('user/wxchange', list, 'post').then(res => {
					console.log("成功");
					console.log(res);
					uni.hideLoading();
					if(res.user.phone==null || res.user.phone==''){
						this.ugetphone(res.user)
					}else{
						this.show = false
						this.utils.success("登录成功！", function() {
							uni.setStorageSync('WXopenid', res.user.openId);
							uni.setStorageSync('userlist', res.user);
							uni.switchTab({
								url: '/pages/user/user'
							});
						});
					}
					
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.message);
				});
			},
			//更新手机号
			ugetphone(li){
				this.wxli = li
				this.show = true;
			},
			//第三方支付宝登录
			zfbLogin() {
				uni.showToast({
					title: '支付宝登录',
					icon: 'none'
				});
			}
		}
	};
</script>
<style lang="scss">
	.slot-content {
		font-size: 28rpx;
		color: #333333;
		input{
			max-width: 100%;
			min-width: 70%;
			border-radius: 10rpx;
			padding: 15rpx 10rpx;
			background-color: #e6e6e6;
		}
	}

	.img-a {
		position: absolute;
		width: 100%;
		top: -280rpx;
		right: -100rpx;
	}

	.img-b {
		position: absolute;
		width: 50%;
		bottom: 0;
		left: -50rpx;
		margin-bottom: -200rpx;
	}

	.t-login {
		width: 600rpx;
		margin: 0 auto;
		font-size: 28rpx;
		color: #000;
	}

	.t-login button {
		font-size: 28rpx;
		height: 90rpx;
		line-height: 90rpx;
		/* border-radius: 50rpx; */
		/* box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2); */
		margin-bottom: 20rpx;
	}

	.login_but {
		background: #5677fc;
		/* border-radius: 50rpx; */
		color: #fff;
	}

	.register_but {
		background: #F5F6FA;
		color: #333;
		/* box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2); */
	}

	.t-login input {
		padding: 0 20rpx 0 120rpx;
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 50rpx;
		background: #f8f7fc;
		border: 1px solid #e9e9e9;
		font-size: 28rpx;
		border-radius: 50rpx;
	}

	.t-login .t-a {
		position: relative;
	}

	.t-login .t-a image {
		width: 40rpx;
		height: 40rpx;
		position: absolute;
		left: 40rpx;
		top: 28rpx;
		border-right: 2rpx solid #dedede;
		padding-right: 20rpx;
	}

	.t-login .t-b {
		text-align: left;
		font-size: 46rpx;
		color: #000;
		padding: 150rpx 0 120rpx 0;
		font-weight: bold;
	}

	.t-login .t-c {
		position: absolute;
		right: 22rpx;
		top: 22rpx;
		background: #5677fc;
		color: #fff;
		font-size: 24rpx;
		border-radius: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 25rpx;
	}

	.t-login .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0;
	}

	.t-login .t-e {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0;
	}

	.t-login .t-g {
		float: left;
		width: 50%;
	}

	.t-login .t-e image {
		width: 50rpx;
		height: 50rpx;
	}

	.t-login .t-f {
		text-align: center;
		margin: 150rpx 0 0 0;
		color: #666;
	}

	.t-login .t-f text {
		margin-left: 20rpx;
		color: #aaaaaa;
		font-size: 27rpx;
	}

	.t-login .uni-input-placeholder {
		color: #000;
	}

	.cl {
		zoom: 1;
	}

	.cl:after {
		clear: both;
		display: block;
		visibility: hidden;
		height: 0;
		content: '\20';
	}
</style>

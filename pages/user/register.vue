<!-- 注册页面 -->
<template>
	<view class="">
		<nav-bar ref="navBar" transparentFixedFontColor="#333" type="transparentFixed"></nav-bar>
		<view class="navhei"></view>
		<view class="t-login">
		<!-- 页面装饰图片 -->
		<image class="img-a" src="@/static/login/2.png"></image>
		<image class="img-b" src="@/static/login/3.png"></image>
		<!-- 标题 -->
		<view class="t-b">{{ title }}</view>
		<form class="cl">
			<view class="t-a">
				<!-- <image src="@/static/login/sj.png"></image> -->
				<u-icon name="account" :color="icolor" size="45" class="l_icon"></u-icon>
				<input type="text" name="name" placeholder="请输入账号名称" v-model="name" />
			</view>
			<view class="t-a">
				<!-- <image src="@/static/login/sj.png"></image> -->
				<u-icon name="account" :color="icolor" size="45" class="l_icon"></u-icon>
				<input type="number" name="phone" placeholder="请输入手机号" v-model="phone" />
			</view>
			<view class="t-a">
				<!-- <image src="@/static/login/sj.png"></image> -->
				<u-icon name="email" :color="icolor" size="45" class="l_icon"></u-icon>
				<input type="text" name="mail" placeholder="请输入邮箱号" v-model="mail" />
			</view>
			<view class="t-a">
				<!-- <image src="@/static/login/yz.png"></image> -->
				<u-icon name="edit-pen" :color="icolor" size="45" class="l_icon"></u-icon>
				<input type="text" name="code" mixlength="6" placeholder="请输入密码" :password="shwopass" v-model="pass" />
				<view class="t-c" @click="shwopass=!shwopass"><u-icon :name="!shwopass?'eye-fill':'eye-off'" color="#949494" size="45"></u-icon></view>
				<!-- <u-icon :name="shwopass?'eye-fill':'eye-off'" color="#ff0004" size="38"></u-icon> -->
				<!-- <view v-if="showText" class="t-c" @click="getCode()">发送短信</view>
				<view v-else class="t-c" style="background-color: #A7A7A7;">重新发送({{ second }})</view> -->
			</view>
			<view class="t-a">
				<!-- <image src="@/static/login/yz.png"></image> -->
				<u-icon name="edit-pen-fill" :color="icolor" size="45" class="l_icon"></u-icon>
				<input type="number" name="name" placeholder="请输入确认密码" mixlength="6" :password="shwoypass" v-model="ypass" />
				<view class="t-c" @tap="shwoypass=!shwoypass"><u-icon :name="!shwoypass?'eye-fill':'eye-off'" color="#949494" size="45"></u-icon></view>
			</view>
			<button @click="login()" class="login_but">注 册</button>
		</form>
		<!-- <view class="t-f"><text>————— 第三方账号登录 —————</text></view>
		<view class="t-e cl flex_jufy_center">
			<view class="t-g" @tap="wxLogin()"><image src="@/static/login/wx.png"></image></view>
			<view class="t-g" @tap="zfbLogin()"><image src="@/static/login/qq.png"></image></view>
		</view> -->
	</view>
		
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
			title: '注册页面', //填写logo或者app名称，也可以用：欢迎回来，看您需求
			icolor:'#3f3f3f',
			second: 60, //默认60秒
			shwopass:true,
			shwoypass:true,
			showText: true, //判断短信是否发送
			name: '', //账号
			phone:'',//手机号
			mail:'',//邮箱
			pass: '' ,//密码
			ypass: '' //密码
		};
	},
	onLoad() {},
	methods: {
		//当前登录按钮操作
		login() {
			var that = this;
			if (!that.name) {
				that.utils.error('请输入账号')
				return;
			}
			// if (that.name.replace(/[^\x00-\xff]/g, 'AA').length > 20) {
			// 	that.utils.error('请输入长度不能大于20个字符')
			// 	return;
			// }
			if (!that.phone || that.utils.checkMobile(that.phone) == false) {
				that.utils.error('请输入正确手机号')
				return;
			}
			if (!that.utils.cheMail(that.mail)) {
				that.utils.error('请输入正确邮箱')
				return;
			}
			if (!that.pass) {
				that.utils.error('请输入密码')
				return;
			}
			if (that.pass != that.ypass) {
				that.utils.error('请确认密码是否一致')
				return;
			}
			this.utils.showloading()
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes);
					that.utils.getOpenId(loginRes.code, (res) => {
						console.log(res);
						that.register(res.openid)
					})
				},
				fail: function(err) {
					console.log(err);
					uni.hideLoading();
					that.utils.error('您已取消授权！');
				}
			});
		},
		//当前注册按钮操作
		register(openid){
			let li = {
				userEmail: this.mail,
				userImg: "https://oss.gzkts.xyz/%E6%B0%B4%E6%9E%9C.png",
				userName: this.name,
				phone:this.phone,
				userPassword: this.pass,
				openId:openid
			}
			this.http.getApi('user/register', li, 'post').then(res => {
				console.log(res);
				uni.hideLoading();
				this.utils.success(res.message,()=>{
					this.utils.navback()
				})
			}).catch(err => {
				console.log(err);
				uni.hideLoading();
				this.utils.error(err.message)
			});
		},
		showpas(){
			console.log(this.shwopass);
			this.shwopass =!this.shwopass;
		},
		//获取短信密码
		getCode() {
			var that = this;
			var interval = setInterval(() => {
				that.showText = false;
				var times = that.second - 1;
				that.second = times<10?'0'+times:times ;//小于10秒补 0
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
			uni.showToast({ title: '微信登录', icon: 'none' });
		},
		//第三方支付宝登录
		zfbLogin() {
			uni.showToast({ title: '支付宝登录', icon: 'none' });
		}
	}
};
</script>
<style>
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
.login_but{
	background: #5677fc;
	/* border-radius: 50rpx; */
	color: #fff;
}
.register_but{
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
	/* background: #5677fc; */
	color: #fff;
	font-size: 24rpx;
	border-radius: 50rpx;
	height: 50rpx;
	line-height: 50rpx;
	padding: 0 25rpx;
	z-index: 9999;
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
	margin: 200rpx 0 0 0;
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

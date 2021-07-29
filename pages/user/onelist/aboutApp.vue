<template>
	<!-- 关于app -->
	<view class="index_app flex_columns" :style="{height: windowHeight+'px'}">
		<view class="index_icon flex_center flex_columns flex_jufy_center">
			<image src="@/static/logo.png" mode="widthFix"></image>
			<text class="u-m-t-20 ft-wh">{{app.name}}</text>
		</view>
		<view class="index_titbk">
		</view>
		
		<view class="index_contact flex_center flex_columns">
			<view class="contact_one flex_center">
				<!-- <text>服务条款</text>
				<view class="boder_xia"></view> -->
				<!-- <text>官网</text>
				<view class="boder_xia"></view> -->
				<text @click="callPhone(app.phone)">客服热线：{{app.phone?app.phone:'0851-2323-8398'}}</text>
			</view>
			<text class="contact_twe">{{app.copyright}} 版权所有</text>
		</view>
	</view>
</template>

<script>
	export default {
		components:{
		},
		data() {
			return {
				listtit:[
					{name:"用户隐私政策",
					http:"pages/user/aboutApp/privacyPolicy"
					}
				],
				app:this.appli,
				windowHeight:0
			}
		},
		onLoad() {
			const res = uni.getSystemInfoSync();
			console.log(res);
			this.windowHeight = res.windowHeight;
		},
		methods: {
		}
	}
</script>

<style>
	.boder_xia{
		width: 1px;
		height: 80%;
		margin: 0 1em;
		background-color: #007AFF;
	}
	.index_app{
		background-color: #F8F8F8;
		padding-bottom: 50px;
	}
.index_icon{
	width: 100%;
	min-height: 280px;
	
}
.index_icon image{
	width: 100px;
	/* height: ; */
	border-radius: 15px;
}
.index_icon text{
	font-size: 20px;
	color: #999999;
}


.index_titbk{
	min-height: 355px;
}


.contact_one{
	height: 20px;
	font-size: 15px;
	color: #007AFF;
}
.contact_twe{
	font-size: 12px;
	color: #C8C7CC;
}
</style>

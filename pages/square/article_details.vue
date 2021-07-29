<template>
	<!-- 文章详情 -->
	<view class="flex_columns">
		<nav-bar ref="navBar" :scrollTop="scrollTop" transparentFixedFontColor="#FFF" type="transparentFixed">
			<view class="preview" slot="default">详情</view> <!-- 不状态下的按钮 -->
		</nav-bar>
		<u-swiper :list="list" name="imgAddress" height="400" @click="yulan(list)"></u-swiper>
		<view class="two_ck">
			<view class="flex_columns two_one">
				<text class="u-font-xl ft-wh">娄山关</text>
				<text class="u-font-md ft-wh">开放时间：全天</text>
				<text class="u-font-md ft-wh">门票：免费</text>
				<view class="flex_columns">
					<text class="u-font-lg ft-wh">景点介绍</text>
					<u-read-more :toggle="true" show-height="200" font-size="24" color="#868686">
						<rich-text :nodes="content"></rich-text>
					</u-read-more>
				</view>
			</view>
			<view class="two_two  flex_columns">
				<text class="u-font-lg ft-wh">吃喝推荐</text>
				<view class="flex_between flex_wrap">
					<view class="flex_columns one_ck  u-p-b-20" v-for="(item, index) in 3" :key="index" @click="doUrlli(item)">
						<image src="../../static/logo.png" mode="widthFix"></image>
						<text class="u-font-lg ft-wh u-p-t-10">标题1</text>
						<text class="u-font-xs u-p-t-10">副标题1</text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop:0,
				list: [{
						imgAddress: '/static/index/wisp.png',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						imgAddress: '/static/index/one.png',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						imgAddress: '/static/index/two.png',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
				],
				content: `山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。
								苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。
								无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？`,
			}
		},
		onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
		methods: {
			yulan(list) { //图片预览
				if (list.length != 0) {
					let li = [];
					for (let i = 0; i < list.length; i++) {
						li.splice(i, 0, list[i].imgAddress);
					}
					console.log(li);
					this.openImg(li);
				}
			},
			doUrlli(item) {
				// uni.setStorageSync('buylist', item);
				this.doUrl('pages/square/article_details');
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F3F3F3;
	}
	.two_ck{
		// margin-top: -50rpx;
		top: -100rpx;
		position: relative;
		padding: 20rpx;
		.two_one ,.two_two{
			background-color: #FFFFFF;
			border-radius: 15rpx;
			margin-bottom: 30rpx;
			padding: 30rpx;
			text{
				margin-bottom: 20rpx;
			}
		}
		.two_two{
			.one_ck{
				width: 48%;
				min-height: 200rpx;
				image{
					max-width: 100%;
					max-height: 250rpx;
					border-radius: 60rpx 60rpx 0 0;
				}
			}
		}
	}
</style>

<template>
	<!-- 评价页面 -->
	<view class="flex_columns evalu_index">
		<u-sticky class="u-m-t-30">
			<view class="sticky" style="">
				<u-tabs :list="sortlist" name="sortName" active-color="#F55F54" :is-scroll="true" :current="current"
					@change="changeck"></u-tabs>
			</view>
		</u-sticky>
		<view class="flex_columns one_evalu u-p-20">
			<view class="one_ck_evalu flex_columns bg_radius u-p-20" v-for="(item ,index) in 6" :key="index">
				<view class="flex_rows flex_center" @click="doUrl('pages/index/evaluate_details')">
					<u-avatar :src="src" mode="circle"></u-avatar>
					<view class="flex_columns u-m-l-20">
						<text class="ft-wh u-font-lg">用户名2313132</text>
						<text class="ft-wh u-font-md">2020-12-1</text>
					</view>
				</view>
				<u-read-more :toggle="true" show-height="200" font-size="24" color="#868686" close-text="展开">
					<rich-text :nodes="content"></rich-text>
				</u-read-more>
				<view class="flex_between flex_center img_evalu" @click="openImg(imgli)">
					<image src="/static/logo.png" mode="aspectFill" v-for="(item2 ,index2) in 3" :key="index2"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				src: '/static/index/menu1.png',
				sortlist: [{
						sortImg: '/static/index/menu1.png',
						sortName: '好评'
					},
					{
						sortImg: '/static/index/menu2.png',
						sortName: '中评'
					},
					{
						sortImg: '/static/index/menu3.png',
						sortName: '差评'
					},
				], //分类数据
				imgli:['/static/logo.png','/static/logo.png','/static/logo.png'],
				content: `山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。
								苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。
								无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？`,
			};
		},
		onLoad() {

		},
		methods: {
			// 分类点击事件
			changeck(e) {
				this.current = e
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F8F8F8;
	}
	.evalu_index {
		width: 100%;

		.one_evalu {
			width: 100%;

			.one_ck_evalu {
				background-color: #FFFFFF;
				margin-bottom: 20rpx;

				.img_evalu {
					image {
						width: 30%;
						height: 200rpx;
						border-radius: 15rpx;
					}

				}
			}
		}
	}
</style>

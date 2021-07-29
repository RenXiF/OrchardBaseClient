<template>
	<!-- 评价页面 -->
	<view class="flex_columns evalu_index">
		<view class="flex_columns one_evalu u-p-20">
			<view class="one_ck_evalu flex_columns bg_radius u-p-20">
				<view class="flex_rows flex_center u-m-b-20">
					<u-avatar :src="src" mode="circle"></u-avatar>
					<view class="flex_columns u-m-l-20">
						<text class="ft-wh u-font-lg">用户名2313132</text>
						<text class="ft-wh u-font-md">2020-12-1</text>
					</view>
				</view>
				<!-- <u-read-more :toggle="true" show-height="200" font-size="24" color="#868686" close-text="展开">
					<rich-text :nodes="content"></rich-text>
				</u-read-more> -->
				<view class="flex_wrap u-m-b-20">
					<text class="u-font-lg">{{content}}</text>
				</view>
				<view class="flex_columns flex_center img_evalu">
					<image :src="item2" mode="widthFix" v-for="(item2 ,index2) in imgli" :key="index2" @click="openImg(imgli)"></image>
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
						width: 100%;
						// height: 200rpx;
						border-radius: 15rpx;
						margin-bottom: 20rpx;
					}

				}
			}
		}
	}
</style>

<template>
	<!-- 文章详情 -->
	<view class="flex_columns">
		<nav-bar ref="navBar" :scrollTop="scrollTop" transparentFixedFontColor="#FFF" type="transparentFixed">
			<view class="preview" slot="default">详情</view> <!-- 不状态下的按钮 -->
		</nav-bar>
		<u-swiper :list="list" height="400" @click="yulan(list)"></u-swiper>
		<view class="two_ck">
			<view class="flex_columns two_one">
				<text class="u-font-xl ft-wh">{{squarelist.squareName}}</text>
				<text class="u-font-md ft-wh">{{squarelist.doBusiness}}</text>
				<text class="u-font-md ft-wh">{{squarelist.describes}}</text>
				<text class="u-font-md ft-wh">地点：{{squarelist.address}}</text>
				<view class="flex_columns">
					<text class="u-font-lg ft-wh">介绍</text>
					<u-read-more :toggle="true" show-height="200" font-size="24" color="#868686">
						<rich-text :nodes="squarelist.introduce"></rich-text>
					</u-read-more>
				</view>
			</view>
			<view class="two_two  flex_columns">
				<text class="u-font-lg ft-wh">吃喝推荐</text>
				<view class="flex_between flex_wrap">
					<view class="flex_columns one_ck  u-p-b-20" v-for="(item, index) in 3" :key="index"
						@click="doUrlli(item)">
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
				scrollTop: 0,
				list: [],
				squarelist:{},
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			this.squarelist = uni.getStorageSync('squarelist');
			console.log(this.squarelist);
			this.getGoods(this.squarelist.id);
			// this.getComment(this.buylist.id);
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				console.log(this.userlist);
			}
		},
		methods: {
			getGoods(id) { //获取详细
				this.http.getApi('square/info/' + id, {}, 'post').then(res => {
					console.log(res);
					this.squarelist = res.square;
					this.list = res.square.imgs;
					console.log(this.squarelist);
					// uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
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
	page {
		background-color: #F3F3F3;
	}

	.two_ck {
		// margin-top: -50rpx;
		top: -100rpx;
		position: relative;
		padding: 20rpx;

		.two_one,
		.two_two {
			background-color: #FFFFFF;
			border-radius: 15rpx;
			margin-bottom: 30rpx;
			padding: 30rpx;

			text {
				margin-bottom: 20rpx;
			}
		}

		.two_two {
			.one_ck {
				width: 48%;
				min-height: 200rpx;

				image {
					max-width: 100%;
					max-height: 250rpx;
					border-radius: 60rpx 60rpx 0 0;
				}
			}
		}
	}
</style>

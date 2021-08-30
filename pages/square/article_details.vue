<template>
	<!-- 文章详情 -->
	<view class="flex_columns">
		<nav-bar ref="navBar" :scrollTop="scrollTop" transparentFixedFontColor="#FFF" type="transparentFixed">
			<view class="preview" slot="default">详情</view> <!-- 不状态下的按钮 -->
		</nav-bar>
		<u-swiper :list="list" height="400" @click="yulan"></u-swiper>
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
				<text class="u-font-lg ft-wh">推荐</text>
				<view class="flex_between flex_wrap">
					<view class="flex_columns one_ck  u-p-b-20" v-for="(item, index) in datalist" :key="index"
						@click="doUrlli(item)">
						<image :src="item.commodityImges" mode="widthFix"></image>
						<text class="u-font-lg ft-wh u-p-t-10">{{item.commodityName}}</text>
						<text class="u-font-xs u-p-t-5">{{item.commodityDescribe}}</text>
						<text class="u-font-xl ft-wh u-type-error">{{item.commodityPrice}}</text>
					</view>
				</view>
				<view class="flex_jufy_center">
					<u-empty mode="list" v-if="datalist.length==0"></u-empty>
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
				datalist: [],
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			this.squarelist = uni.getStorageSync('squarelist');
			console.log(this.squarelist);
			this.getGoods(this.squarelist.id);
			this.getcommodity()
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
					this.utils.error(err.message);
					uni.hideLoading();
				});
			},
			//推荐商品
			getcommodity() {
				let li = {
					pageNum: 1,
					pageSize: 10,
					state:3
				}
				// console.log(li)
				this.http.getApi('commodity/list', li, 'post').then(res => {
					console.log(res)
					this.datalist = res.list;
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.message);
					uni.hideLoading();
				});
			},
			yulan(e) { //图片预览
			// console.log(e);
				this.openImg(this.list,e);
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

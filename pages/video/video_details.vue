<template>
	<view class="flex_columns video_index">
		<nav-bar ref="navBar" :scrollTop="scrollTop" transparentFixedFontColor="#333" type="transparentFixed">
			<view class="preview" slot="default">详情</view> <!-- 不状态下的按钮 -->
		</nav-bar>
		<view class="flex_columns one_video">
			<video :src="onlist.video" controls :show-center-play-btn="false" auto-pause-if-navigate></video>
			<view class="flex_columns one_tit u-p-20">
				<text class="u-font-lg ft-wh">{{onlist.name}}</text>
				<text class="u-font-md">副标题1313131321321</text>
			</view>
			<u-gap height="30" bg-color="#f8f8f8"></u-gap>
			<view class="flex_columns comhome">
				<view class="comhome_bock u-border-bottom " v-for="(item, index) in datalist" :key="index">
					<u-swipe-action :show="item.show" :index="index" @click="click" @open="open" :options="options">
						<view class=" flex_rows flex_center u-p-20 bg_radius">
							<image src="/static/index/menu1.png" mode="aspectFill" class=""></image>
							<view class="flex_columns  u-m-l-20">
								<text class="u-font-lg ft-wh">{{item.title}}</text>
								<cn-money :money="item.Price" thousandth :size="48" unit="起" color="#FA3534"></cn-money>
								<text class="u-font-sm">销量{{item.num}}</text>
								<view class="flex_rows ">
									<u-tag text="满30减5" mode="light" type="error" size="mini" class="u-m-l-10"
										v-for="(item2,index2) in 3" :key="index2" />
								</view>
							</view>
						</view>
					</u-swipe-action>
				</view>
			</view>
			<u-gap height="30" bg-color="#f8f8f8"></u-gap>
			<view class="u-p-30">
				<text class="u-font-xl ft-wh">推荐商品</text>
			</view>
			<view class="flex_between one_class flex_wrap">
				<view class="flex_columns one_ck  u-p-b-20" v-for="(item, index) in 6" :key="index"
					@click="doUrl('pages/square/article_details');">
					<image src="../../static/logo.png" mode="widthFix"></image>
					<text class="u-font-lg ft-wh u-p-t-10">标题1</text>
					<text class="u-font-xs u-p-t-10">副标题1</text>
				</view>
			</view>
			<u-loadmore :status="loadStatus" :load-text="loadText" v-if="datalist.length!=0" />
		</view>
	</view>
</template>

<script>
	import money from '@/components/cn-money/cn-money.vue';
	export default {
		components: {
			money
		},
		data() {
			return {
				onlist: {},
				scrollTop:0,
				datalist: [{
						title: '火龙果',
						num: 1235,
						Price: 15.13,
						subtit: '副标题12311566145',
						show: false
					},
					{
						title: '葡萄',
						num: 13654,
						Price: 16.13,
						subtit: '副标题12311566145',
						show: false
					},
					// {
					// 	title: '火龙果3',
					// 	num: 4564,
					// 	subtit: '副标题12311566145',
					// 	show: false
					// },
					// {
					// 	title: '火龙果4',
					// 	num: 45645,
					// 	subtit: '副标题12311566145',
					// 	show: false
					// }
				],
				options: [{
						text: '收藏',
						style: {
							backgroundColor: '#007aff'
						}
					},
					// {
					// 	text: '删除',
					// 	style: {
					// 		backgroundColor: '#dd524d'
					// 	}
					// }
				],
				loadStatus: 'nomore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
			}
		},
		onLoad(e) {
			this.onlist = uni.getStorageSync('videolist');
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			click(index, index1) {
				// console.log(index);
				// console.log(index1);
				this.$u.toast('收藏了' + this.datalist[index].title);
				this.datalist.splice(index, 1);

				// if (index1 == 1) {
				// 	this.datalist.splice(index, 1);
				// 	this.$u.toast(`删除了第${index}个cell`);
				// } else {
				// 	this.datalist[index].show = false;
				// 	this.$u.toast(`收藏成功`);
				// }
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.datalist[index].show = true;
				this.datalist.map((val, idx) => {
					if (index != idx) this.datalist[idx].show = false;
				})
			},
		}
	}
</script>

<style lang="scss">
	.video_index {
		width: 100%;
	}

	.one_video {
		width: 100%;

		video {
			width: 100%;
		}

		.one_tit {
			text {
				margin-bottom: 20rpx;
			}
		}

		.one_class {
			width: 100%;
			padding: 20rpx;

			.one_ck {
				width: 48%;
				min-height: 200rpx;

				image {
					max-width: 100%;
					max-height: 250rpx;
					border-radius: 30rpx;
				}
			}
		}
	}

	.comhome {
		width: 100%;
		height: 100%;
		// padding: 20rpx;

		&_bock {
			width: 100%;
			min-height: 200rpx;
			margin-bottom: 30rpx;
			// border-radius: 15rpx;
			// background-color: #FFFFFF;

			image {
				width: 150rpx;
				flex: 0 0 150rpx;
				height: 150rpx;
				margin-right: 20rpx;
				border-radius: 12rpx;
			}

			text {
				margin-bottom: 10rpx;
			}

		}
	}
</style>

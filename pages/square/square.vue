<template>
	<view class="index_home flex_columns" style="height: 1200px;">
		<!-- <nav-bar>我的</nav-bar> -->
		<u-swiper :list="list" name="imgAddress" effect3d @click="yulan(list)"></u-swiper>
		<u-sticky class="u-m-t-30">
			<view class="sticky" style="">
				<u-tabs :list="sortlist" name="sortName" active-color="#F55F54" :is-scroll="true" :current="current"
					@change="changeck"></u-tabs>
			</view>
		</u-sticky>
		<view class="flex_between one_class flex_wrap">
			<view class="flex_columns one_ck  u-p-b-20" v-for="(item, index) in 7" :key="index" @click="doUrlli(item)">
				<image src="../../static/logo.png" mode="widthFix"></image>
				<text class="u-font-lg ft-wh u-p-t-10">标题1</text>
				<text class="u-font-xs u-p-t-10">副标题1</text>
			</view>
		</view>
		<u-loadmore :status="loadStatus" :load-text="loadText" v-if="datalist.length!=0" />
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
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
				current: 0,
				userlist: {},
				sortlist: [{
						sortImg: '/static/index/menu1.png',
						sortName: '周边旅游'
					},
					{
						sortImg: '/static/index/menu2.png',
						sortName: '附近美食'
					},
					{
						sortImg: '/static/index/menu3.png',
						sortName: '其他'
					},
				], //分类数据
				loadStatus: 'nomore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				more: false, //是否下页
				pageNum: 1, // 第几页
				pageSize: 5, // 每页数
				total: 5, // 数据总条数

			}
		},
		onLoad() {
			// this.initialization();//初始化
		},
		onShow() {
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				console.log(this.userlist)
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
		//下拉刷新
		onPullDownRefresh() {
			console.log('下拉刷新');
			// this.initialization(); //初始化
			this.utils.success('刷新成功！', () => {
				uni.stopPullDownRefresh();
			});
		},
		//触底加载更多
		onReachBottom() {
			if (this.more == false) {
				this.loadStatus = 'nomore';
				return;
			} else {
				console.log('触底刷新');
				this.loadStatus = 'loading';
				// this.getGoods(); //初始化
				setTimeout(function() {
					this.loadStatus = 'nomore';
				}, 2000)
			}
		},
		methods: {
			// 分类点击事件
			changeck(e) {
				this.current = e
			},
			// 初始化数据
			initialization() {
				if (this.utils.isLogin()) {
					this.userlist = uni.getStorageSync('userlist');
					// console.log(this.userlist)
				}
				this.utils.showloading('正在刷新');
				this.datalist = [];
				this.pageNum = 1;
				this.more = true;
			},
			doUrlli(item) {
				// uni.setStorageSync('buylist', item);
				this.doUrl('pages/square/article_details');
			},
			yulan(list) {
				if (list.length != 0) {
					let li = [];
					for (let i = 0; i < list.length; i++) {
						li.splice(i, 0, list[i].imgAddress);
					}
					console.log(li);
					this.openImg(li);
				}
			},
		}
	}
</script>

<style lang="scss">
	// page{
	// 	background-color: #F8F8F8;
	// }
	.index_home{
		// padding: 0 20rpx;
	}
	.one_class{
		width: 100%;
		padding: 20rpx;
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
</style>

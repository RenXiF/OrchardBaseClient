<template>
	<!-- 评价页面 -->
	<view class="flex_columns evalu_index">
		<u-sticky class="u-m-t-30">
			<view class="sticky" style="">
				<u-tabs :list="sortlist" name="dictionaryValue" active-color="#F55F54" :is-scroll="true" :current="current"
					@change="changeck"></u-tabs>
			</view>
		</u-sticky>
		<view class="flex_columns one_evalu u-p-20">
			<view class="one_ck_evalu flex_columns bg_radius u-p-20" v-for="(item ,index) in commentlist" :key="index">
				<view class="flex_rows flex_center" @click="doUrl('pages/index/evaluate_details')">
					<u-avatar :src="item.userImg" mode="circle"></u-avatar>
					<view class="flex_columns u-m-l-20">
						<text class="ft-wh u-font-lg">{{item.userName}}</text>
						<text class=" u-font-sm u-type-info-ligh">评论时间:{{item.contentTime}}</text>
					</view>
				</view>
				<u-read-more :toggle="true" show-height="200" font-size="24" color="#868686" close-text="展开">
					<rich-text :nodes="item.commodityContent"></rich-text>
				</u-read-more>
				<view class="flex_between flex_center img_evalu" v-if="item.commentimgEntityList.length!=0">
					<image :src="item2" mode="aspectFill" v-for="(item2 ,index2) in item.commentimgEntityList"
						:key="index2" @click="openImg(item.commentimgEntityList,index2)"></image>
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
				sortlist: [], //分类数据
				buylist:{},
				commentlist: [], //数据
				// imgli: ['/static/logo.png', '/static/logo.png', '/static/logo.png'],
				loadStatus: 'nomore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				more: false, //是否下页
				pageNum: 1, // 第几页
				pageSize: 3, // 每页数
				total: 5, // 数据总条数
			};
		},
		onLoad() {
			var _this = this
			if (this.utils.isLogin()) {
				this.utils.showloading();
				this.userlist = uni.getStorageSync('userlist');
				this.buylist = uni.getStorageSync('buylist');
				console.log(this.buylist);
				console.log(this.userlist);
				this.getDictionaries(); //获取分类
				setTimeout(function() {
					_this.initialization(); //初始化
				}, 500)
			} else {
				this.utils.error('请先登录账号！', () => {
					this.utils.navback();
				});
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			console.log('下拉刷新');
			this.initialization(); //初始化
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
				this.getComment(this.buylist.id);
				// setTimeout(function() {
				// 	this.loadStatus = 'nomore';
				// }, 2000)
			}
		},
		methods: {
			// 初始化数据
			initialization() {
				var _this = this
				this.utils.showloading('正在刷新');
				this.commentlist = [];
				this.pageNum = 1;
				this.more = true;
				setTimeout(function() {
					_this.getComment(_this.buylist.id);
					uni.hideLoading();
				}, 500)
			},
			// 分类点击事件
			changeck(e) {
				console.log(e);
				this.current = e
				this.initialization(); //初始化
			},
			// 获取评价字典
			getDictionaries() {
				let li = {
					dictionaries: 'evaluate',
					pageNum: 0,
					pageSize: 0
				}
				this.http.getApi('dictionaries/list', li, 'post').then(res => {
					console.log(res);
					this.sortlist = res.list;
					// console.log(this.sortlist);
				}).catch(err => {
					console.log(err);
					this.utils.error(err.message);
					uni.hideLoading();
				});
			},
			// 评论
			getComment(id) {
				if (this.more == false) {
					this.utils.error('暂无下页');
					this.loadStatus = 'nomore';
					return;
				}
				let li = {
					content: this.sortlist[this.current].dictionaryValue,
					id: id,
					pageNum: 1,
					pageSize: 10
				}
				console.log(li);
				this.http.getApi('comment/info', li, 'post').then(res => {
					console.log(res);
					this.more = res.pages>this.pageNum?true :false;
					this.total = res.pages;
					this.pageNum = this.more ? this.pageNum + 1 : this.pageNum;
					this.commentlist = this.pageNum > 1 ? this.commentlist.concat(res.list) : res.list;
					this.loadStatus = this.more ? 'loadmore' : 'nomore';
					// console.log(this.commentlist);
				}).catch(err => {
					console.log(err);
					this.utils.error(err.message);
					uni.hideLoading();
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
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

<template>
	<!-- 我的收藏页面 -->
	<view class="flex_columns ">
		<view class="comhome">
			<view class="comhome_bock box_shadow bg_radius" v-for="(item, index) in datalist"
				:key="index">
				<u-swipe-action :show="item.show" :index="index" @click="click" @open="open" :options="options" >
					<view class=" flex_rows flex_center u-p-20 bg_radius">
						<image src="/static/index/menu1.png" mode="aspectFill" class=""></image>
						<view class="flex_columns  u-m-l-20">
							<text class="u-font-lg ft-wh">{{item.title}}</text>
							<text class="u-font-md">{{item.subtit}}</text>
							<text class="u-font-sm">销量{{item.num}}</text>
							<view class="flex_rows ">
								<u-tag text="满30减5" mode="light" type="error" size="mini" class="u-m-l-10"
									v-for="(item2,index2) in 3" :key="index2" />
							</view>
						</view>
					</view>
				</u-swipe-action>
			</view>

			<u-empty text="暂无记录" mode="list" v-if="datalist.length==0"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loadStatus: 'nomore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				userlist: {},
				datalist: [{
						title: '火龙果',
						num: 1235,
						subtit: '副标题12311566145',
						show: false
					},
					{
						title: '火龙果2',
						num: 13654,
						subtit: '副标题12311566145',
						show: false
					},
					{
						title: '火龙果3',
						num: 4564,
						subtit: '副标题12311566145',
						show: false
					},
					{
						title: '火龙果4',
						num: 45645,
						subtit: '副标题12311566145',
						show: false
					}
				],
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [
					// {
					// 	text: '收藏',
					// 	style: {
					// 		backgroundColor: '#007aff'
					// 	}
					// },
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				more: false, //是否下页
				pageNum: 1, // 第几页
				pageSize: 5, // 每页数
				total: 5, // 数据总条数
			}
		},
		onLoad() {
			// if (this.utils.isLogin()) {
			// 	this.userlist = uni.getStorageSync('userlist');
			// 	console.log(this.userlist);
			// 	this.initialization(); //初始化
			// }else{
			// 	this.utils.error('请先登录账号！',()=>{
			// 		this.utils.navback();
			// 	});
			// }
		},
		//下拉刷新
		onPullDownRefresh() {
			console.log('下拉刷新');
			this.utils.showloading('正在刷新');
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
				this.getGoods(); //初始化
			}
		},
		methods: {
			click(index, index1) {
				// console.log(index);
				// console.log(index1);
				this.$u.toast('删除了'+this.datalist[index].title);
				// this.utils.success('删除了'+this.datalist[index].title)
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
			// 初始化数据
			initialization() {
				this.loadStatus = 'loading';
				this.more = true;
				this.pageNum = 1;
				this.datalist = [];
				this.getGoods(); //初始化
			},
			getGoods() {
				if (this.more == false) {
					this.utils.error('暂无下页');
					this.loadStatus = 'nomore';
					return;
				}
				let li = {
					MyId: this.userlist.usrId,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}
				console.log(li)
				this.http.getApi('tickling/getAllByid', li, 'get').then(res => {
					console.log(res);
					this.more = res.data.hasNextPage;
					this.total = res.data.total;
					this.pageNum = res.data.hasNextPage ? this.pageNum + 1 : this.pageNum;
					this.datalist = this.pageNum > 1 ? this.datalist.concat(res.data.list) : res.data.list;
					this.loadStatus = this.more ? 'loadmore' : 'nomore';
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F1F1F1;
	}

	.comhome {
		width: 100%;
		height: 100%;
		padding: 20rpx;

		&_bock {
			width: 100%;
			min-height: 200rpx;
			margin-bottom: 30rpx;
			border-radius: 15rpx;
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

	// .item {
	// 		display: flex;
	// 		padding: 20rpx;
	// 	}

	// 	image {
	// 		width: 120rpx;
	// 		flex: 0 0 120rpx;
	// 		height: 120rpx;
	// 		margin-right: 20rpx;
	// 		border-radius: 12rpx;
	// 	}

	// 	.title {
	// 		text-align: left;
	// 		font-size: 28rpx;
	// 		color: $u-content-color;
	// 		margin-top: 20rpx;
	// 	}
</style>

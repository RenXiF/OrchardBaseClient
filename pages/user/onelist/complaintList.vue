<template>
	<!-- 反馈意见列表 -->
	<view class="flex_columns">
		<view class="comhome">
			<view class="comhome_bock flex_between flex_center u-font-md u-p-30 box_shadow " v-for="(item ,index) in datalist" :key="index" v-if="datalist.length!=0">
				<view class="flex_columns">
					<text>姓名：{{item.usrNaem}}</text>
					<text>电话：{{item.usrPhone}}</text>
					<text>内容：{{item.question}}</text>
				</view>
				<view class="flex_row_reverse u-p-10">
					<u-tag text="待审核" mode="light" type="error" v-if="item.status ==0"/>
					<u-tag text="已审核" mode="light" type="success" v-else/>
				</view>
				
			</view>
			<u-empty text="暂无记录" mode="list"  v-if="datalist.length==0"></u-empty>
		</view>
		<u-gap height="80" bg-color="#f8f8f8"></u-gap>
		<view class="foot">
			<u-button type="warning" @click="doUrl('pages/user/onelist/complaint')">添加反馈</u-button>
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
				userlist:{},
				datalist:[],
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
				this.getGoods(); //初始化
			}
		},
		methods: {
			// 初始化数据
			initialization() {
				this.loadStatus = 'loading';
				this.more = true;
				this.pageNum = 1;
				this.datalist = [];
				this.getGoods(); //初始化
			},
			getGoods(){
				if (this.more == false) {
					this.utils.error('暂无下页');
					this.loadStatus = 'nomore';
					return;
				}
				let li = {
					MyId:this.userlist.usrId,
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
					this.loadStatus = this.more ? 'loadmore' :'nomore';
					uni.hideLoading();
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
	page{
		background-color: #F8F8F8;
	}
	.comhome{
		width: 100%;
		height: 100%;
		padding: 20rpx;
		&_bock{
			width: 100%;
			min-height: 200rpx;
			margin-bottom: 50rpx;
			border-radius: 15rpx;
			background-color: #FFFFFF;
			
		}
	}
	.foot{
		position: fixed;
		bottom: 0;
		width: 100%;
		padding: 40rpx;
		// background-color: #FFFFFF;
	}
</style>

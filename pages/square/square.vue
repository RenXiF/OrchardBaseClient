<template>
	<view class="index_home flex_columns" style="height: 1200px;">
		<!-- <nav-bar>我的</nav-bar> -->
		<u-swiper :list="list" name="img" effect3d @click="yulan(list)"></u-swiper>
		<u-sticky class="u-m-t-30">
			<view class="sticky" style="">
				<u-tabs :list="sortlist" name="dictionaryValue" active-color="#F55F54" :is-scroll="true" :current="current"
					@change="changeck"></u-tabs>
			</view>
		</u-sticky>
		<view class="flex_between one_class flex_wrap">
			<view class="wrap" style="width: 100%;" v-if="datalist">
				<u-waterfall v-model="datalist" ref="uWaterfall">
					<template v-slot:left="{ leftList }">
						<view class="demo-warter" v-for="(item, index) in leftList" :key="index"
							@click="doUrlli(item.id)">
							<!-- 微信小程序需要hx2.8.11版本才支持在template中引入其他组件，比如下方的u-lazy-load组件 -->
							<u-lazy-load threshold="-450" border-radius="10" :image="item.img" :index="index">
							</u-lazy-load>
							<view class="demo-title" v-if="item.squareName">{{ item.squareName }}</view>
							<view class="demo-shop" v-if="item.address">{{ item.address }}</view>
							<!-- 千分位 -->
							<!-- <money :money="item.price" thousandth :size="40" unitPosition="right"></money> -->
						</view>
					</template>
					<template v-slot:right="{ rightList }">
						<view class="demo-warter" v-for="(item, index) in rightList" :key="index"
							@click="doUrlli(item.id)">
							<u-lazy-load threshold="-450" border-radius="10" :image="item.img" :index="index">
							</u-lazy-load>
							<view class="demo-title" v-if="item.squareName">{{ item.squareName }}</view>
							<view class="demo-shop" v-if="item.address">{{ item.address }}</view>
							<!-- 千分位 -->
							<!-- <money :money="item.price" thousandth :size="40" unitPosition="right"></money> -->
						</view>
					</template>
				</u-waterfall>
				<u-empty mode="list" v-if="loadStatus==='nomore'&& datalist.length==0"></u-empty>
				<u-loadmore :status="loadStatus" @loadmore="getlist"></u-loadmore>
			</view>
			
		</view>
		<!-- <u-loadmore :status="loadStatus" :load-text="loadText" v-if="datalist.length!=0" /> -->
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				list: [],//轮播图
				current: 0,
				userlist: {},
				sortlist: [], //分类数据
				datalist:[],//数据
				yuanSli: [], //原始数据
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
			this.initialization();//初始化
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
				this.initialization(); //初始化
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
				this.getSort();
				this.getchart();
			},
			getchart() { //获取轮播图
				var li = {
					state: 3,
					pageNum: 0,
					pageSize: 0,
				};
				this.http.getApi('chart/list', li, 'post').then(res => {
					console.log(res);
					this.list = res.list;
					// console.log(this.list);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			getSort() { //获取分类
				var li = {
					dictionaries: 'classification',
					pageNum: 0,
					pageSize: 0,
				};
				this.http.getApi('dictionaries/list', li, 'post').then(res => {
					console.log(res);
					this.sortlist = res.list;
					console.log(this.sortlist);
					this.getsquare();
					// uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			getsquare() {
				if (this.more == false) {
					// this.utils.error('暂无下页');
					this.loadStatus = 'nomore';
					return;
				}
				let li = {
					classification:this.sortlist[this.current].dictionaryValue,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}
				console.log(li)
				this.http.getApi('square/list', li, 'post').then(res => {
					console.log(res)
					this.more = res.pages>this.pageNum?true :false;
					this.total = res.pages;
					this.pageNum = this.more ? this.pageNum + 1 : this.pageNum;
					// this.datalist = this.pageNum > 1 ? this.datalist.concat(res.list) : res.list;
					this.addRandomData(res.list);
					this.loadStatus = this.more ? 'loadmore' : 'nomore';
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			yulan(list) {
				if (list.length != 0) {
					let li = [];
					for (let i = 0; i < list.length; i++) {
						li.splice(i, 0, list[i].img);
					}
					// console.log(li);
					this.openImg(li);
				}
			},
			clear() { //清空瀑布流
				this.$refs.uWaterfall.clear();
			},
			addRandomData(list) {
				if (this.pageNum == 1) {
					this.datalist = [];
					this.yuanSli = [];
					this.clear();
				}
				console.log(list)
				// setTimeout(()=>{
				for (let i = 0; i < list.length; i++) {
					// console.log('111111111111')
					// let index = this.$u.random(0, list.length - 1);
					// console.log(index)
					let j = list[i];
					// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
					let item = JSON.parse(JSON.stringify(list[i]));
					// item.id = this.$u.guid(10);
					// j.id = item.id;
					// item.image = list[i].imgList.length != 0 ? list[i].imgList[0].imgAddress : '/static/null.jpg';
					this.datalist.push(item);
					this.yuanSli.push(j);
				}
				// console.log(this.datalist)
				// console.log(this.yuanSli)
				// },500);
			
			},
			doUrlli(id) {
				console.log(id)
				// this.$refs.uWaterfall.remove(id);
				for (let i = 0; i < this.yuanSli.length; i++) {
					if (this.yuanSli[i].id == id) {
						uni.setStorageSync('squarelist', this.yuanSli[i]);
						this.doUrl('pages/square/article_details');
					}
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
				height: 250rpx;
				border-radius: 60rpx 60rpx 0 0;
			}
		}
	}
	.demo-warter {
		border-radius: 8px;
		margin: 5px;
		background-color: #ffffff;
		padding: 8px;
		position: relative;
	}
	
	.u-close {
		position: absolute;
		top: 32rpx;
		right: 32rpx;
	}
	
	.demo-img-wrap {}
	
	.demo-image {
		width: 100%;
		border-radius: 4px;
	}
	
	.demo-title {
		font-size: 30rpx;
		margin-top: 5px;
		color: $u-main-color;
		word-break: break-all;
	}
	
	.demo-tag {
		display: flex;
		margin-top: 5px;
	}
	
	.demo-tag-owner {
		background-color: $u-type-error;
		color: #ffffff;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}
	
	.demo-tag-text {
		border: 1px solid $u-type-primary;
		color: $u-type-primary;
		margin-left: 10px;
		border-radius: 50rpx;
		line-height: 1;
		padding: 4rpx 14rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
	}
	
	.demo-price {
		font-size: 30rpx;
		color: $u-type-error;
		margin-top: 5px;
	}
	
	.demo-shop {
		font-size: 22rpx;
		color: $u-tips-color;
		margin-top: 5px;
	}
</style>

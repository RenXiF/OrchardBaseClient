<template>
	<view class="index_home flex_columns">
		<u-swiper :list="list" name="imgAddress" effect3d @click="yulan(list)"></u-swiper>
		<view class="" v-if="sortlist.length!=0">
			<u-grid :col="4" :border="false">
				<u-grid-item v-for="(item ,index) in sortlist" :key="index"
					@click="doUrl('pages/index/goodsList',item)">
					<u-icon :name="item.logo?item.logo:'/static/index/menu1.png'" size="80" :custom-style="{'border-radius':'30px'}"
						imgMode="scaleToFil"></u-icon>
					<view class="grid-text">{{item.dictionaryValue}}</view>
				</u-grid-item>
			</u-grid>
		</view>

		<view class="u-p-30">
			<text class="u-font-xl ft-wh">推荐商品</text>
		</view>
		<view class="flex_columns">
			<view class="flex_between commodity flex_center u-p-b-20 u-p-t-20 u-border-bottom "
				v-for="(item ,index) in datalist" :key="index">
				<image :src="item.commodityImges?item.commodityImges:'/static/index/menu2.png'" mode="widthFix" @click="doUrlli(item)"></image>
				<view class="flex_columns " style="width: 65%;">
					<text class="u-font-xl ft-wh" @click="doUrlli(item)">{{item.commodityName}}</text>
					<view class="flex_between flex_center" style="width: 100%;margin-top: 70rpx;">
						<cn-money :money="item.commodityPrice" thousandth :size="48" color="#FA3534"></cn-money>
						<!-- <u-icon name="plus-circle-fill" color="#010101" size="60" @click="popshow(item)"></u-icon> -->
						<view class="cartadd" @click="popshow(item)">
							<text class="u-font-md">购买</text>
						</view>
					</view>
				</view>
			</view>
			<u-empty mode="list" v-if="datalist.length==0"></u-empty>
			<u-loadmore :status="loadStatus" :load-text="loadText" v-if="datalist.length!=0" />
		</view>
		<!-- 弹出框 -->
		<u-popup v-model="show" mode="bottom" length="500" safe-area-inset-bottom @open="openPOP()" @close="closePOP()"
			closeable>
			<view class="flex_columns popup" v-if="popupli">
				<view class="flex_rows">
					<image :src="popupli.imgRess" mode="aspectFill"></image>
					<view class="flex_columns u-m-l-20">
						<text class="u-font-xl u-m-b-20">{{popupli.goodsName}}</text>
						<cn-money
							:money="userlist.usrLevel && userlist.usrLevel>=1?popupli.memberProce:popupli.goodsPrice"
							thousandth :size="48" color="#FA3534"></cn-money>
					</view>
				</view>
				<view class="flex_center flex_between">
					<text class="ft-wh">数量：</text>
					<u-number-box v-model="goodsSum" :min="1" @change="valChange"></u-number-box>
				</view>
				<view class=" u-p-10 u-m-t-30">
					<u-button :ripple="true" type="error" @click="cartadd()">添加购物车</u-button>
				</view>
			</view>
		</u-popup>
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
				show: false,
				keyword: '',
				list: [
					{
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
				datalist: [],
				userlist: {},
				popupli: {},
				goodsSum: 1,
				itemlist: {},
				sortlist: [
					// {dictionaryValue:'苹果'},
					// {dictionaryValue:'西瓜'},
					// {dictionaryValue:'梨'},
					// {dictionaryValue:'菠萝'}
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
				this.getGoods(); //初始化
				setTimeout(function() {
					this.loadStatus = 'nomore';
				}, 2000)
			}
		},
		methods: {
			// 初始化数据
			initialization() {
				// if (this.utils.isLogin()) {
				// 	this.userlist = uni.getStorageSync('userlist');
				// 	// console.log(this.userlist)
				// }
				this.utils.showloading('正在刷新');
				this.datalist = [];
				this.pageNum = 1;
				this.more = true;
				// this.getBygId(); //获取轮播
				this.getSort(); //获取分类
				this.getGoods(); //初始化
			},
			doUrlli(item) {
				uni.setStorageSync('buylist', item);
				this.doUrl('pages/index/productDetails');
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
			getSort() { //获取分类
				var li = {
					// sortId: 0,
					pageNum: 0,
					pageSize: 0,
				};
				this.http.getApi('dictionaries/list', li, 'post').then(res => {
					console.log(res);
					this.sortlist = res.list;
					console.log(this.sortlist);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			popshow(item) {
				this.popupli = item.good;
				this.popupli.imgRess = item.imgList.length != 0 ? item.imgList[0].imgAddress : '/static/index/menu1.png';
				this.show = true;
				// console.log(this.popupli)
			},
			getGoods() {
				if (this.more == false) {
					// this.utils.error('暂无下页');
					this.loadStatus = 'nomore';
					return;
				}
				let li = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}
				console.log(li)
				this.http.getApi('commodity/list', li, 'post').then(res => {
					console.log(res)
					this.more = res.pages>this.pageNum?true :false;
					this.total = res.pages;
					this.pageNum = this.more ? this.pageNum + 1 : this.pageNum;
					this.datalist = this.pageNum > 1 ? this.datalist.concat(res.list) : res.list;
					this.loadStatus = this.more ? 'loadmore' : 'nomore';
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			closePOP() { //关闭弹窗
				// console.log(this.popupli);
			},
			cartadd() {
				this.show = false;
				if (this.utils.isLogin()) {
					this.utils.showloading();
					this.carAdd(this.popupli);
				} else {
					this.utils.error('请先登录账号');
				}
			},
			openPOP() { //打开弹窗
				// this.popupli = this.buylist.good;
				// this.popupli.imgRess = this.mainimg[0].imgAddress;
				this.userlist.usrId ? this.popupli.usrId = this.userlist.usrId : this.utils.error('请先登录账号');
				console.log(this.popupli);
			},
			valChange(e) {
				// console.log(e);
				this.goodsSum = e.value;
			},
			getBygId() { //获取轮播
				var li = {
					goodsId: 0,
					pageNum: 1,
					pageSize: 99,
				};
				this.http.getApi('img/getBygId', li, 'get').then(res => {
					// console.log(res);
					this.list = res.data;
					// uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			carAdd(list) {
				let li = {
					usrId: list.usrId,
					goodsId: list.goodsId,
					goodsName: list.goodsName,
					goodsSum: this.goodsSum,
					goodsPrice: this.userlist.usrLevel >= 1 ? list.memberProce : list.goodsPrice,
					imgRess: list.imgRess,
				}
				console.log(li);
				if (!li.usrId) {
					uni.hideLoading();
					this.utils.error('请先登录账号');
					return;
				}
				this.http.getApi('car/add', li, 'post').then(res => {
					console.log(res);
					this.goodsUp(li.goodsId, li.goodsSum); //添加销量
					uni.hideLoading();
					this.utils.success('添加成功！');
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.msg);
				});
			},
			goodsUp(goodsId, sumTwo) { //修改商品
				this.http.getApi('goods/up', {
					goodsId: goodsId,
					sumTwo: this.popupli.sumTwo == null ? sumTwo : this.popupli.sumTwo + sumTwo
				}, 'post').then(res => {
					console.log(res);
					// uni.hideLoading();
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
	.search {
		padding: 10rpx 0;
		background-color: #dcdcdc;
	}

	.cartadd {
		border: #FA3534 1rpx solid;
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		color: #FA3534;
	}

	// 弹窗样式
	.popup {
		padding: 30rpx;

		image {
			width: 200rpx;
			height: 200rpx;
			border-radius: 15rpx;
		}
	}

	.commodity {
		width: 100%;
		height: 100%;
		padding: 0 30rpx;

		image {
			width: 30%;
			max-height: 200rpx;
			border-radius: 8rpx;
		}
	}
</style>

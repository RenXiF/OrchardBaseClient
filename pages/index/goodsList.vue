<template>
	<!-- 商品页面 -->
	<view class="flex_columns" style="max-width: 100%;">
		<view class="flex_columns">
			<view class="">
				<HMfilterDropdown :menuTop="0" :filterData="filterData" :defaultSelected="defaultSelected"
					:updateMenuName="true" @confirm="confirm" dataFormat="Object" @reset="resetS"></HMfilterDropdown>
			</view>
			<view class="flex_columns u-p-20" style="margin-top: 70rpx;">
				<view class="wrap" style="width: 100%;" v-if="datalist">
					<u-waterfall v-model="datalist" ref="uWaterfall">
						<template v-slot:left="{ leftList }">
							<view class="demo-warter" v-for="(item, index) in leftList" :key="index"
								@click="doUrlli(item.id)">
								<!-- 微信小程序需要hx2.8.11版本才支持在template中引入其他组件，比如下方的u-lazy-load组件 -->
								<u-lazy-load threshold="-450" border-radius="10" :image="item.commodityImges" :index="index">
								</u-lazy-load>
								<view class="demo-title" v-if="item.commodityName">{{ item.commodityName }}</view>
								<view class="demo-shop" v-if="item.commodityDescribe">{{ item.commodityDescribe }}</view>
								<view class="demo-shop">销量{{ item.commoditySale }}</view>
								<!-- 千分位 -->
								<!-- <money :money="item.price" thousandth :size="40" unitPosition="right"></money> -->
								<view class="demo-price" v-if="item.commodityPrice">{{ item.commodityPrice }}元</view>
							</view>
						</template>
						<template v-slot:right="{ rightList }">
							<view class="demo-warter" v-for="(item, index) in rightList" :key="index"
								@click="doUrlli(item.id)">
								<u-lazy-load threshold="-450" border-radius="10" :image="item.commodityImges" :index="index">
								</u-lazy-load>
								<view class="demo-title" v-if="item.commodityName">{{ item.commodityName }}</view>
								<view class="demo-shop" v-if="item.commodityDescribe">{{ item.commodityDescribe }}</view>
								<view class="demo-shop">销量{{ item.commoditySale }}</view>
								<!-- 千分位 -->
								<!-- <money :money="item.price" thousandth :size="40" unitPosition="right"></money> -->
								<view class="demo-price" v-if="item.commodityPrice">{{ item.commodityPrice }}元</view>
							</view>
						</template>
					</u-waterfall>
					<u-empty mode="list" v-if="loadStatus==='nomore'&& datalist.length==0"></u-empty>
					<u-loadmore :status="loadStatus" @loadmore="getlist"></u-loadmore>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import HMfilterDropdown from '@/components/HM-filterDropdown/HM-filterDropdown.vue'; //筛选
	import data from '@/common/js/data.js'; //筛选菜单数据
	import money from '@/components/cn-money/cn-money.vue';
	import appli from '@/common/js/applist.js';
	export default {
		components: {
			HMfilterDropdown,
			money
		},
		data() {
			return {
				ali: appli,
				loadStatus: 'loadmore',
				more: false, //是否下页
				datalist: [
					// {
					// 	price: 35,
					// 	title: '北国风光，千里冰封，万里雪飘',
					// 	shop: '李白杜甫白居易旗舰店',
					// 	image: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg',
					// },
				], //数据列表
				yuanSli: [], //原始数据

				filterData: [],
				defaultSelected: [],
				indexArr: [],
				valueArr: [],

				Slist: {
					commodityClass: null,//分类名
					collection: 0,
					sort:0,//价格排序
					state:2,//已上架
					recommend:1,//必传
					pageNum: 1, // 第几页
					pageSize: 10, // 每页数
				},
				li: {}, //页面传值
				pageNum: 1, // 第几页
				pageSize: 5, // 每页数
				total: 5, // 数据总条数
			};
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.ali.extitle,
				path: '/pages/index/index'
			}
		},
		onShow() {

		},
		onLoad(e) {
			// console.log(e)
			if (e) {
				this.li = e;
				this.Slist.commodityClass = e.dictionaryvalue;
			}
			this.initialization(); //初始化
			// this.getBrand();
			setTimeout(() => {
				this.filterData = data;
				//设置选中项
				// 一下的注释是针对测试数据说明结构的意思，具体传入什么数据，要看你自己数据。如果data.js数据有修改，注意defaultSelected也要修改
				//传入defaultSelected的结构不能错，错了就报错运行异常。 不想选中的请传入null
				// this.defaultSelected = [
				// 	[1,1,0],				//第0个菜单选中 一级菜单的第1项，二级菜单的第1项，三级菜单的第3项
				// 	[null,null],			//第1个菜单选中 都不选中
				// 	[1],					//第2个菜单选中 一级菜单的第1项
				// 	[[0],[1,2,7],[1,0]],	//筛选菜单选中 第一个筛选的第0项，第二个筛选的第1,2,7项，第三个筛选的第1,0项
				// 	[[0],[1],[1]]			//单选菜单选中 第一个筛选的第0项，第二个筛选的第1项，第三个筛选的第1项
				// ];
			}, 100);

			//模拟ajax请求子菜单数据。
			// setTimeout(()=>{
			// 	this.filterData[1].submenu[0].submenu = [{"name": "附近","value": "附近"},{"name": "1km","value": "1km"},{"name": "2km","value": "2km"},{"name": "3km","value": "3km"},{"name": "4km","value": "4km"},{"name": "5km","value": "5km"}];
			// },1000)
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
			if (this.datalist == []) {
				return;
			} else {
				console.log('触底刷新');
				this.loadStatus = 'loading';
				// this.getlist();
				// this.loadStatus = 'loadmore';
			}
		},
		methods: {
			//重置品牌
			resetS() {
				// console.log('执行重置')
				// uni.removeStorageSync("setBrand");
				// this.Slist.brandId = null;
				// this.filterData[4].name = '品牌';
			},
			getBrand() { //获取品牌
				this.http.getApi('brand/getAll', {}, 'get').then(res => {
					// console.log(res);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
				});
			},
			//接收菜单结果
			confirm(e) {
				// console.log(e)
				this.indexArr = e.index;
				this.valueArr = e.value;
				this.Slist.collection = this.valueArr[0][0]? this.valueArr[0][0] : 0;
				this.Slist.sort = this.valueArr[1][0] ? this.valueArr[1][0] : 0;
				// console.log(this.indexArr)
				// console.log(this.valueArr);
				this.initialization();
			},
			//修改选中项-示例
			changeSelected() {
				this.defaultSelected = [];
				this.$nextTick(() => {
					this.defaultSelected = [
						[1, 1, 0], //第0个菜单选中 一级菜单的第1项，二级菜单的第1项，三级菜单的第3项
						[null, null], //第1个菜单选中 都不选中
						[1], //第2个菜单选中 一级菜单的第1项
						[
							[0],
							[1, 2, 7],
							[1, 0]
						], //筛选菜单选中 第一个筛选的第0项，第二个筛选的第1,2,7项，第三个筛选的第1,0项
						[
							[0],
							[1],
							[1]
						] //单选菜单选中 第一个筛选的第0项，第二个筛选的第1项，第三个筛选的第1项
					];
				})
			},


			// 初始化数据
			initialization() {
				this.utils.showloading('正在加载...');
				this.datalist = [];
				this.yuanSli = [];
				this.Slist.pageNum = 1;
				this.more = true;
				this.getlist();
			},
			clear() { //清空瀑布流
				this.$refs.uWaterfall.clear();
			},
			addRandomData(list) {
				if (this.Slist.pageNum == 1) {
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
			//获取所有商品列表
			getlist() {
				if (this.more == false) {
					this.utils.error('暂无下页');
					this.loadStatus = 'nomore';
					return;
				}
				console.log(this.Slist)
				this.http.getApi('commodity/list', this.Slist, 'post').then(res => {
					console.log(res);
					this.more = res.pages>this.Slist.pageNum?true :false;
					this.total = res.pages;
					this.Slist.pageNum = this.more ? this.Slist.pageNum + 1 : this.Slist.pageNum;
					this.addRandomData(res.list);
					this.loadStatus = this.more ? 'loadmore' : 'nomore';
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.loadStatus = 'nomore';
					uni.hideLoading();
					this.utils.error('暂无记录');
				});

				// setTimeout(() => {}, 1000);

			},
			doUrlli(id) {
				console.log(id)
				// this.$refs.uWaterfall.remove(id);
				for (let i = 0; i < this.yuanSli.length; i++) {
					if (this.yuanSli[i].id == id) {
						uni.setStorageSync('buylist', this.yuanSli[i]);
						this.doUrl('pages/index/productDetails');
					}
				}

			},
		}
	}
</script>
<style>
	/* page不能写带scope的style标签中，否则无效 */
	page {
		background-color: rgb(240, 240, 240);
	}
</style>
<style lang="scss" scoped>
	.navbar {
		width: 100%;
		height: 120rpx;
		color: #FFFFFF;
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

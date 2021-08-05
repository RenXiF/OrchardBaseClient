<template>
	<view class="container">
		<car-list ref="mycar" :carList="carList" @allSelBtn="allSelBtn" @selShop="selShop" @selGoods="selGoods"
			@jsbtn="jsbtn" @delbtn="delbtn" @changeNum="changeNum" v-if="carList[0].glist.length !=0"></car-list>
		<u-empty mode="car" v-if="carList[0].glist.length ==0" style="margin-top: 300rpx;"></u-empty>

	</view>
</template>

<script>
	import carList from '@/components/car-list/car-list.vue'
	export default {
		components: {
			carList
		},
		data() {
			return {
				maskTitle: '',
				carList: [{
					shopId: 1,
					title: "自营店",
					total: 2,
					goodsAmount: 6051,
					selected: false,
					glist: [
						{
							id: 236,
							gid: 47,
							name: "毛巾（厚）",
							img: "https://xthotel.palmbly.com/uploads/images/20201020/fb54b8d699c646908fde0af12def5a5b.png",
							gsId: 72,
							spec_key_name: "尺寸:M 颜色:黑色",
							spec: [{
								name: "尺寸",
								value: "M"
							}, {
								name: "颜色",
								value: "黑色"
							}],
							price: 19,
							number: 1,
							stock: 193,
							selected: true,
						},
					]
				}, ],
				loadStatus: 'nomore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				userlist: {},
				datalist: [], //原数据
				more: false, //是否下页
				pageNum: 1, // 第几页
				pageSize: 99, // 每页数
				total: 5, // 数据总条数

				orderFound: {
					userId: '', //

					phone: '', //

					opendId: '', //

					usrName: '', //

					amount: 0, //总价

					status: 0, //支付状态

					quantity: 0, //数量

					body: '测试', //
					paytype: 1, //1微信支付
				}

			};
		},
		onLoad(e) {
			console.log(e);
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				console.log(this.userlist);
				this.initialization(); //初始化
			} else {
				this.utils.error('请先登录账号！')
			}
		},
		onShow() {
			// console.log('执行初始化');
			// if (this.utils.isLogin()) {
			// 	this.initialization(); //初始化
			// }
		},
		methods: {
			// 初始化数据
			initialization() {
				this.more = true;
				this.pageNum = 1;
				this.datalist = [];
				this.carList[0].glist = [];
				this.carList[0].selected = false;
				this.getByU(); //初始化

			},
			getByU() {
				if (this.more == false) {
					this.utils.error('暂无下页');
					this.loadStatus = 'nomore';
					return;
				}
				let li = {
					userId: this.userlist.id,
					state: 1,
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				}
				// console.log(li)
				this.http.getApi('order/query', li, 'post').then(res => {
					console.log(res);
					this.more = res.pages>this.pageNum?true :false;
					this.total = res.pages;
					this.pageNum = this.more ? this.pageNum + 1 : this.pageNum;
					this.datalist = this.pageNum > 1 ? this.datalist.concat(res.list) : res.list;
					this.loadStatus = this.more ? 'loadmore' : 'nomore';
					// this.loadStatus = this.more ? 'loadmore' : 'nomore';
					this.screen(this.datalist);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			screen(list) {
				var that = this;
				console.log(list);
				for (let i = 0; i < list.length; i++) {
					let item = {
						id: list[i].id,
						name: list[i].title,
						img: list[i].img,
						price: Number(list[i].price),
						number: list[i].quantity,
						goodsId: list[i].commodityId,
						spec_key_name: list[i].specificationsName,
						selected: false,
					}
					that.carList[0].glist.push(item);
				}
				console.log(that.carList);
				// that.$refs.mycar.getAllMount(); //计算价格展示
			},
			confirm: function() { //确定按钮
				console.log('您点击了确定按钮');
			},
			cancel: function() { //取消按钮
				console.log('您点击了取消按钮');
			},
			selGoods: function(carList) {
				var that = this;
				that.carList = carList;
				console.log('selGoods' + carList);
			},
			selShop: function(carList) {
				var that = this;
				that.carList = carList;
				console.log('selShop' + carList);
			},
			allSelBtn: function(carList) {
				var that = this;
				that.carList = carList;
				console.log('allSelBtn' + carList);
			},
			jsbtn: function(ids) { //结算按钮
				var that = this;
				console.log(ids);

				uni.setStorageSync('BespeakInfo', ids);
				that.doUrl('pages/user/order/goods_order');
			},
			OrderFound() { //主订单
				this.http.getApi('Order/found', li, 'get').then(res => {
					console.log(res);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			wxPayorder() { //支付订单
				let li = {
					orderNo: '45946516545615',
					amount: 0.01,
					body: '测试',
					opendid: this.userlist.openId
				}
				console.log(li);
				this.http.getApi('wxPay/unifiedOrder', li, 'get').then(res => {
					console.log(res);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			delbtn: function(ids, list) { //删除按钮
				var that = this;
				/* 
		                 请求接口数据
		
		                */
				console.log(ids);
				for (let t = 0; t < ids.length; t++) {
					that.carDe(ids[t].id);
				}
				console.log(list);
				for (let i = 0; i < list.length; i++) {
					for (let k = 0; k < list[i].glist.length; k++) {
						if (list[i].glist[k].selected == true) {
							list[i].glist.splice(k, 1);
							k--
						}
					}
					if (list[i].glist.length == 0) { //若当前店铺商品删除完，删除当前店铺
						list.splice(i, 1);
						i--
					}
				}
				that.carList = list;
				that.utils.success('删除成功！');
				that.$refs.mycar.getAllMount(list); //计算价格展示
			},
			carDe(CarId) {
				let li = [CarId];
				this.http.getApi('order/delete',li, 'post').then(res => {
					console.log(res);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			changeNum: function(total, carList, shopIndex, gIndex, number, id, type) {
				var that = this;
				/* 
		                 请求接口数据
		
		                */
				// console.log(total);
				// console.log(carList);
				// console.log(shopIndex);
				// console.log(gIndex);
				// console.log(number);
				// console.log(id);
				// console.log(type);
				carList[shopIndex].glist[gIndex].number = number;
				if (type == 0) {
					carList[shopIndex].total = total - 1;
				} else {
					carList[shopIndex].total = total + 1;
				}
				that.carList = carList;
				that.$refs.mycar.getAllMount(carList); //计算价格展示
			}
		},
	}
</script>

<style lang="scss">
	page {
		background: #f5f5f5;
	}

	view,
	textarea,
	input,
	text,
	button {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-size: 28rpx;
		font-family: "微软雅黑";
	}

	.uni-checkbox-input {
		border-radius: 50% !important;
	}

	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
		background: #f5f5f5;
		overflow: hidden;
	}

	.line1 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: box;
		display: -webkit-box;
		line-clamp: 1;
		box-orient: vertical;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		word-break: break-all;
		/* 英文换行问题 */
	}

	.line2 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: box;
		display: -webkit-box;
		line-clamp: 2;
		box-orient: vertical;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
		/* 英文换行问题 */
	}

	.centerboth {
		display: flex;
		display: -webkit-flex;
		align-items: center;
		-webkit-align-items: center;
		justify-content: center;
		-webkit-justify-content: center;
	}

	.clearfix:after {
		content: "";
		display: block;
		visibility: hidden;
		height: 0;
		clear: both;
	}

	.clearfix {
		zoom: 1;
	}

	image {
		padding: 0;
		margin: 0;
	}

	textarea {
		width: 300rpx;
		height: 75rpx;
		display: block;
		position: relative;
		font-size: 28rpx;
	}

	button::after {
		border: none;
	}

	input:-ms-input-placeholder {
		color: #808080;
	}

	car-list {
		width: 100%;
	}
</style>

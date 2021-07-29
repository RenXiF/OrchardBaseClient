<template>
	<!-- 订单提交 -->
	<view class="server_order">
		<!-- <view class="height_20"></view> -->
		<u-tabs-swiper ref="tabs" name="name" count="count" active-color="#ff8878" :list="menuTabs"
			:current="currentTab" :is-scroll="false" @change="tabsChange" class="">
		</u-tabs-swiper>
		
		<view class="order_top u-m-t-20">
			<view class="order_address flex_rows space_bet  border_bottom" @click="doUrl('pages/address/ment_address', { select: 1 })" v-if="!Self">
				<view class="address_left" v-if="addrInfo.address">
					<view class="left_address ellipsis">{{addrInfo.address}}</view>
					<view class="left_phone"><text>{{addrInfo.usrName}}</text>{{addrInfo.usrPhone}}</view>
				</view>
				<view class="address_left" v-else>
					<view class="left_address">请选择服务地址</view>
				</view>
				<view class="Icon right_icon">&#xe638;</view>
			</view>
			
			<view class="order_address flex_rows space_bet  border_bottom"  v-if="Self" @click="getLocation()">
				<view class="address_left" v-if="addSelf.address">
					<view class="left_address ellipsis">{{addSelf.address}}</view>
					<view class="left_phone"><text>{{addSelf.usrName}}</text>{{addSelf.usrPhone}}</view>
				</view>
				<view class="Icon right_icon">&#xe638;</view>
			</view>
		</view>
		<view class="order_detail">
			<view class="detail_header">
				<u-icon name="/static/tabBar/1-1.png" size="38" color="#ff8878"></u-icon>
				<text class=" u-font-md ft-wh u-m-l-10">自营</text>
			</view>
			<view class="detail_cont flex_rows " v-for="(item ,index) in goodsList" :key="index">
				<view class="cont_img" v-if="item.img!='string'">
					<image :src="item.img" mode=""></image>
				</view>
				<!-- <view class="cont_img" v-else>
					<image :src="goodsList.coverUrls[0]" mode=""></image>
				</view> -->
				<view class="cont_text columns">
					<view class="text_top">
						<view class="text_tit" v-if="piece">{{item.name}}/件</view>
						<view class="text_tit" v-else>{{item.name}}</view>
						<view class="text_des">数量：{{item.number}}</view>
					</view>
					<view class="text_bot">
						<text class="bot_num" v-if="item.price">{{formatPrice(item.price)}}</text>
					</view>
					
				</view>
				
			</view>
			
		</view>
		<view class="order_news">
			<!-- <view class="news_coupon flex_rows space_bet border_bottom" v-if="receiveText">
				<view class="coupon_left flex_rows">
					<view class="left_text">优惠券</view>
					<view class="left_icon">已选1张</view>
				</view>
				<view class="coupon_right flex_rows">
					<view class="right_coupon">{{receiveText}}元优惠券</view>
					<text class="Icon right_icon">&#xe638;</text>
				</view>
			</view> -->
			<view class="news_note flex_rows space-between space_bet" @click="doUrl('pages/index/note_submit')">
				<view class="note_left">留言</view>
				<view class="note_right flex_rows" v-if="orderFound.spareTwo!=''">
					<text class="Icon right_icon ellipsis">{{orderFound.spareTwo}}</text>
					<text class="Icon right_icon">&#xe638;</text>
				</view>
				<view class="note_right flex_rows" v-else>建议留言前沟通确认<text class="Icon right_icon">&#xe638;</text></view>
			</view>
		</view>
		<view class="order_price">
			<view class="price_top flex_rows space_bet border_bottom">
				<view class="top_first">
					<view class="first_price">商品价格</view>
					<view class="first_price">商品数量</view>
					<!-- <view class="" v-if="receiveText!=''">优惠</view> -->
				</view>
				<view class="top_sencond">
					<view class="sencond_num" v-if="payment">{{formatPrice(payment)}}元</view>
					<view class="sencond_num" v-if="orderFound.quantity!=0 && piece">×{{orderFound.quantity}}件</view>
					<view class="sencond_num" v-if="orderFound.quantity!=0 && !piece">×{{orderFound.quantity}}</view>
					<!-- <view class="sencond_coupon" v-if="receiveText!=''">优惠券
						<text class="coupons_num" v-if="receiveText">-{{formatPrice(receiveText)}}元</text>
					</view> -->
				</view>
			</view>
			<view class="price_bot flex_rows">
				<text v-if="receiveText!=''">已优惠 <text class="bot_money" v-if="receiveText">{{formatPrice(receiveText)}}元</text></text>
				<text class="bot_left">小计<text class="bot_money" v-if="payment">￥{{formatPrice(payment)}}元</text></text>
			</view>
		</view>
		<text class=" text_des " v-if="piece">(注：成为会员后商品只能按件购买)</text>
		<view class="order_button flex_rows">
			<view class="button_money">
				实付：<text class="money_num" v-if="payment">￥{{formatPrice(payment)}}</text>
			</view>
			<!-- <view class="button_buy" v-if="isBulk" @click="doUrl('pages/mall/order_detail',{isbulk: true})">提交订单</view> -->
			<view class="button_buy" @click="submit">提交订单</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isBulk: false,
				Self:false,//是否自提
				currentTab: 0,
				menuTabs: [
					{
						name: '快递配送'
					},
					{
						name: '上门自提'
					}
				],
				bulkImgList: [],
				productId: '', //接收的商品id
				data: {}, //加载商品信息
				rdata: null, //当前日期
				tdata: null, //当前时间
				goodsname: '', //加载商品名
				goodsList: [], //加载商品缓存
				addrInfo: null, //加载用户地址
				addSelf: {//自提地址
					address: '渝欧教育城B区4-1-8号门面',
					provincial: '贵州省', //省份
					city: '遵义市', //市份
					area: '红花岗区', //县份
					usrPhone: '17102338333',
					usrName: '自提'
				},
				remark: '', //加载备注
				payment: 0, //实际支付金额
				orderLis: {},
				receiveText: 0,
				orderFound:{
					userId:'',//
					phone:'',//
					opendId:'',//
					usrName:'',//
					spareOne:'',//详细地址
					spareTwo:'',//留言
					amount:0,//总价
					status:0,//支付状态
					quantity:0,//数量
					body:'测试',//
					paytype:1,//1微信支付
				},
				userlist: {},
				zorder:{},//主订单
				piece:false,//件起购
				openId: '',

			}
		},

		onShow() {
			this.openId = uni.getStorageSync('WXopenid');
			this.goodsList = uni.getStorageSync('BespeakInfo'); //加载缓存
			this.addrInfo = uni.getStorageSync('setAddr'); //加载地址
			this.orderFound.spareTwo = uni.getStorageSync('Remark'); //获取备注
			this.Calculation(); //加载计算
			console.log(this.goodsList);
			console.log(this.addrInfo);
			console.log(this.userlist);
			// console.log(this.userlist.openId);
			// console.log(this.openId);
		},
		onLoad(options) {
			console.log(options);
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				this.orderFound.userId = this.userlist.usrId;
				this.piece = this.userlist.usrLevel>0?true:false;
				// this.orderFound.userId = 8;
				
				
				// this.orderFound.phone = this.addrInfo.usrPhone;
				// this.orderFound.usrName = this.addrInfo.usrName;
				// this.orderFound.spareOne = this.addrInfo.address;
				this.orderFound.opendId = this.userlist.openId;
				
				console.log(this.userlist);
			} else {
				this.utils.error('请先登录账号！');
			}
		},
		onUnload() {
			uni.removeStorageSync('Remark'); //清除备注缓存
		},
		computed: {
			//保留两位小数
			formatPrice() {
				return function(val) {
					return parseFloat(val).toFixed(2);
				}
			},
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				console.log(index)
				this.currentTab = index;
				// this.initialization();
				this.Self = index==0?false:true;
				
			},
			//查看地址
			getLocation(){
				let that = this;
				uni.getSetting({
					success: function (t) {
						console.log(t)
						if (!t.authSetting['scope.userLocation']) {
							console.log('11111111');
							uni.authorize({
								scope: 'scope.userLocation',
								success: function (s) {
									console.log(s)
									uni.openLocation({
										address: '贵州省遵义市红花岗区长新大道与东联二线交叉口',
									    latitude: 27.678051698,
									    longitude: 106.972996349,
										name: '渝欧教育城B区4-1-8号门面',
									    success: function () {
									        console.log('success');
									    }
									});
								}
							})
						} else {
							uni.openLocation({
								address: '贵州省遵义市红花岗区长新大道与东联二线交叉口',
							    latitude: 27.678051698,
							    longitude: 106.972996349,
								name: '渝欧教育城B区4-1-8号门面',
							    success: function () {
							        console.log('success');
							    }
							});
						}
					}
				});
			},
			//计算订单
			Calculation() {
				var pay = 0;
				var Num = 0;
				for (let i=0;i<this.goodsList.length;i++) {
					if(this.piece){
						this.goodsList[i].price=this.goodsList[i].price * 6;
					}
					pay = pay + this.goodsList[i].price * this.goodsList[i].number;
					Num = Num + this.goodsList[i].number;
				}
				
				console.log(pay);
				console.log(Num);
				this.payment = pay;
				this.orderFound.quantity = Num;
				this.orderFound.amount = this.payment;
			},
			addressG(){//检测是否自提
				if (this.Self) {
					this.orderFound.phone = this.addSelf.usrPhone!=null?this.addSelf.usrPhone:'';
					this.orderFound.usrName = this.addSelf.usrPhone!=null?this.addSelf.usrName:'';
					this.orderFound.spareOne = this.addSelf.usrPhone!=null?this.addSelf.provincial+this.addSelf.city+this.addSelf.area+this.addSelf.address:'';
				} else{
					this.orderFound.phone = this.addrInfo.usrPhone!=null?this.addrInfo.usrPhone:'';
					this.orderFound.usrName = this.addrInfo.usrPhone!=null?this.addrInfo.usrName:'';
					this.orderFound.spareOne = this.addrInfo.usrPhone!=null?this.addrInfo.provincial+this.addrInfo.city+this.addrInfo.area+this.addrInfo.address:'';
				}
			},
			//执行提交订单
			submit() {
				console.log(this.orderFound);
				this.addressG();
				if(this.orderFound.phone==''&&this.orderFound.usrName==''&&this.orderFound.spareOne==''){
					this.utils.error('请选择地址！');
					return;
				}
				let jsonData = this.orderFound;
				jsonData.amount = jsonData.amount * 100;
				// jsonData.userId = 7;
				console.log(jsonData);
				this.utils.showloading();
				this.OrderFound(jsonData);
			},
			OrderFound(jsonData) { //主订单
				this.http.getApi('Order/found', jsonData, 'post').then(res => {
					console.log(res);
					// this.csjjj(res.data);
					this.zorder = res.data;
					this.screen(this.goodsList,res.data.orderId,(data)=>{
						console.log(data);
						console.log('执行子订单');
						this.corderAdd(data);
					});
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.msg);
				});
			},
			csjjj(jsonData){
				// console.log('执行子订单');
				console.log(jsonData);
				this.http.getApi('wxPay/endOrder', jsonData, 'post').then(res => {
					console.log(res);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			corderAdd(jsonData) { //子订单
				this.http.getApi('corder/add', jsonData, 'post').then(res => {
					console.log(res);
					// uni.hideLoading();
					this.wxPayorder();
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.msg);
				});
			},
			wxPayorder() { //支付订单
				let li = {
					orderNo: this.zorder.orderNo,
					// amount: 0.01,
					amount: this.zorder.amount / 100,
					body: this.zorder.body,
					opendid: this.userlist.openId
				}
				console.log(li);
				this.http.getApi('wxPay/unifiedOrder', li, 'get').then(res => {
					console.log(res);
					this.paymentorder(res.data);
					// uni.hideLoading();
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.msg);
				});
			},
			paymentorder(data) {
				// console.log('执行');
				console.log(data);
				var _this = this;
				console.log('执行支付');
				_this.utils.showloading('正在支付');
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: data, //微信、支付宝订单数据
					// #ifdef MP-WEIXIN 
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType,
					paySign: data.paySign,
					// #endif
					success: function(res) {
						console.log(res);
						_this.fordecar(_this.goodsList);
						_this.upfor(_this.goodsList);
						_this.utils.success('支付成功！',()=>{
							_this.utils.navback();
							uni.hideLoading();
						});
						// _this.addBarrage(_this.order);
					},
					fail: function(err) {
						// console.log('qqqqqqqqqq');
						console.log(data);
						console.log(err);
						console.log(_this.goodsList);
						_this.fordecar(_this.goodsList);
						_this.upfor(_this.goodsList);
						_this.utils.error('您已取消支付！',()=>{
							_this.utils.navback();
							uni.hideLoading();
						});
					}
				});
			},
			fordecar(list){
				for (let i=0;i<list.length;i++) {
					this.carDe(list[i].id);
				}
			},
			upfor(list){//修改销量
				if(list.length!=0){
					for (let i=0;i<list.length;i++) {
						if (this.piece) {
							this.goodsUp(list[i].goodsId,list[i].number*6);
						} else{
							this.goodsUp(list[i].goodsId,list[i].number);
						}
					}
				}
			},
			goodsUp(goodsId,sumTwo) {//修改商品
				this.http.getApi('goods/up', {
					goodsId: goodsId,
					sumTwo:sumTwo
				}, 'get').then(res => {
					console.log(res);
					// uni.hideLoading();
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.msg);
				});
			},
			carDe(CarId) {
				this.http.getApi('car/de', {
					shopCarId: CarId
				}, 'get').then(res => {
					console.log(res);
					// uni.hideLoading();
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.msg);
				});
			},
			screen(list,Order,data) { //筛选
				let tt = [];
				tt = list.map(iterator => {
					return {
						spareOne: iterator.name,
						goodsSum: iterator.number,
						goodsId: iterator.goodsId,
						orderId: Order,
						imgRess: iterator.img,
						priceSum: iterator.price *iterator.number,
						goodsPrice:iterator.price
					}
				});
				data(tt);
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F8F8F8;
	}
	.server_order {
		padding-bottom: 200upx;
		background-color: #F8F8F8;

		.height_20 {
			height: 20upx;
			background-color: #F8F8F8;
		}

		.border_bottom {
			border-bottom: 2upx solid #F8F8F8;
		}

		.space_bet {
			justify-content: space-between;
			align-items: center;
		}

		>view {
			background-color: #FFFFFF;
			margin-top: 20upx;
		}

		.order_bulk {
			.bulk_head {
				font-size: 28upx;
				color: #333333;
				padding: 20upx 30upx;
				border-bottom: 1upx solid #F8F8F8;

				.head_color {
					color: #FFA600;

					.pin_icon {
						font-size: 28upx;
						color: #FFA600;
						margin-right: 5upx;
					}
				}
			}

			.bulk_img {
				padding-top: 30upx;
				justify-content: center;
				align-items: flex-start;

				.img_item {
					margin-right: 30upx;
					position: relative;

					>image {
						width: 85upx;
						height: 85upx;
					}

					.img_text {
						position: relative;
						top: -20upx;
						width: 70upx;
						height: 27upx;
						background-color: #FFA600;
						color: #FFFFFF;
						line-height: 27upx;
						text-align: center;
						border-radius: 27upx;
						font-size: 20upx;
						margin: 0 auto;
					}
				}

				.img_add {
					width: 85upx;
					height: 85upx;
					border-radius: 50%;
					border: 2upx dashed #A1A1A1;
					text-align: center;
					line-height: 85upx;
					font-size: 35upx;
					color: #A1A1A1;
				}
			}
		}

		.order_top {
			margin-top: 0;
			padding: 0 30upx;

			.order_address {
				height: 160upx;

				.address_left {
					width: 90%;
					color: #333333;

					.left_address {
						font-size: 35upx;
						font-weight: bold;
						margin-bottom: 10upx;
					}

					.left_phone {
						font-size: 26upx;

						text {
							margin-right: 20upx;
						}
					}
				}

				.right_icon {
					font-size: 25upx;
					color: #909090;
				}
			}

			.order_time {
				height: 115upx;

				>view {
					font-size: 30upx;
					color: #333333;
				}
			}
		}

		.order_detail {
			padding: 0 30upx;

			.detail_header {
				padding-top: 10upx;
				font-size: 26upx;
				color: #333333;

				.store_icon {
					font-size: 26upx;
					color: #333333;
					margin-right: 10upx;
				}
			}

			.detail_cont {
				justify-content: flex-start;
				align-items: flex-start;
				padding: 15upx 0;

				.cont_img {
					margin-right: 30upx;
					border-radius: 15upx;
					>image {
						width: 180upx;
						height: 150upx;
						border-radius: 15upx;
					}
				}

				.cont_text {
					justify-content: space-between;
					align-items: flex-start;
					height: 100%;
					padding: 15upx 0;
					box-sizing: border-box;

					.text_top {
						.text_tit {
							font-size: 32upx;
							color: #333333;
							margin-bottom: 10upx;
						}

						.text_des {
							font-size: 26upx;
							color: #A1A1A1;
						}
					}

					.text_bot {
						.bot_num {
							font-weight: bold;
							font-size: 33upx;
							color: #FF0034;
						}

						.bot_des {
							font-size: 20upx;
							color: #333333;
						}
					}
				}
			}
		}

		.order_news {
			padding: 0 30upx;

			>view {
				height: 115upx;
			}

			.right_icon {
				font-size: 25upx;
				color: #333333;
				margin-left: 20upx;
			}

			.news_coupon {
				.coupon_left {
					justify-content: flex-start;
					align-items: center;

					.left_text {
						font-size: 30upx;
						color: #333333;
					}

					.left_icon {
						height: 35upx;
						width: 95upx;
						line-height: 35upx;
						text-align: center;
						font-size: 20upx;
						color: #FFA600;
						border: 2upx solid #FFA600;
						margin-left: 30upx;
						border-radius: 35upx;
					}
				}

				.coupon_right {
					justify-content: flex-end;
					align-items: center;

					.right_coupon {
						border: 2upx solid #FFA600;
						padding: 5upx 10upx;
						font-size: 20upx;
						color: #FFA600;
					}
				}
			}

			.news_note {
				width: 100%;

				.note_left {
					font-size: 30upx;
					color: #333333;
				}

				.note_right {
					font-size: 30upx;
					width: 60%;
					display: flex;
					align-items: center;
					text-align: center;
					justify-content: flex-end;
					color: #A1A1A1;

					text {
						color: #A1A1A1;
					}
				}
			}
		}

		.order_price {
			padding: 0 30upx;

			.price_top {
				height: 160upx;

				.top_first {
					>view {
						font-size: 30upx;
						color: #333333;
					}

					.first_price {
						margin-bottom: 20upx;
					}
				}

				.top_sencond {
					.sencond_num {
						font-size: 30upx;
						color: #333333;
						font-weight: bold;
						margin-bottom: 20upx;
						text-align: right;
					}

					.sencond_coupon {
						font-size: 30upx;
						color: #333333;

						.coupons_num {
							color: #FFA600;
							margin-left: 20upx;
							display: inline-block;
						}
					}
				}
			}

			.price_bot {
				justify-content: flex-end;
				align-items: center;
				height: 80upx;
				font-size: 27upx;

				.bot_money {
					margin-left: 20upx;
					color: #FFA600;
				}

				.bot_left {
					margin-left: 20upx;
				}
			}
		}

		.order_button {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;

			>view {
				height: 115upx;
				line-height: 115upx;
				width: 50%;
				text-align: center;
				font-size: 30upx;
			}

			.button_money {
				.money_num {
					font-size: 48upx;
					color: #FF0034;
					font-weight: bold;
				}
			}

			.button_buy {
				background-color: #FFA600;
				color: #FFFFFF;
			}
		}
	}
</style>

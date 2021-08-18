<template>
	<!-- 订单提交 -->
	<view class="server_order">
		<!-- <view class="height_20"></view> -->
		<u-tabs-swiper ref="tabs" name="name" count="count" active-color="#ff8878" :list="menuTabs"
			:current="currentTab" :is-scroll="false" @change="tabsChange" class="">
		</u-tabs-swiper>

		<view class="order_top u-m-t-20">
			<view class="order_address flex_rows space_bet  border_bottom"
				@click="doUrl('pages/address/ment_address', { select: 1 })" v-if="!Self">
				<view class="address_left" v-if="addrInfo.detailedAddress">
					<view class="left_address ellipsis">{{addrInfo.detailedAddress}}</view>
					<view class="left_phone"><text>{{addrInfo.consigneeName}}</text>{{addrInfo.phone}}</view>
				</view>
				<view class="address_left" v-else>
					<view class="left_address">请选择服务地址</view>
				</view>
				<!-- <view class="Icon right_icon">&#xe638;</view> -->
				<u-icon name="arrow-right"></u-icon>
			</view>

			<view class="order_address flex_rows space_bet  border_bottom" v-if="Self" @click="getLocation()">
				<view class="address_left" v-if="addSelf.address">
					<view class="left_address ellipsis">{{addSelf.address}}</view>
					<view class="left_phone"><text>{{addSelf.usrName}}</text>{{addSelf.usrPhone}}</view>
				</view>
				<!-- <view class="Icon right_icon">&#xe638;</view> -->
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="order_detail">
			<view class="detail_header flex_center">
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
						<!-- <view class="text_tit" v-if="piece">{{item.name}}/件</view> -->
						<view class="text_tit">{{item.name}}</view>
						<view class="text_des">数量：{{item.number}}</view>
					</view>
					<view class="flex_between">
						<view class="text_des">优惠券：</view>
						<view class="flex_rows flex_center" @click="getOyhj(item.goodsId,index)">
							<view class="" v-if="item.conjuan.id">{{item.conjuan.concessionalRate}}</view>
							<view class="" v-else>选择优惠券</view>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="text_bot">
						<text class="bot_num"
							v-if="item.conjuan">{{formatPrice(item.price*item.number - item.conjuan.reduce)}}</text>
						<text class="bot_num" v-else>{{formatPrice(item.price*item.number)}}</text>
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
			<view class="news_note flex_rows space-between space_bet" @click="doUrl('pages/user/note_submit')">
				<view class="note_left">留言</view>
				<view class="note_right flex_rows" v-if="orderlist.leaving!=''">
					<text class="Icon right_icon ellipsis">{{orderlist.leaving}}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
				<view class="note_right flex_rows" v-else>建议留言前沟通确认<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
		<view class="order_price">
			<view class="price_top flex_rows space_bet border_bottom">
				<view class="top_first">
					<view class="first_price">商品价格</view>
					<view class="first_price">商品折扣</view>
					<!-- <view class="" v-if="receiveText!=''">优惠</view> -->
				</view>
				<view class="top_sencond">
					<view class="sencond_num" v-if="orderlist.zkAmount">{{formatPrice(orderlist.zkAmount)}}元</view>
					<view class="sencond_num" v-if="userlist.vipTreatment!=0">×{{formatPrice(userlist.vipTreatment)}}折</view>
					<!-- <view class="sencond_coupon" v-if="receiveText!=''">优惠券
						<text class="coupons_num" v-if="receiveText">-{{formatPrice(receiveText)}}元</text>
					</view> -->
				</view>
			</view>
			<view class="price_bot flex_rows">
				<text v-if="receiveText!=''">已优惠
					<text class="bot_money" v-if="receiveText">{{formatPrice(receiveText)}}元</text>
				</text>
				<text class="bot_left">小计
					<text class="bot_money" v-if="orderlist.totalAmount">￥{{formatPrice(orderlist.totalAmount)}}元</text>
				</text>
			</view>
		</view>
		<text class=" text_des ">(注：会员折扣是按实际支付金额进行打折)</text>
		<view class="order_button flex_rows">
			<view class="button_money">
				实付：<text class="money_num" v-if="orderlist.totalAmount">￥{{formatPrice(orderlist.totalAmount)}}</text>
			</view>
			<!-- <view class="button_buy" v-if="isBulk" @click="doUrl('pages/mall/order_detail',{isbulk: true})">提交订单</view> -->
			<view class="button_buy" @click="submit">提交订单</view>
		</view>

		<!-- 弹出框 -->
		<u-popup v-model="show" mode="bottom" length="700" safe-area-inset-bottom @open="openPOP()" @close="closePOP()"
			closeable>
			<view class="flex_columns popup" v-if="coupon.length!=0">
				<view class="u-p-40 one_ck">
					<text v-if="!conjuan.id">是否使用优惠券</text>
					<text v-else>已选择优惠券{{conjuan.concessionalRate}}</text>

					<coupon v-for="(item, index) in coupon" :key="index" @couponCk="addcouponCk" v-bind:item="item"
						:cktit="item.id == goodsList[goodsIndex].conjuan.id?'已选择':'选择'"
						:solid="item.id == goodsList[goodsIndex].conjuan.id?'#ff6c00':'#ffffff'"
						:color="item.id == goodsList[goodsIndex].conjuan.id?'#ffffff':'#ff6c00'" v-if="item.state==1">
					</coupon>
					<coupon v-for="(item, index) in coupon" :key="index" v-bind:item="item" cktit="已使用" solid="#ff6c00"
						color="#ffffff" v-if="item.state==2"></coupon>
				</view>
				<view class="u-p-10 u-m-t-30">
					<u-button @click="conjuanD()" class="">不是使用优惠券</u-button>
					<u-gap height="20" bg-color="#fff"></u-gap>
					<u-button :ripple="true" type="error" @click="cartadd()">确定</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import coupon from '@/components/coolc-coupon/listCoupon.vue'; //优惠券组件
	export default {
		components: {
			coupon
		},
		data() {
			return {
				show: false, //底部弹窗
				// isBulk: false,
				Self: false, //是否自提
				currentTab: 0,
				menuTabs: [{
						name: '快递配送'
					},
					{
						name: '上门自提'
					}
				],
				// bulkImgList: [],
				// productId: '', //接收的商品id
				// data: {}, //加载商品信息
				// rdata: null, //当前日期
				// tdata: null, //当前时间
				// goodsname: '', //加载商品名
				goodsList: [], //加载商品缓存
				goodsIndex: 0, //商品下标
				addrInfo: null, //加载用户地址
				addSelf: { //自提地址
					address: '测试自提地址',
					provincial: '贵州省', //省份
					city: '遵义市', //市份
					area: '红花岗区', //县份
					usrPhone: '12345678911',
					usrName: '自提'
				},
				leaving: '', //加载备注
				// payment: 0, //实际支付金额
				receiveText: 0,
				orderlist: {
					addressId: '', //地址id
					consigneeName: '',//收货人
					phone:'',//手机号
					detailedAddress: '',//地址
					payVos: [], //商品数据
					// state: 3, //订单状态
					leaving: '', //留言
					userId:'',//用户id
					totalAmount: 0, //订单实际支付金额
					zkAmount: 0, //折扣前的价格
				},
				userlist: {},
				zorder: {}, //主订单
				piece: false, //件起购
				openId: '',
				conjuan: {}, //已选择优惠券
				coupon: [], //优惠券数据
				popupli: {}, //弹窗数据

			}
		},
		onShow() {
			this.openId = uni.getStorageSync('WXopenid');
			this.goodsList = uni.getStorageSync('BespeakInfo'); //加载缓存
			this.addrInfo = uni.getStorageSync('setAddr'); //加载地址
			this.orderlist.leaving = uni.getStorageSync('Remark'); //获取备注
			this.Calculation(); //加载计算
			console.log(this.goodsList);
			console.log(this.addrInfo);
			console.log(this.userlist);
			if (this.addrInfo.id) {
				this.orderlist.addressId = this.addrInfo.id
				this.orderlist.consigneeName = this.addrInfo.consigneeName
				this.orderlist.phone = this.addrInfo.phone
				this.orderlist.detailedAddress = this.addrInfo.consigneeRegion+this.addrInfo.city+this.addrInfo.county+this.addrInfo.detailedAddress
				console.log(this.orderlist);
			}
		},
		onLoad(options) {
			console.log(options);
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				console.log(this.userlist);
				this.orderlist.userId = this.userlist.id
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
				this.Self = index == 0 ? false : true;

			},
			//不使用优惠券
			conjuanD() {
				console.log(this.goodsList);
				delete this.goodsList[this.goodsIndex].conjuan;
				this.goodsList[this.goodsIndex].reduce = 0;
				this.utils.error('清除成功', () => {
					this.Calculation(); //计算订单
					this.show = false;
				})
			},
			closePOP() { //关闭弹窗
				// console.log(this.popupli);
			},
			openPOP() { //打开弹窗
				// this.popupli = this.coupon;
				// console.log(this.popupli);

			},
			//优惠券选择
			addcouponCk(item) {
				// console.log(item);
				for (let i = 0; i < this.goodsList.length; i++) {
					let li = this.goodsList[i];
					if (this.goodsIndex == i) {
						li.conjuan = item;
						this.goodsList[i] = li;
						this.goodsList[i].reduce = this.goodsList[i].number * this.goodsList[i].price >= item.full ? item
							.reduce : 0;
						this.Calculation(); //计算订单
						// this.oyhjU(item.id,item.discountId)
						console.log(this.goodsList);
					}
				}

			},
			//修改优惠券状态
			oyhjU(id, discountId) {
				let li = {
					state: 2,
					id: id,
					discountId: discountId
				}
				console.log(li);
				this.http.getApi('oyhj/update', li, 'post').then(res => {
					console.log(res);
				}).catch(err => {
					console.log(err);
					this.utils.error(err.message);
					uni.hideLoading();
				});
			},
			//点击优惠券弹窗确认选择
			cartadd() {
				this.show = false;
			},
			//计算立即购买值
			Calculation() {
				this.orderlist.totalAmount = 0;
				for (let i = 0; i < this.goodsList.length; i++) {
					if (this.goodsList[i].reduce) {
						this.orderlist.totalAmount = this.orderlist.totalAmount + this.goodsList[i].number * this
							.goodsList[i].price - this.goodsList[i].reduce;
							this.orderlist.zkAmount = this.orderlist.totalAmount
					} else {
						this.orderlist.totalAmount = this.orderlist.totalAmount + this.goodsList[i].number * this
							.goodsList[i].price;
							this.orderlist.zkAmount = this.orderlist.totalAmount
					}
				}
				if(this.userlist.vipTreatment!=0){
					this.orderlist.totalAmount = this.orderlist.totalAmount * this.userlist.vipTreatment
				}
				this.orderlist.totalAmount = this.orderlist.totalAmount==0?0.01:this.orderlist.totalAmount
			},
			getOyhj(id, index) { //获取用户优惠券
				this.goodsIndex = index;
				let li = {
					userId: this.userlist.id,
					commodityId: id
				}
				console.log(li);
				this.http.getApi('oyhj/oyhj', li, 'post').then(res => {
					console.log(res);
					this.coupon = this.filter(res.oyhjEntities);
					console.log(this.coupon);
					console.log(this.goodsList[this.goodsIndex]);
					this.show = true;
					// uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.message);
					uni.hideLoading();
				});
			},
			//过滤已使用优惠券
			filter(list) {
				let li = list
				// console.log(this.goodsList[this.goodsIndex]);
				// console.log('执行过滤');
				for (let i = 0; i < li.length; i++) {
					for (let j = 0; j < this.goodsList.length; j++) {
						if (this.goodsList[j].conjuan != undefined) {
							if (li[i].id == this.goodsList[j].conjuan.id) {
								li[i].state = 2
							}
						}
					}
				}
				return li
			},
			//查看地址
			getLocation() {
				let that = this;
				uni.getSetting({
					success: function(t) {
						console.log(t)
						if (!t.authSetting['scope.userLocation']) {
							console.log('11111111');
							uni.authorize({
								scope: 'scope.userLocation',
								success: function(s) {
									console.log(s)
									uni.openLocation({
										address: '贵州省遵义市红花岗区长新大道与东联二线交叉口',
										latitude: 27.678051698,
										longitude: 106.972996349,
										name: '渝欧教育城B区4-1-8号门面',
										success: function() {
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
								success: function() {
									console.log('success');
								}
							});
						}
					}
				});
			},
			addressG() { //检测是否自提
				if (this.Self) {} else {}
			},
			
			//执行提交订单
			submit() {
				console.log(this.orderlist);
				// this.addressG();
				if (this.orderlist.addressId == '') {
					this.utils.error('请选择地址！');
					return;
				}
				//筛选商品
				this.screen(this.goodsList, (data) => {
					console.log(data);
					this.orderlist.payVos = data;
					console.log(this.orderlist);
					this.utils.showloading();
					this.orderfound(this.orderlist);
				});
			},
			screen(list, data) { //筛选
				let tt = [];
					tt = list.map(iterator => {
					return {
						commodityId: iterator.goodsId,
						id: iterator.id,
						discountId:iterator.conjuan!=undefined?iterator.conjuan.id : null,
						price:iterator.price,
						quantity: iterator.number,
						specificationsId: iterator.specId
					}
				});
				data(tt);
			},
			orderfound(jsonData) { //主订单
				this.http.getApi('order/orders', jsonData, 'post').then(res => {
					uni.hideLoading();
					console.log(res);
					this.verificationLogin(res.payment)
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.msg);
				});
			},
			//验证登录状态
			verificationLogin(item) {
				var _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes);
						// _this.opengid(loginRes.code);
						_this.utils.getOpenId(loginRes.code,(res)=>{
							console.log(res);
							_this.wxPayorder(item,res.openid)
						})
						// _this.wxPayorder(item,loginRes.code)
					}
				});
			},
			wxPayorder(item,openid) { //支付订单
				let li = {
					orderNo: item.orders,
					amount: 0.01,
					// amount: item.totalAmount,
					body: '商品下单',
					openid: openid
				}
				console.log(li);
				// wxPay/unifiedOrder原支付
				this.http.getApi('wxPay/unifiedOrder', li, 'get').then(res => {
					console.log(res);
					console.log('执行');
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
						// _this.fordecar(_this.goodsList);
						// _this.upfor(_this.goodsList);
						_this.utils.success('支付成功！', () => {
							uni.hideLoading();
							_this.utils.navback();
						});
					},
					fail: function(err) {
						// console.log('qqqqqqqqqq');
						console.log(data);
						console.log(err);
						console.log(_this.goodsList);
						// _this.fordecar(_this.goodsList);
						// _this.upfor(_this.goodsList);
						_this.utils.error('您已取消支付！', () => {
							uni.hideLoading();
							_this.utils.navback();
						});
					}
				});
			},
			fordecar(list) {
				for (let i = 0; i < list.length; i++) {
					this.carDe(list[i].id);
				}
			},
			upfor(list) { //修改销量
				if (list.length != 0) {
					for (let i = 0; i < list.length; i++) {
						if (this.piece) {
							this.goodsUp(list[i].goodsId, list[i].number * 6);
						} else {
							this.goodsUp(list[i].goodsId, list[i].number);
						}
					}
				}
			},
			goodsUp(goodsId, sumTwo) { //修改商品
				this.http.getApi('goods/up', {
					goodsId: goodsId,
					sumTwo: sumTwo
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
			
		}
	}
</script>

<style lang="scss">
	page {
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

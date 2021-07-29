<template>
	<!-- 商品详情页面 -->
	<view class="flex_columns">
		<nav-bar ref="navBar" :scrollTop="scrollTop" transparentFixedFontColor="#FFF" type="transparentFixed">
			<view class="preview" slot="default">详情</view> <!-- 不状态下的按钮 -->
		</nav-bar>
		<u-swiper :list="buylist.rotationImgs" height="700" v-if="buylist.rotationImgs.length!=0"></u-swiper>
		<u-empty text="暂无商品图片,请耐心等待商家上架" mode="search" v-if="buylist.rotationImgs.length==0"></u-empty>
		<view class="flex_columns u-p-20 one_ck">
			<text class="u-font-xl ft-wh u-type-error">{{Price===0?buylist.commodityPrice:Price+'元'}}</text>
			<!-- <cn-money :money="Price" thousandth :size="48" color="#FA3534"></cn-money> -->
			<text class="u-font-lg ft-wh">{{buylist.commodityName}}</text>
			<text class="u-font-sm u-light-color">{{buylist.commodityDescribe}}</text>
			<view class="flex_center flex_between">
				<!-- <cn-money :money="buylist.commodityPrice" thousandth :size="48" color="#FA3534"></cn-money> -->
				<text class="u-font-sm" v-if="buylist.commoditySale!=null">销量：{{buylist.commoditySale}}</text>
				<text class="u-font-sm" v-else>销量：0</text>
			</view>

		</view>
		<u-gap height="20" bg-color="#f8f8f8"></u-gap>
		<view class=" one_ck u-p-20" @click="show = true">
			<u-section title="规格:" :sub-title="serverText" font-size="32"></u-section>
		</view>
		<u-gap height="20" bg-color="#f8f8f8"></u-gap>
		<view class="flex_columns one_ck u-p-20 comment">
			<u-section title="评价(123)" sub-title="查看更多" font-size="32" @click="doUrl('pages/index/evaluate')"></u-section>
			<view class="flex_columns comment_ck">
				<view class="flex_rows flex_center comment_ck_one">
					<u-avatar src="/static/logo.png" size="default"></u-avatar>
					<text class="ft-wh u-m-l-20">XXXXXXX</text>
					<text class=" u-m-l-20">2小时</text>
				</view>
				<view class="flex_columns comment_ck_two">
					<view class="flex_wrap">
						<u-read-more :toggle="true" show-height="200" font-size="24" color="#868686" close-text="展开">
							<rich-text :nodes="content"></rich-text>
						</u-read-more>
					</view>
					<view class="flex_rows">
						<image src="/static/logo.png" mode="widthFix" v-for="(item ,index) in 3" :key="index"></image>
					</view>
				</view>
			</view>
		</view>
		<u-gap height="20" bg-color="#f8f8f8"></u-gap>
		<view class="flex_jufy_center ft-wh one_ck u-p-20">
			商品详情
		</view>
		<view class="flex_columns detailstt" v-if="buylist.detailsEntityList.length!=0">
			<image :src="item" mode="widthFix" v-for="(item ,index) in buylist.detailsEntityList" :key="index"
				v-if="buylist.detailsEntityList.length!=0"></image>
		</view>
		<u-empty text="暂无商品详情,请耐心等待商家上架" mode="search" v-if="buylist.detailsEntityList.length==0"></u-empty>
		<view class="" style="width: 100%; height: 100rpx;"></view>
		<!-- 弹出框 -->
		<u-popup v-model="show" mode="bottom" length="700" safe-area-inset-bottom @open="openPOP()" @close="closePOP()"
			closeable>
			<view class="flex_columns popup" v-if="popupli">
				<view class="flex_rows">
					<image :src="popupli.commodityImges?popupli.commodityImges:'/static/index/menu2.png'"
						mode="aspectFill" v-if="popupli.commodityImges"></image>
					<view class="flex_columns u-m-l-20">
						<text class="u-font-xl ft-wh u-m-b-20">{{popupli.commodityName}}</text>
						<text class="u-font-sm u-light-color">{{buylist.commodityDescribe}}</text>
						<!-- <cn-money :money="popupli.commodityPrice" thousandth :size="48" color="#FA3534"></cn-money> -->
						<text class="u-font-xl ft-wh u-type-error">{{Price===0?popupli.commodityPrice:Price+'元'}}</text>
					</view>
				</view>
				<view class="pop_cont flex_columns u-m-t-20">
					<text class="ft-wh u-m-b-20">规格：</text>
					<view class="flex_rows">
						<view :class="[item.active ? 'active' : '', 'cont_item']" v-for="(item, index) in popupli.specificationsEntityList"
							:key="index" @click="serverItemClick(index)">
							{{ item.specificationsName }}
						</view>
					</view>

				</view>
				<view class="flex_center flex_between">
					<text class="ft-wh">数量：</text>
					<u-number-box v-model="goodsSum" :min="1" @change="valChange"></u-number-box>
				</view>
				<view class=" u-p-10 u-m-t-30">
					<u-button :ripple="true" type="error" @click="cartadd()">确定</u-button>
				</view>
			</view>
		</u-popup>
		<!-- 底部快 -->
		<view class="navigation  flex_between">
			<view class="left ">
				<view class="item" @click="callPhone(phone)">
					<u-icon name="server-fill" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">客服</view>
				</view>
				<!-- <view class="item">
					<u-icon name="home" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">店铺</view>
				</view> -->
				<view class="item car" @click="doUrl('pages/user/onelist/Cart/Cart')">
					<!-- <u-badge class="car-num" :count="9" type="error" :offset="[-3, -6]"></u-badge> -->
					<u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">购物车</view>
				</view>
			</view>
			<view class="right">
				<view class="cart btn u-line-1" @click="show = true">加入购物车</view>
				<view class="buy btn u-line-1">立即购买</view>
			</view>
		</view>
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
				scrollTop: 0,
				show: false,
				userlist: {},
				serverText: '选择', //已选规格
				specID: '', //已选规格id
				Price:0,//已选商品价格
				buylist: {}, //原数据
				content: `山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。
								苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。
								无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？`,
				mainimg: [{
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
				fuimg: [],
				popupli: {},
				goodsSum: 1
			};
		},
		onLoad() {
			this.buylist = uni.getStorageSync('buylist');
			console.log(this.buylist);
			this.getGoods(this.buylist.id);
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				console.log(this.userlist);
			}
			// if(this.buylist.imgList.length!=0){
			// 		this.screen();
			// }
		},
		methods: {
			onPageScroll(e) {
				this.scrollTop = e.scrollTop;
			},
			getGoods(id) { //获取商品
				this.http.getApi('commodity/info/'+id,{}, 'get').then(res => {
					console.log(res);
					this.buylist = res.commodity;
					console.log(this.buylist);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			//规格选择
			serverItemClick(index) {
				for (let i = 0; i < this.popupli.specificationsEntityList.length; i++) {
					let item = this.popupli.specificationsEntityList[i];
					item.active = index == i ? true : false;
					this.popupli.specificationsEntityList.splice(i, 1, item);
					if (index == i) {
						this.serverText = '已选择'+item.specificationsName;
						this.specID = item.id;
						this.Price = item.specificationsPrice;
						// this.Calculation(); //计算订单
					}
				}
			},
			//计算立即购买值
			Calculation() {
				// this.payment = this.price * this.baseNum - this.receiveText;
				// console.log(this.payment);
			},
			closePOP() { //关闭弹窗
				console.log(this.popupli);
			},
			cartadd() {
				this.show = false;
				if (this.utils.isLogin()) {
					this.carAdd(this.popupli);
				}
			},
			openPOP() { //打开弹窗
				this.popupli = this.buylist;
				// this.popupli.imgRess = this.mainimg.length!=0?this.mainimg[0].imgAddress:'';
				// this.userlist.usrId?this.popupli.usrId = this.userlist.usrId : this.utils.error('请先登录账号');
				console.log(this.popupli);
			},
			valChange(e) {
				// console.log(e);
				this.goodsSum = e.value;
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
					this.utils.error('请先登录账号');
					return;
				}
				this.http.getApi('car/add', li, 'post').then(res => {
					console.log(res);
					this.goodsUp(li.goodsId, li.goodsSum); //添加销量
					this.utils.success('添加成功！');
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
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
	page {
		background-color: #F8F8F8;
	}

	.one_ck {
		background-color: #FFFFFF;
	}

	.detailstt {
		width: 100%;
		height: 100%;

		image {
			width: 100%;
			border-radius: 0;
		}
	}

	// 评论
	.comment {
		width: 100%;

		&_ck {
			margin-top: 30rpx;

			&_two {
				image {
					width: 30%;
					margin-right: 20rpx;
				}
			}
		}
	}

	// 弹窗样式
	.popup {
		padding: 30rpx;

		image {
			width: 200rpx;
			height: 200rpx;
			border-radius: 15rpx;
		}

		.pop_cont {
			// justify-content: flex-start;
			// align-items: center;
			// flex-wrap: wrap;

			.cont_item {
				margin-bottom: 30upx;
				margin-right: 30upx;
				padding: 10upx 20upx;
				text-align: center;
				font-size: 28upx;
				color: #a1a1a1;
				border-radius: 15upx;
				border: 2upx solid #f5f5f5;

				text {}

				&.active {
					background-color: #ffa600;
					color: #ffffff;
				}
			}
		}
	}

	// 底部快样式
	.navigation {
		display: flex;
		position: fixed;
		width: 100%;
		// height: 100%;
		bottom: 0;
		margin-top: 100rpx;
		border: solid 2rpx #f2f2f2;
		background-color: #ffffff;
		padding: 16rpx 0;

		.left {
			display: flex;
			font-size: 20rpx;

			.item {
				margin: 0 30rpx;

				&.car {
					text-align: center;
					position: relative;

					.car-num {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
					}
				}
			}
		}

		.right {
			display: flex;
			font-size: 28rpx;
			align-items: center;

			.btn {
				line-height: 66rpx;
				padding: 0 30rpx;
				border-radius: 36rpx;
				color: #ffffff;
			}

			.cart {
				background-color: #ed3f14;
				margin-right: 30rpx;
			}

			.buy {
				background-color: #ff7900;
			}
		}
	}
</style>

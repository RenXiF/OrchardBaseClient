<template>
	<view class="index_news flex_columns">
		<view class="news_block flex_columns" v-show="list">
			<view class="one_bk flex_between flex_center" v-for="(item , index) in list" :key="index" @click="httpdo(item)">
				<view class="dian"></view>
				<view class="one_img flex_center flex_jufy_center">
					<image :src="item.img" mode="widthFix"></image>
				</view>
				<view class="news_tit  flex_columns">
					<view class="tit flex_between flex_center">
						<text class="tit_z">{{item.tit}}</text>
						<text class="tit_f">{{item.data}}</text>
					</view>
					<view class="subtit  ellipsis">
						<text>{{item.titf}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="null flex_columns" v-show="!list">
			<text class="title">{{title}}</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '暂无消息',
				userlist: '',
				list: [{
						tit: "系统消息",
						titf: "系统通知消息！",
						http: "/pages/news/news_details",
						img: "/static/news/icon1.png",
						data: this.utils.getDate()+"-" +this.utils.getTime()
					},
					// {
					// 	tit: "其他消息",
					// 	titf: "副标题您的孩子已平安进入校园！",
					// 	http: "/pages/news/newsDetails",
					// 	img: "../../static/img/icon4.png",
					// 	data: "2020-7-1 8:00"
					// }
				],
				data: [],
				leng: 0,
				openid:''
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
		onLoad() {
			
		},
		onShow() {
			this.userlist = uni.getStorageSync('userlist'); //加载用户缓存
			console.log(this.userlist);
			// #ifdef MP-WEIXIN
			this.utils.getWxMessage('m7jLw68iAq7j0W3bNb3zApC6fUrYhRPZv-RMFjNmmo4')
			// #endif
			
		},
		//下拉刷新
		onPullDownRefresh() {
			console.log('下拉刷新');
			this.utils.success('刷新成功！', () => {
				this.list[0].data = this.utils.getDate()+"-" +this.utils.getTime()
				uni.stopPullDownRefresh();
			});
		},
		methods: {
			httpdo(item){
				this.doUrl(item.http,{tit:item.tit,img:item.img})
			}
			
		}
	}
</script>

<style lang="scss">
	.index_news {
		background-color: #F8F8F8;
	}

	/* null */
	.null {
		image {
			width: 100px;
		}

		text {
			font-size: 20px;
			color: #8f8f94;
		}
	}

	// 消息主样式
	.dian {
		width: 10px;
		height: 10px;
		z-index: 9;
		position: relative;
		left: 70px;
		top: -27px;
		border-radius: 5px;
		background-color: #ff5500;
	}

	.news_block {
		max-width: 100%;
		padding: 0 15px;
		background-color: #FFFFFF;

		.one_bk {
			width: 100%;
			padding: 10px 0;
			border-top: #F8F8F8 2px solid;

			.one_img {
				min-width: 20%;
				min-height: 50px;

				// border-radius: 15px;
				// border: #4CD964 1px solid;
				image {
					width: 80%;
					border-radius: 15px;
					// border: #000000 1px solid;
				}
			}

			.news_tit {
				width: 78%;

				.tit {
					width: 100%;
					margin-bottom: 7px;

					.tit_z {
						font-size: 18px;
						font-weight: 700;
						color: #333333;
					}

					.tit_f {
						font-size: 15px;
						color: #8f8f94;
					}
				}

				.subtit {
					width: 90%;

					text {
						font-size: 12px;
						color: #8f8f94;
					}
				}
			}
		}
	}
</style>

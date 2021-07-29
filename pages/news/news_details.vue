<template>
	<!-- 消息详情页面 -->
	<view class="index_details flex_columns">
		<load-refresh ref="loadRefresh" :isRefresh="true" :refreshTime="800" :heightReduce="10"
			:backgroundCover="'#F1F1F1'" :pageNo="pageNum" :totalPageNo="totalPage" @loadMore="loadMore"
			@refresh="refresh">
			<view slot="content-list">
				<!-- 数据列表 -->
				<view class="u-p-20 news_ck ">
					<view class="flex_columns news_one  u-m-b-40" v-for="(item ,index) in newslist" :key="index">
						<text class="flex_jufy_center u-p-20">{{item.time}}</text>
						<view class="flex_center flex_rows  u-p-20">
							<image :src="img" mode="widthFix" style="width: 12%;"></image>
							<text class="u-font-xl u-m-l-20 ft-wh">{{tit}}</text>
						</view>
						<view class="flex_columns u-p-20 box_shadow bg_radius" style="width: 80%; margin-left: 16%;">
							
							<!-- <text class="u-font-sm">{{item.subtitle}}</text> -->
							<u-read-more :toggle="true" show-height="200" font-size="24" color="#868686">
								<text class="u-font-lg">{{item.title}}</text>
								<rich-text :nodes="content"></rich-text>
							</u-read-more>
						</view>
						
					</view>
				</view>

			</view>
		</load-refresh>
	</view>
</template>

<script>
	import loadRefresh from '@/components/load-refresh/load-refresh.vue'
	export default {
		components: {
			loadRefresh
		},
		data() {
			return {
				tit: null,
				img: null,
				userlist: '',
				content: `山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。
								苔痕上阶绿，草色入帘青。谈笑有鸿儒，往来无白丁。可以调素琴，阅金经。
								无丝竹之乱耳，无案牍之劳形。南阳诸葛庐，西蜀子云亭。孔子云：何陋之有？`,
				newslist: [{
						title: '标题xxx',
						subtitle: '内容xxxxxxxxxxxxxx',
						time: this.utils.getDate() + "-" + this.utils.getTime()
					},
					{
						title: '标题xxx',
						subtitle: '内容xxxxxxxxxxxxxx',
						time: this.utils.getDate() + "-" + this.utils.getTime()
					},
					{
						title: '标题xxx',
						subtitle: '内容xxxxxxxxxxxxxx',
						time: this.utils.getDate() + "-" + this.utils.getTime()
					},
					{
						title: '标题xxx',
						subtitle: '内容xxxxxxxxxxxxxx',
						time: this.utils.getDate() + "-" + this.utils.getTime()
					}
				], //消息
				Teacherlist: {},
				pageNum: 1,
				pageSize: 10,
				totalPage: 1, // 总页数
				hasNextPage: true,
			};
		},
		onLoad(e) {
			this.userlist = uni.getStorageSync('userlist'); //加载用户缓存
			console.log(this.userlist);
			this.tit = e.tit;
			this.img = e.img;
			console.log(e);
		},
		onShow() {


		},
		onReady() {
			uni.setNavigationBarTitle({
				title: this.tit
			});
		},

		methods: {
			// 上划加载更多
			loadMore() {
				console.log('loadMore')
				// 请求新数据完成后调用 组件内loadOver()方法
				// 注意更新当前页码 currPage
				this.option();
				this.$refs.loadRefresh.loadOver()
			},
			// 下拉刷新数据列表
			refresh() {
				this.pageNum = 1;
				this.hasNextPage = true;
				// this.newslist = [];
				this.option();
				// this.utils.success('刷新成功！');
				console.log('refresh')
			},
			option() {}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F1F1F1;
	}

	.index_details {
		background-color: #F1F1F1;
		.news_ck {
			width: 100%;
			.news_one {
				width: 100%;
			}
		}
	}
</style>

<template>
	<view class="flex_columns">
		<my-issue :score="3" :starsMax="5" :infoReceive="issue" :headPicValue="userlist.userImg"
			:headTitleValue="userlist.userName" :fromLabel.sync="listdata" @submit="submit" @scoreChange="scoreChange" />
	</view>
</template>

<script>
	import myIssue from '@/components/myIssue.vue' //评价组件
	export default {
		components: {
			myIssue
		},
		data() {
			return {
				userlist: '', //用户缓存
				goodid: '',
				issue: {
					score: 0,
					textareaValue: ""
				},
				// isslist:[
				// 	issue: {
				// 		score: 0,
				// 		textareaValue: ""
				// 	},
				// ],
				sortlist: [], //评价分类
				datali: {
					commentClass: '',
					commentimgEntities: [],
					commodityContent: '', //评价内容
					userId: '',
					commodityId: ''
				},
				listdata: [],
				addEvaluate: ''
			}
		},
		onLoad(e) {
			if (this.utils.isLogin()) {
				console.log(e);
				this.userlist = uni.getStorageSync('userlist');
				this.addEvaluate = uni.getStorageSync('evaluate');
				console.log(this.userlist);
				console.log(this.addEvaluate);
				if (this.addEvaluate == '') {
					this.utils.error('加载错误请联系管理员', () => {
						this.utils.navback();
					});
				} else {
					this.initialization();
				}

			} else {
				this.utils.error('请先登录账号！', () => {
					this.utils.navback();
				});
			}
		},
		methods: {
			// 初始化数据
			initialization() {
				this.getDictionaries()
				if (this.addEvaluate.orderEntityList.length != 0) {
					for (let i = 0; i < this.addEvaluate.orderEntityList.length; i++) {
						let it = {
							starsMax: 5, //max星标
							score: 3, //星标值
							commentClass: '',
							commentimgEntities: [],
							commodityContent: '', //评价内容
							img:this.addEvaluate.orderEntityList[i].img,
							title:this.addEvaluate.orderEntityList[i].title,
							userId: this.userlist.id,
							commodityId: this.addEvaluate.orderEntityList[i].id
						};
						this.listdata.splice(i, 0, it)
					}
					// console.log(this.listdata)
				}
			},
			// 获取评价字典
			getDictionaries() {
				let li = {
					dictionaries: 'evaluate',
					pageNum: 0,
					pageSize: 0
				}
				this.http.getApi('dictionaries/list', li, 'post').then(res => {
					console.log(res);
					this.sortlist = res.list;
				}).catch(err => {
					console.log(err);
					this.utils.error(err.message);
					uni.hideLoading();
				});
			},
			// 修改星星
			scoreChange(i, e) {
				console.log(i);
				console.log(e);
				// this.issue.score = e
				console.log(this.listdata);
				this.listdata[i].score = e
			},
			// 提交按钮
			submit(e) {
				console.log(e);
				this.listdata = e
				this.guolvdata()
			},
			guolvdata() {
				console.log(this.listdata);
				if(this.listdata.length!=0){
					for(let i=0;i<this.listdata.length;i++){
						this.listdata[i].commentClass = this.guolvpingjia(this.listdata[i].score)
						if (this.listdata[i].commentimgEntities.length != 0) {
							// console.log('上传图片');
							this.utils.DiGuiUpimg(this.listdata[i].commentimgEntities,res=>{
								console.log(res);
								// uni.hideLoading();
								this.listdata[i].commentimgEntities = res.map(item=>{
									return{
										commentImg:item.url
									}
								})
							})
							
						}
					}
					// console.log(this.listdata);
					var _this = this
					setTimeout(function() {
						console.log(_this.listdata);
						// uni.hideLoading();
						_this.commentAdd(_this.listdata)
					}, 1000)
				}else{
					this.utils.error('数据错误')
				}
				// this.commentAdd(this.datali)
			},
			guolvpingjia(e){
				if (e >= 5) {
					return '好评'
				}
				if (e == 3 || e == 4) {
					return '中评'
				}
				if (e == 1 || e == 2) {
					return '差评'
				}
				return '其他'
			},
			//添加评价
			commentAdd(li) {
				console.log(li);
				this.http.getApi('comment/save', li, 'post').then(res => {
					console.log(res);
					this.upOrder(this.addEvaluate.orders)
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
					this.utils.error(err.message)
				});
			},
			//更新订单状态
			upOrder(orders) {
				console.log(orders);
				this.utils.showloading();
				this.http.getApi('order/confirm', {
						orders: orders,
						state:5
					}, 'get').then(res => {
						uni.hideLoading();
						console.log(res);
						this.utils.success('评价成功',()=>{
							this.utils.navback()
						})
					})
					.catch(err => {
						uni.hideLoading();
						console.log(err);
						this.utils.error(err.message);
					});
			},
		}
	}
</script>

<style lang="scss">
</style>

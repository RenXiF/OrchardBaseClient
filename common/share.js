export default {
	data() {
		return {
			//设置默认的分享参数
			//如果页面不设置share，就触发这个默认的分享
			share: {
				title: '快来加入我们吧',
				path: '/pages/index/index',
				imageUrl: '',
				desc: '',
				content: ''
			},
			userlist:{}
		}
	},
	onLoad() {
		
	},
	onShow() {
		this.userlist = uni.getStorageSync('userlist');
		if(this.userlist&&this.userlist.usrPhone!=undefined){
			this.share.path = 'pages/user/user';
			this.share.path = this.share.path+'?id='+ this.userlist.usrPhone;
			// console.log(this.share);
		}
	},
	onShareAppMessage(res) {
		console.log(res);
		if (res.from === 'button') { // 来自页面内分享按钮
			// console.log(res);
			// console.log(res.target);
			uni.setStorageSync('shareli', res.target);
		}
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl,
			desc: this.share.desc,
			content: this.share.content,
			success(res) {
				uni.showToast({
					title: '分享成功'
				})
			},
			fail(res) {
				uni.showToast({
					title: '分享失败',
					icon: 'none'
				})
			}
		}
	}
}

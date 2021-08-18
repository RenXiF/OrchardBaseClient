/** form-id-mixins.js **/
export default {
  methods: {
    getFormIdData(formId, type = 1) {
        // 加type参数是为了有效区分都为同一类型的formId
        const params = {
          formId,
          type
        }
        // 传值给后台的API
        // Api.getFormId(params)
        //   .then(res => {
        //     console.log('success')
        //   })
    },
  }
}
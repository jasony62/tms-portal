const baseApi = (process.env.VUE_APP_API_BASE || '') + '/route'

export default function create(tmsAxios) {
	return {
		routes() {
			return tmsAxios.get(`${baseApi}/get`).then(rst => rst.data.result.routes)
		}
	}
}

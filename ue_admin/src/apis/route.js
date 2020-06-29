const baseApi = (process.env.VUE_APP_API_BASE || '') + '/admin/route'

export default function create(tmsAxios) {
	return {
		list(name, version) {
			let url = `${baseApi}/list`
			return tmsAxios.get(url, { params: { name, version } }).then(rst => {
				return rst.data.result
			})
		},
		get(name, version) {
			let url = `${baseApi}/get`
			return tmsAxios.get(url, { params: { name, version } }).then(rst => {
				return rst.data.result
			})
		},
		create() {
			return tmsAxios.get(`${baseApi}/create`).then(rst => {
				return rst.data.result
			})
		},
		save(name, updated) {
			const url = `${baseApi}/save?name=${name}`
			return tmsAxios.post(url, updated).then(rst => {
				return rst.data.result
			})
		},
		commit(name) {
			return tmsAxios.get(`${baseApi}/commit?name=${name}`).then(rst => {
				return rst.data.result
			})
		},
		setDefault(name, version) {
			return tmsAxios
				.get(`${baseApi}/setDefault?name=${name}&version=${version}`)
				.then(rst => {
					return rst.data.result
				})
		},
		getDefault() {
			console.log(tmsAxios)
			let url = `${baseApi}/getDefault`
			return tmsAxios.get(url).then(rst => {
				return rst.data.result
			})
		}
	}
}

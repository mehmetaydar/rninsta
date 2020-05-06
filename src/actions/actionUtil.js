export const REQUEST = 'REQUEST'
export const SUCCESS = 'SUCCESS'
export const FAILURE = 'FAILURE'

export function createRequestTypes(base) {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
		acc[type] = `${base}_${type}`
		return acc
	}, {})
}

export function action(type, payload = {}) {
	console.log("type: ")
	console.log(JSON.stringify(type));
	console.log("payload: ")
	console.log(JSON.stringify(payload));
    return {type, ...payload}
}

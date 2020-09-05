import http from '@/plugins/http'

export default class Resource {
  constructor (baseUri) {
    this.baseUri = baseUri.replace(/\/+$/, '')
  }

  async get (uri, params = {}) {
    return http.get(`${this.baseUri}/${uri}`, { params })
  }

  async post (uri, payload) {
    return http.post(`${this.baseUri}/${uri}`, payload)
  }

  async patch (uri, payload) {
    return http.patch(`${this.baseUri}/${uri}`, payload)
  }

  async put (uri, payload) {
    return http.put(`${this.baseUri}/${uri}`, payload)
  }

  async delete (uri) {
    return http.delete(`${this.baseUri}/${uri}`)
  }

  async find (id, params = {}) {
    return this.get(id, params)
  }

  async index (params = {}) {
    return this.get('', params)
  }

  async store (payload) {
    return this.post('', payload)
  }

  async update (id, payload) {
    return this.patch(id, payload)
  }

  async destroy (id) {
    return this.delete(id)
  }
}

import config from './config.js'

export default class API {
    constructor() {
        this.token = null
        this.apiVersion = 2
        this.baseUrl = 'https://intercom.rubetek.com/api/'
    }

    makeReq({url, method = 'GET', body}) {
        return fetch(this.baseUrl + url, {
            method, body: JSON.stringify(body), headers: {
                'API-VERSION': this.apiVersion.toString(),
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (url === 'customers/sign_in') {
                    const authHeader = res.headers.get('authorization')
                    const token = authHeader.split('Bearer ')?.[1]

                    if (token) {
                        this.token = token
                    }
                }
                return res
            })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw Error(res.code)
                }
                return res
            })
    }

    signIn() {
        return this.makeReq({
            url: 'customers/sign_in', method: 'POST', body: {
                account: {
                    phone: config.phone, password: config.password
                }
            }
        })
    }

    getProperties() {
        return this.makeReq({
            url: 'customers/properties'
        })
    }

    getIntercoms(property) {
        return this.makeReq(`customers/properties/${property}/intercoms`)
    }

    openDoor(intercom) {
        return this.makeReq(`customers/intercoms/${intercom}/unlock`)
    }

}
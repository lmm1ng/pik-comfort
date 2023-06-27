import API from "./api.js";

const api = new API()

api.signIn().then(() => api.getProperties())
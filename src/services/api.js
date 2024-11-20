import axios from 'axios';

// Vue CLI környezeti változók használata
const baseUrl = process.env.VUE_APP_API_URL || "http://localhost";

const api = axios.create({
  baseURL: `${baseUrl}/api`
});

export default api;
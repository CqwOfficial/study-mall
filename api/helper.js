import axios from 'axios'

const ERR_OK = 0

export function get(url) {
  return function (params) {
    return axios.get(url, { params })
    .then((res) =>{
      const {status, result, msg} = res.data;
      if (status === ERR_OK) return result;
    })
    .catch((e) =>{})
  }
}
import Loading from '../../components/Cloading'
export default {
  install(Vue) {
    Vue.directive('cloading', Loading)
  }
}

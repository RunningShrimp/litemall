
module.exports = {
  data() {
    return {};
  },

  props: {},
  methods: {
    emitFun(...args) {
      this.emitFun(...args);
    },

    getRect(selector, all) {
      return new Promise(resolve => {
        wx.createSelectorQuery().in(this)[all ? 'selectAll' : 'select'](selector).boundingClientRect(rect => {
          if (all && Array.isArray(rect) && rect.length) {
            resolve(rect);
          }

          if (!all && rect) {
            resolve(rect);
          }
        }).exec();
      });
    }

  }
};
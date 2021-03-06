export default {
    data: {
        showCover: false,
    },
    onShow() {
        this.setData({
            showCover: true
        });
    },
    handleItemTap(e) {
        wx.navigateTo({
            url: `/pages/bookInfo/index?bookId=${e.currentTarget.dataset.id}`
        });
    }
};

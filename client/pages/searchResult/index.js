import regeneratorRuntime from '../../lib/regenerator-runtime/runtime-module';
import Api from '../../lib/api';
import { zhuishushenqiApi as URL } from '../../utils/request';

Page({
    data: {
        init: false,
        loading: false,
        total: 0,
        pageNo: 0,
        pageSize: 10,

        keyword: '',
        books: []
    },
    async onLoad(options) {
        const keyword = options.keyword;
        const fuzzySearchRet = await this.fuzzySearch(keyword);
        this.setData({
            keyword,
            books: this.formatBooksInfo(fuzzySearchRet.books),
            init: true
        });

        wx.setNavigationBarTitle({
            title: `与"${keyword}"有关的书籍`
        });
    },
    async onReachBottom() {
        const { pageNo, pageSize, total } = this.data;
        if (pageNo * pageSize >= total) {
            return;
        }
        this.setData({ loading: true });
        const fuzzySearchRet = await this.fuzzySearch(this.data.keyword);
        this.setData({
            books: this.formatBooksInfo(fuzzySearchRet.books),
            loading: false
        });
    },
    async fuzzySearch(query) {
        const { pageNo, pageSize } = this.data;
        const result = await Api.fuzzySearch(query, 0, (pageNo + 1) * pageSize);
        this.setData({ pageNo: pageNo + 1, total: result.total });
        return result;
    },
    formatBooksInfo(books) {
        return books.map(i => {
            const latelyFollower = i.latelyFollower;
            i.cover = URL.static + i.cover;
            i.latelyFollower = latelyFollower > 999 ? `${(latelyFollower / 10000).toFixed(1)}万` : latelyFollower;
            return i;
        });
    },
    handleItemTap(e) {
        wx.navigateTo({
            url: `/pages/bookInfo/index?bookId=${e.currentTarget.dataset.id}`
        });
    }
});

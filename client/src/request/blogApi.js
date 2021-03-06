import axios from './request';

const api = {
  async getBlogsByPagination(page = 1, limit = 10, keyword = '') {
    const res = await axios.get('/api/blogs', {
      params: {
        page, // 当前页码
        limit, // 每页的数量
        keyword, // 检索关键词（标题or作者）
      },
    });
    return res;
  },
  async getBlogs() {
    const res = await axios.get('/api/blogs/all');
    return res;
  },
  async getCategories() {
    const res = await axios.get('/api/categories');
    return res;
  },
  async getTags() {
    const res = await axios.get('/api/tags');
    return res;
  },
  async getFriends() {
    const res = await axios.get('/api/friends');
    return res;
  },
  async getBlogsByCategoryId(id) {
    const res = await axios.get(`/api/categories/${id}`);
    return res.Blogs;
  },
  async getBlogsByTagId(id) {
    const res = await axios.get(`/api/tags/${id}`);
    return res.Blogs;
  },
  async searchByTitleOrAuthor(keyword) {
    const res = await axios.get('/api/search', {
      params: { keyword },
    });
    return res;
  },
  async getBlogById(id) {
    const res = await axios.get(`/api/blogs/${id}`);
    return res;
  },
};

// (async () => {
//   console.log(await api.getTags());
// })();

export default api;

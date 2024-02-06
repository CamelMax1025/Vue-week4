import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.15/vue.esm-browser.min.js";

const site = "https://vue3-course-api.hexschool.io/v2";
const api_path = "camelpath2";

import pagination from "./pagination.js";
import ProductModal from "./ProductModal.js";
import ProductDel from "./ProductDel.js";

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imageUrl: [],
      },
      pages: {},
      modalProduct: null,
      modalDel: null,
      isNew: false, //用於判別新增與編輯差別。
    };
  },
  methods: {
    ///////增加驗證步驟！?！
    checkUser() {
      const api = `${site}/api/user/check`;
      axios
        .post(api)
        .then((res) => {
          if (res.data.success) {
            this.getProducts();
          }
        })
        .catch((err) => {
          console.log(err);
          alert("請重新登入");
          window.location = "index.html";
        });
    },
    getProducts(page = 1) {
      const api = `${site}/api/${api_path}/admin/products?page=${page}`; //product 因應第四周加入 【分頁需求】。
      axios.get(api).then((res) => {
        this.products = res.data.products;
        this.pages = res.data.pagination;
      });
    },
    //彈跳視窗
    openModal(status, product) {
      if (status === "new") {
        this.tempProduct = {
          imageUrl: [], //該欄位會動態變動，為防止變動，將其再初始化。
        };
        this.isNew = true; //二層防錯
        // this.modalProduct.show();//*已給ProductModal.js元件已使用
        this.$refs.pModal.openModal();
      } else if (status === "edit") {
        this.tempProduct = { ...product }; //淺拷貝
        if (!Array.isArray(this.tempProduct.imagesUrl)) {
          //判斷imagesUrl不是陣列，就補進陣列。
          this.tempProduct.imagesUrl = [];
        }
        this.isNew = false;
        // this.modalProduct.show();//*已給ProductModal.js元件已使用
        this.$refs.pModal.openModal();
      } else if (status === "delete") {
        this.tempProduct = { ...product };
        // this.modalDel.show();//*已給ProductDel.js元件已使用
        this.$refs.dModal.openDeleteProduct();
      }
    },
    // 新增
    updateProduct() {
      let api = `${site}/api/${api_path}/admin/product`; //建立產品
      let method = "post";
      //更新編輯
      if (!this.isNew) {
        //如果判斷this.isNew為false 就會轉PUT 的API路徑
        api = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }
      axios[method](api, { data: this.tempProduct }).then((res) => {
        this.getProducts(); //建立完列表 要再次顯示列表。
        // this.modalProduct.hide(); //新增完要關閉該頁面
        this.$refs.pModal.closeModal();
        this.tempProduct = {}; //清除輸入框
      });
    },
    // 刪除
    deleteProduct() {
      const api = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios.delete(api, { data: this.tempProduct }).then((res) => {
        this.getProducts();
        // this.modalDel.hide();
        this.$refs.dModal.closeDeleteProduct();
      });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)camelpath2\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkUser(); //驗證功能
    // this.modalProduct = new bootstrap.Modal(this.$refs.productModal); //*已給ProductModal.js元件已使用
    // this.modalDel = new bootstrap.Modal(this.$refs.delProductModal);
  },
  components: {
    pagination,
    ProductModal,
    ProductDel,
  },
});

app.mount("#app");

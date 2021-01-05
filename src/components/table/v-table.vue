<template>
<div :class="css">
    <div class="table-search" v-if="search">
      <input
        type="text"
        ref="search"
        :placeholder="searchText"
        class="text form-search-input"
        v-model="searchValue"
        @keyup.enter="goSearch()"
      />
      <div @click="focus()" class="placeholder-text" v-if="!supportPlaceholder && !searchValue">
        {{ searchText }}
      </div>
      <span class="v-icon-search" @click="goSearch()"></span>
    </div>
    <table
      v-if="hasHead"
      class="table table-fixed table-header"
      :style="{ 'padding-right': tableScroll ? tableScrollWidth + 'px' : '' }"
    >
      <thead>
        <tr>
          <th v-for="(col, index) in columns" :width="col.width" :key="index + 1" :class="col.css">
            <template v-if="!col.selectAll">{{ col.title }}</template>
            <template v-else>
              <v-form-item vname="v-checkbox" v-model="checkboxAllVal" :data-key="selectAllOption"></v-form-item>
            </template>
          </th>
        </tr>
      </thead>
    </table>
    <div class="table-body" :style="{ height: bodyHeight != '' ? bodyHeight + 'px' : 'auto' }">
      <table class="table table-fixed" ref="table-body">
        <tbody>
          <slot name="header"></slot>
          <tr
            ref="table-body-tr"
            @click="clickRow(rowsData)"
            v-for="(rowsData, rowIndex) in pageData"
            :key="rowIndex + 1"
          >
            <template v-for="(col, index) in columns">
              <td :style="{ width: col.width }" class="fixed" :class="col.css" :key="index + 1">
                <v-form-item
                  v-if="col.selectAll"
                  vname="v-checkbox"
                  v-model="rowsData[col.field]"
                  :data-key="checkboxOptions"
                ></v-form-item>
                <!-- 有slot内容 -->
                <v-td class="fixed" v-else-if="col.fn" :rowsData="rowsData" :fn="col.fn" :index="rowIndex"></v-td>
                <span v-else-if="col.tooltip" v-tooltip="rowsData[col.field]">{{ rowsData[col.field] }}</span>
                <span v-else>{{ rowsData[col.field] }}</span>
              </td>
            </template>
          </tr>
          <tr v-if="tableData.length === 0 && !isLoading">
            <td :colspan="columns.length">
              <div class="table-no-data">{{ noData }}</div>
            </td>
          </tr>
          <tr v-if="isLoading">
            <td :colspan="columns.length">
              <div class="table-no-data">{{ loadingText }}</div>
            </td>
          </tr>
        </tbody>
        <slot></slot>
      </table>
    </div>
    <div class="table-footer clearfix" v-if="showPage !== false && totalPage > 1">
      <div class="footer-tips">
        <span>{{ pageTips }}</span>
        <span class="page-tips">{{ dataTips }}</span>
      </div>
      <div class="footer-page">
        <a class="table-btn" @click="gotoPage('prev')" :class="{ disabled: page === 1 }">&lt;</a>
        <a
          class="table-btn"
          :class="{ active: footerBtn.value == page }"
          v-for="footerBtn in footer"
          :key="footerBtn.value"
          @click="gotoPage(footerBtn.value)"
          >{{ footerBtn.text }}</a
        >
        <a class="table-btn" @click="gotoPage('next')" :class="{ disabled: page >= totalPage }">&gt;</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { copyDeepData } from "../libs";

//判断是否存在
let fileterField = (searchV: string, content: string) => {
  try {
    if (content.indexOf(searchV) != -1) {
      return true;
    }
  } catch (e) {}

  return false;
};

/**
 * 表格过滤
 *
 * @param {Array} tableData 当前表格数据
 * @param {string} filterStr 查找字符串
 * @param {[string]} field   查找类型
 *
 * @return {[type]} [description]
 */
let filterTable = (tableData: Array<ObjectAny>, filterStr: string, field: Array<string>) => {
  let newTable: any = [];
  if (field.length > 0) {
    tableData.forEach(function(item) {
      for (let prop in item) {
        if (field.indexOf(prop) != -1) {
          if (fileterField(filterStr, item[prop])) {
            newTable.push(item);
            break;
          }
        }
      }
    });
  }

  return copyDeepData(newTable);
};

Vue.component("VTableCol", {
  props: {
    title: {
      //表头文字
      default: "",
      type: String
    },
    field: {
      //表格字段
      default: "",
      type: String
    },
    css: {
      //样式
      default: "",
      type: String
    },
    width: {
      //宽度
      type: String
    },
    tooltip: {
      //是否支持提示信息
      type: Boolean,
      default: false
    },
    selectAll: {
      //是否支持全选
      type: Boolean,
      default: false
    },
    isSearch: {
      //是否支持搜索
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$dispatch("VTable", "add.column", {
      width: this.width,
      title: this.title,
      field: this.field,
      selectAll: this.selectAll !== false,
      isSearch: this.isSearch !== false,
      fn: this.$scopedSlots.default,
      tooltip: this.tooltip !== false,
      css: this.css
    });
  },
  beforeDestroy() {
    this.$dispatch("VTable", "remove.column", this.field);
  },
  render: function(createElement) {
    return createElement("div");
  },
  watch: {
    title(val) {
      this.$dispatch("VTable", "update.column", {
        width: this.width,
        title: this.title,
        field: this.field,
        selectAll: this.selectAll !== false,
        isSearch: this.isSearch !== false,
        fn: this.$scopedSlots.default,
        tooltip: this.tooltip !== false,
        css: this.css
      });
    }
  }
});

Vue.component("VTd", {
  props: ["rowsData", "fn", "index"],
  render: function(createElement) {
    this.rowsData.$index = this.index;
    return createElement("div", [this.fn(this.rowsData)]);
  },
});
const CHECKBOX_UNCHECKED = "0";
const CHECKBOX_CHECKED = "1";
const MAX_PAGE_LENGTH = 10; //最多显示多少页

//支持事件 updateCallBack  参数为当前表格的数据，原始的表格数据被复制成表格数据，
//导致中间双向绑定断层，页面需要获取表格数据时，需执行此事件

//支持事件 clickRow  参数为当前行的数据，点击此行时执行的事件

@Component
export default class VTable extends Vue {
  @Prop() data!: Array<ObjectAny>;
  @Prop() css!: string;
  @Prop({ default: false }) isLoading!: boolean; //是否正在loading
  @Prop({ default: _("Loading...") }) loadingText!: string; //loading 文本
  @Prop({ default: "" }) noData!: string; //没有数据时提示信息
  @Prop({ default: 10 }) maxRow!: number; //表格最多显示多少行
  @Prop({ default: 10 }) perPage!: number; //表格最多显示多少行
  @Prop({ default: true }) hasHead!: boolean; //是否显示表头
  @Prop({ default: false }) showPage!: boolean; //是否分页

  get pageTips() {
    return _("Page %s, Total %s pages", [this.page, this.totalPage]);
  }

  get dataTips() {
    return _("Total %s items", [this.tableData.length || 0]);
  }
  get totalPage() {
    return Math.ceil(this.tableData.length / this.perPage);
  }

  get supportPlaceholder() {
    let i = document.createElement("input");
    return "placeholder" in i;
  }

  get search() {
    return this.searchSupportArr.length > 0;
  }

  get searchText() {
    let searchArr: Array<string> = [];
    this.searchSupportArr.forEach((item) => {
      searchArr.push(item.title);
    });
    return searchArr.join("/");
  }

  get footer() {
    //获取页数组
    let footerArr = [];
    let i = 0;
    let pageIndex = Math.ceil(MAX_PAGE_LENGTH / 2);
    while (footerArr.length < MAX_PAGE_LENGTH && footerArr.length < this.totalPage) {
      footerArr.push({
        text: this.page - pageIndex + i,
        value: this.page - pageIndex + i
      });
      i++;
    }

    //最小
    let startIndex = footerArr[0].text - 1;
    let endIndex = footerArr[footerArr.length - 1].text - this.totalPage;
    if (startIndex < 0) {
      footerArr.forEach((item) => {
        item.text = item.text - startIndex;
        item.value = item.value - startIndex;
      });
    } else if (endIndex > 0) {
      footerArr.forEach((item) => {
        item.text = item.text - endIndex;
        item.value = item.value - endIndex;
      });
    }

    if (this.totalPage > MAX_PAGE_LENGTH) {
      if (this.page > MAX_PAGE_LENGTH / 2) {
        //前面省略号
        footerArr[1] = {
          text: "...",
          value: "prevBtn"
        };
        footerArr[0] = {
          text: "1",
          value: "1"
        };
      }

      if (this.page <= this.totalPage - MAX_PAGE_LENGTH / 2) {
        //后面省略号
        footerArr[MAX_PAGE_LENGTH - 2] = {
          text: "...",
          value: "nextBtn"
        };
        footerArr[MAX_PAGE_LENGTH - 1] = {
          text: this.totalPage,
          value: this.totalPage
        };
      }
    }

    return footerArr;
  }

  columns: Array<ObjectAny> = []; //表头信息
  checkboxField = "";
  tableScroll = false;
  tableScrollWidth = 17;
  bodyHeight = 0;
  tableData = []; //表格数据
  checkboxAllVal = CHECKBOX_UNCHECKED; //全选
  searchValue = ""; //搜索文字
  page = 1; //当前页
  MAX_PAGE_LENGTH = MAX_PAGE_LENGTH;
  pageData: Array<ObjectAny> = [];
  searchSupportArr: Array<ObjectAny> = []; //支持search字段
  selectAllOption = {
    values: {
      on: CHECKBOX_CHECKED,
      off: CHECKBOX_UNCHECKED
    },
    sortArray: [
      {
        title: "",
        value: CHECKBOX_CHECKED
      }
    ],
    changeCallBack: this.changeCheckboxAll
  };

  checkboxOptions: ObjectAny = {
    values: {
      on: CHECKBOX_CHECKED,
      off: CHECKBOX_UNCHECKED
    },
    sortArray: [
      {
        title: "",
        value: CHECKBOX_CHECKED
      }
    ],
    events: () => {
      return {
        click: this.clickCheckbox
      };
    }
  };

  created() {
    this.columns = [];
    this.searchSupportArr = [];
    this.$on("add.column", (item: ObjectAny) => {
      if (this.columns.some((colItem) => item.field == colItem.field)) {
        return;
      }
      if (item.selectAll) {
        //全选字段名称
        this.checkboxField = item.field;
      }

      if (item.isSearch) {
        //支持搜索
        this.searchSupportArr.push({
          title: item.title,
          field: item.field
        });
      }

      this.columns.push(item);
    });

    this.$on("update.column", (item: ObjectAny) => {
      let exsitIndex = -1;
      let exsitCol = this.columns.filter((colItem, index) => {
        if(item.field == colItem.field) {
          exsitIndex = index;
          return true;
        }
      });
      if(exsitCol.length === 0) {
        return;
      }
      //替换
      this.columns.splice(exsitIndex, 1, item);
    });

    this.$on("remove.column", (field: string) => {
      this.columns = this.columns.filter((item) => item.field != field);
    });
  }
  updateTable() {
    this.pageData = this.getPageData();
    this.updateScroll();
    this.$nextTick(() => {
      this.$emit("updateCallBack", this.pageData);
    });
  }

  goSearch() {
    if (this.searchValue == "") {
      this.tableData = copyDeepData(this.data);
    } else {
      let searchField: Array<any> = [];
      this.searchSupportArr.forEach((item) => {
        searchField.push(item.field);
      });
      this.tableData = filterTable(this.data, this.searchValue, searchField);
    }
    this.page = 1;
    this.checkboxAllVal = CHECKBOX_UNCHECKED;
    this.updateTable();
  }

  changeCheckboxAll(val: string) {
    this.tableData.forEach((item: ObjectAny) => {
      this.$set(item, this.checkboxField, val);
    });
  }

  clickRow(rowData: ObjectAny) {
    this.$emit("clickRow", rowData);
  }

  clickCheckbox() {
    if (this.checkboxAllVal == CHECKBOX_UNCHECKED) {
      //未选中时，如果全部都选中，则选中
      let result = this.pageData.every((item: ObjectAny) => {
        return item[this.checkboxField] == CHECKBOX_CHECKED;
      });
      if (result) {
        this.checkboxAllVal = CHECKBOX_CHECKED;
      }
    } else {
      //选中时，如果存在未选中的，则取消选中
      let result = this.pageData.some((item: ObjectAny) => {
        return item[this.checkboxField] == CHECKBOX_UNCHECKED;
      });
      if (result) {
        this.checkboxAllVal = CHECKBOX_UNCHECKED;
      }
    }
  }

  //更新表格的滚动条
  updateScroll() {
    //计算滚动条显示
    this.$nextTick(function() {
      if (((this.$refs["table-body-tr"] as Array<HTMLElement>) || []).length === 0) {
        return;
      }
      let trHeightArr = (this.$refs["table-body-tr"] as Array<HTMLElement>).slice(0, this.maxRow),
        trHeight = 0;
      trHeight = trHeightArr.reduce(function(prev, trEl) {
        return trEl.offsetHeight + prev;
      }, 0);
      if (this.maxRow < this.pageData.length) {
        this.bodyHeight = trHeight;
        this.tableScroll = true;
      } else {
        this.tableScroll = false;
      }
      this.$nextTick(() => {
        if(!this.tableScroll) {
          return;
        }
        let tableWidth = (this.$refs["table-body"] as HTMLDivElement).offsetWidth;
        let tableParentWidth = (this.$refs["table-body"] as any).parentNode.offsetWidth;

        this.tableScrollWidth = tableParentWidth - tableWidth;
      });
    });
  }

  //获取当前页的数据
  getPageData() {
    //是否分页
    if (this.showPage !== false) {
      return this.tableData.slice((this.page - 1) * this.perPage, this.page * this.perPage);
    }
    return this.tableData;
  }

  //跳转到下一页
  gotoPage(nextPage: string | number) {
    //切换页
    if (nextPage == "prev") {
      nextPage = this.page - 1;
    } else if (nextPage == "next") {
      nextPage = this.page + 1;
    } else if (nextPage == "nextBtn") {
      nextPage = this.footer[this.footer.length - 3].value;
    } else if (nextPage == "prevBtn") {
      nextPage = this.footer[2].value;
    }

    //当下一页超出范围 或者下一页 == 当前页时
    if (nextPage < 1 || nextPage > this.totalPage || nextPage == this.page) {
      return;
    }
    //当前页
    this.page = Number(nextPage);
    //当前页数据
    this.pageData = this.getPageData();

    //切换页面时，清除选中
    if (this.checkboxField) {
      this.pageData.forEach((item) => this.$set(item, this.checkboxField, CHECKBOX_UNCHECKED));
      this.checkboxAllVal = CHECKBOX_UNCHECKED;
    }
  }

  @Watch("data", { immediate: true })
  onPageDataChanged(val: any) {
    this.tableData = copyDeepData(val || []);
    this.updateTable();
  }
}
</script>


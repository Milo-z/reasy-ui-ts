## 组件

### 警告框与对话框

组件标签 v-dialog，内容是对话框需要的内容

| 属性           | 默认值 | 类型     | 备注                   |
| -------------- | ------ | -------- | ---------------------- |
| css            |        | string   | 样式                   |
| title          |        | string   | 标题                   |
| hasOK          | true   | boolean  | 是否有确认按钮         |
| hasCancel      | true   | boolean  | 是否有取消按钮         |
| outside        | true   | boolean  | 是否点击外部直接隐藏   |
| autoHide       | true   | boolean  | 点击确定后是否自动隐藏 |
| hasClose       | true   | boolean  | 是否有关闭按钮         |
| okText         | 确定   | string   | 确认按钮文字           |
| cancelText     | 取消   | string   | 取消按钮文字           |
| show           | true   | boolean  | 是否显示               |
| beforeClose    |        | Function | 保存关闭前事件         |
| cancelCallBack |        | Function | 取消事件               |

支持事件 hide，参数为当前对话框是否显示的boolean

### 按钮

组件标签v-button

| 属性     | 默认值 | 类型     | 备注     |
| -------- | ------ | -------- | -------- |
| css      |        | string   | 样式     |
| show     | true   | boolean  | 是否显示 |
| disabled | false  | boolean  | 是否禁用 |
| name     |        | string   | 名称     |
| callback |        | Function | 点击事件 |
| title    |        | string   | 标题     |

支持事件 callback，当属性 callback未定义时，执行callback事件

### 复选框

组件标签v-checkbox

| 属性           | 默认值                 | 类型     | 备注                                                         |
| -------------- | ---------------------- | -------- | ------------------------------------------------------------ |
| required       | false                  | boolean  | 是否必填                                                     |
| css            |                        | string   | 样式                                                         |
| show           | true                   | boolean  | 显示                                                         |
| ignore         | false                  | boolean  | 是否忽略验证                                                 |
| disabled       | false                  | boolean  | 是否禁用                                                     |
| error          |                        | string   | 错误信息                                                     |
|                |                        | string   | 自定义错误信息                                               |
| name           |                        | string   | 名称                                                         |
| value          |                        | any      | 值                                                           |
| hasSelectAll   | false                  | boolean  | 是否有全选                                                   |
| selectAllText  | 全选                   | string   | 全选文字                                                     |
| sortArray      |                        | Array    | 选项数组                                                     |
| values         | {on: true, off: false} | Object   | 单个复选框时选中和不选中值，<br />on：选中的值  off：未选中的值 |
| changeCallBack |                        | Function | 值修改后的回调事件                                           |

sortArray数组属性

| 属性     | 默认值 | 类型    | 备注         |
| -------- | ------ | ------- | ------------ |
| value    |        | string  | 值           |
| disabled |        | boolean | 是否禁用     |
| title    |        | string  | 选项标题文字 |

### 块级显示隐藏

组件标签v-elem，属性show 表示是否显示

### 表单*

组件标签 v-form

| 属性         | 默认值 | 类型     | 备注                                      |
| ------------ | ------ | -------- | ----------------------------------------- |
| css          |        | string   | 样式                                      |
| submitText   | 保存   | string   | 保存文字                                  |
| hasSubmit    | false  | boolean  | 是否有保存                                |
| hasCancel    | false  | boolean  | 是否有取消                                |
| cancelText   | 保存   | string   | 取消文字                                  |
| beforeSubmit |        | Function | 保存前操作，返回false时，不会执行表单提交 |
| submit       |        | Function | 提交动作                                  |
| cancel       |        | Function | 取消动作                                  |

事件

当 submit属性不为函数时，则执行submit事件，参数为当前表单的数据

当 cancel属性不为函数时，则执行cancel事件，无参数

组件 v-form-item 

| 属性        | 默认值 | 类型    | 备注                           |
| ----------- | ------ | ------- | ------------------------------ |
| dataKey     |        | Object  | 组件需要的属性                 |
| vname       |        | string  | 组件名称                       |
| title       |        | string  | 标题                           |
| field       |        | string  | 字段名称，为空时取dataKey.name |
| hasHelpInfo | false  | boolean | 输入框是否需要帮助信息         |
| helpText    |        | string  | 帮助信息                       |



### 输入框

组件标签 v-input

| 属性        | 默认值 | 类型    | 备注               |
| ----------- | ------ | ------- | ------------------ |
| required    | false  | boolean | 是否必填           |
| css         |        | string  | 样式               |
| show        | true   | boolean | 显示               |
| ignore      | false  | boolean | 是否忽略验证       |
| disabled    | false  | boolean | 是否禁用           |
| error       |        | string  | 错误信息           |
| msg         |        | string  | 自定义错误信息     |
| name        |        | string  | 名称               |
| value       |        | string  | 值                 |
| valid       |        | string  | 数据验证类型       |
| hasEye      | false  | boolean | 是否支持小眼睛     |
| isNum       | false  | boolean | 是否输入为数字     |
| type        | text   | string  | 输入框类型         |
| placeholder |        | string  | 占位符             |
| maxlength   |        | number  | 输入框最大输入长度 |
| inputCss    |        | string  | 输入框样式         |

```
//推荐使用，内部封装数据验证
<v-form-item vname="v-ip" v-model="formData.lanIP" :data-key="lanIP" :title="_('局域网IP')"></v-form-item>
//
<v-input @change="changeIP" :value="formData.lanIP" v-bind="lanIP"></v-input>

lanIP = {
    name: "lanIP",
    valid: "ip",
  	maxlength: 15
};

changeIP(val) {
	this.formData.lanIP = val;
}
```



### 输入框组

组件标签v-input-group

| 属性      | 默认值 | 类型    | 备注                                     |
| --------- | ------ | ------- | ---------------------------------------- |
| required  | false  | boolean | 是否必填                                 |
| css       |        | string  | 样式                                     |
| show      | true   | boolean | 显示                                     |
| ignore    | false  | boolean | 是否忽略验证                             |
| disabled  | false  | boolean | 是否禁用                                 |
| error     |        | string  | 错误信息                                 |
| msg       |        | string  | 自定义错误信息                           |
| name      |        | string  | 名称                                     |
| value     |        | any     | 值                                       |
| valid     |        | string  | 数据验证类型                             |
| column    | 4      | number  | 输入框个数                               |
| maxlength | 3      | number  | 输入框最大输入长度                       |
| splitter  | .      | string  | 分隔符                                   |
| allow     | 0-9    | string  | 允许输入字段，最后会转成正则且忽略大小写 |



### IP输入框

组件标签v-ip，参数继承输入框组的

### MAC输入框

组件标签v-mac，参数继承输入框组，其中以下参数有变动

| 属性      | 默认值 | 类型   | 备注               |
| --------- | ------ | ------ | ------------------ |
| column    | 6      | number | 输入框个数         |
| maxlength | 2      | number | 输入框最大输入长度 |
| splitter  | :      | string | 分隔符             |
| allow     | 0-9a-f | string | 允许输入的字符     |

### 单选按钮

| 属性           | 默认值 | 类型     | 备注               |
| -------------- | ------ | -------- | ------------------ |
| required       | false  | boolean  | 是否必填           |
| css            |        | string   | 样式               |
| show           | true   | boolean  | 显示               |
| ignore         | false  | boolean  | 是否忽略验证       |
| disabled       | false  | boolean  | 是否禁用           |
| error          |        | string   | 错误信息           |
| msg            |        | string   | 自定义错误信息     |
| name           |        | string   | 名称               |
| value          |        | any      | 值                 |
| sortArray      |        | Array    | 选项数组           |
| changeCallBack |        | Function | 值修改后的回调事件 |

### 下拉框

| 属性           | 默认值 | 类型     | 备注                 |
| -------------- | ------ | -------- | -------------------- |
| required       | false  | boolean  | 是否必填             |
| css            |        | string   | 样式                 |
| show           | true   | boolean  | 显示                 |
| ignore         | false  | boolean  | 是否忽略验证         |
| disabled       | false  | boolean  | 是否禁用             |
| error          |        | string   | 错误信息             |
| msg            |        | string   | 自定义错误信息       |
| name           |        | string   | 名称                 |
| defaultVal     |        | string   | 默认值               |
| value          |        | any      | 值                   |
| sortArray      |        | Array    | 选项数组             |
| hasManual      | false  | boolean  | 是否支持手动输入     |
| manualText     | 自定义 | string   | 自定义文字           |
| manualValue    | -1     | string   | 自定义值             |
| maxlength      |        | number   | 最大输入长度         |
| immediate      | true   | boolean  | 是否立即执行回调函数 |
| isNum          | false  | boolean  | 是否支持数字输入     |
| type           |        | string   | 输入框类型           |
| placeholder    |        | string   | 占位符               |
| valid          |        | string   | 数据验证类型         |
| changeCallBack |        | Function | 值修改后的回调事件   |
| beforeChange   |        | Function | 值修改前的事件       |

### 开关

组件标签 v-switch

| 属性           | 默认值                 | 类型     | 备注                 |
| -------------- | ---------------------- | -------- | -------------------- |
| required       | false                  | boolean  | 是否必填             |
| css            |                        | string   | 样式                 |
| show           | true                   | boolean  | 显示                 |
| ignore         | false                  | boolean  | 是否忽略验证         |
| disabled       | false                  | boolean  | 是否禁用             |
| error          |                        | string   | 错误信息             |
| name           |                        | string   | 名称                 |
| value          |                        | any      | 值                   |
| values         | {on: true, off: false} | Object   | 开启和关闭的值       |
| hasTips        | false                  | boolean  | 是否显示开关后的文字 |
| changeCallBack |                        | Function | 值修改后的回调事件   |
| beforeChange   |                        | Function | 值修改前的事件       |

### 表格*

支持用户自定义表格内容，解决之前表格自定义组件难的问题

组件标签 v-table

| 属性        | 默认值   | 类型    | 备注                                     |
| ----------- | -------- | ------- | ---------------------------------------- |
| data        |          | Array   | 表格数据                                 |
| css         |          | string  | 表格样式                                 |
| isLoading   | false    | boolean | 是否正在加载中                           |
| loadingText | 加载中   | string  | 加载中文字描述                           |
| noData      | 暂无数据 | string  | 没有数据时文字描述                       |
| maxRow      | 10       | number  | 表格最多显示多少行数据，超过则显示滚动条 |
| perPage     | 10       | number  | 每页多少条                               |
| hasHead     | true     | boolean | 是否显示表头                             |
| showPage    | false    | boolean | 是否分页显示                             |

表格的自定义事件

updateCallBack，表格更新后的事件，参数为表格当前页的数据

clickRow，点击当前行的事件，参数为当前行数据



表格列组件 v-table-col

| 属性      | 默认值 | 类型    | 备注             |
| --------- | ------ | ------- | ---------------- |
| title     |        | string  | 表头文字         |
| field     |        | string  | 表格字段         |
| css       |        | string  | 列样式           |
| width     |        | string  | 列宽度           |
| tooltip   | false  | boolean | 是否支持提示信息 |
| selectAll | false  | boolean | 是否支持全选     |
| isSearch  | false  | boolean | 是否支持搜索     |

表格列自定义组件，使用template的v-slot属性，然后自定义想要显示的内容即可。

示例：

```
<v-table :data="tableData" :isLoading="isLoading" showPage>
  <v-table-col tooltip width="60px" field="checked" selectAll></v-table-col>
  <v-table-col tooltip width="260px" title="无线信号名称" field="ssid" isSearch>
    <template v-slot="slotScope">
      <span class="ellipsis ssid-text">{{ slotScope.ssid }}</span>
      <span>{{ slotScope.chkHz }}</span>
    </template>
  </v-table-col>
  <v-table-col title="MAC地址" field="mac"></v-table-col>
  <v-table-col title="信道" width="60px" field="channel"></v-table-col>
  <v-table-col title="加密方式" field="securityMode"></v-table-col>
  <v-table-col title="信号强度" width="120px" field="signalStrength">
    <template v-slot="slotScope">
      <span v-if="slotScope.signalStrength > -50">高</span>
      <span v-else-if="slotScope.signalStrength > -70">中</span>
      <span v-else>低</span>
    </template>
  </v-table-col>
</v-table>
```


import Vue from "vue";

/** ElementUI component common definition */
export declare class UIComponent extends Vue {
  /** Install component into Vue */
  static install(vue: typeof Vue): void;
  $target: UIComponent;
}

export interface DataKey {
  required?: boolean;
  css?: string;
  show?: boolean;
  ignore?: boolean;
  disabled?: boolean;
  val?: any;
  values?: any[];
  error?: string;
  hasTips?: boolean;
  hasSelectAll?: boolean;
  immediate?: boolean;
  sortArray?: ItemObject[];
  changeCallBack?: () => void;
  beforeChange?: () => void;
  valid?: string;
  max?: number,
  min?: number,
  msg?: string,
  options?: any[] | object;
  [proName: string]: any;
}



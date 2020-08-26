import Vue, { VNode } from "vue";
import { DataKey, UIComponent } from "./component";


declare module "vue/types/vue" {
  //声明为 Vue 补充的东西
  interface Vue {
    $valid: ObjectAny;
    $isMobile: boolean;
    $message: Function;
    $success: Function;
    $checkData: Function;
    $confirm: Function;
    $dispatch: Function;
    $getLabelWidth: Function;
    _: Function;
  }
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }

  function _(str: string, args?: any): any;

  interface Window {
    _: Function;
    B: any;
    Vue: any;
  }

  interface DK extends DataKey {}
  interface ItemObject {
    title: string;
    value: any;
    disabled?: boolean;
  }

  interface ObjectAny {
    [prop: string]: any;
  }

  interface FuncObject {
    [prop: string]: Function;
  }

  interface ReasyUI extends UIComponent {}


  interface ValidFunc {
    all: Function;
    specific: Function
  }

  interface Document{
    selection: any;
  }

  interface Valid {
    type: string;
    args?: Array<string>;
  }

  interface HTMLElement {
    cssList: ObjectAny;
    addClass: Function;
    removeClass: Function;
  }
}

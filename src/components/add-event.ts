import {Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class EventMixin extends Vue {

  @Prop({ default: function(){} }) readonly events!: Function;

  evtName = "";
  evtArr:Array<string> = [];
  evtHandlerList:Array<Function> = [];

  created() {
    this.addEvent();
  }

  addEvent() {
    let evtnameArr = [],
      evtHandlerList = [];
    if(typeof this.events != "function") {
      return;
    }
    for (let prop in this.events()) {
      evtnameArr.push(prop);
      evtHandlerList.push(this.events()[prop]);
    }
    this.evtArr = evtnameArr;
    this.evtHandlerList = evtHandlerList;
    this.evtName = this.evtArr.join(";");
  }

}


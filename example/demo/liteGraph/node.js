import {Node} from 'butterfly-dag';
import $ from 'jquery';

class BaseNode extends Node {
  constructor(opts) {
    super(opts);
    this.titleBox = null;
  }
  mounted() {
    if (this.grayDom_3) {
      this.addEndpoint({
        id: 'gamepad_0',
        dom: this.grayDom_3,
      });
    }
    if (this.greenDom_1) {
      this.addEndpoint({
        id: 'gamepad_1',
        dom: this.greenDom_1
      });
    }
    if (this.grayDom_2) {
      this.addEndpoint({
        id: 'gamepad_2',
        dom: this.grayDom_2
      });
    }
    if (this.logEventDom) {
      this.addEndpoint({
        id: 'log_event_01',
        dom: this.logEventDom,
      });
    }
    if (this.widEndpointDom) {
      this.addEndpoint({
        id: 'widgest_1',
        orientation: [1, 0],
        dom: this.widEndpointDom,
      });
    }
  }
  draw = (data) => {
    let container = $('<div class= "test-base-node"></div>')
      .css('top', data.top)
      .css('left', data.left)
      .css('width', data.options.width)
      .css('height', data.options.height)
      .attr('id', data.id);
    switch (this.options.id) {
      case 'gamepad' :
        this.greenDom_1 = ($('<div class="custom-green-rectangle-point game-point_1"></div>'));
        this.grayDom_2 = ($('<div class="custom-gray-point game-point_2"></div>'));
        this.grayDom_3 = $('<div class="custom-gray-point game-point_3"></div>');
        break;
      case 'logEvent':
        this.logEventDom = $('<div class="custom-green-rectangle-point log-event-point_1"></div>');
        break;
      case 'widgest':
        this.widEndpointDom = $(`<div class="custom-green-circle-point widgest-point_1"></div>`);
        break;
      default:
    }

    if (data.options.endPointLabel) {
      let endpoint1 = $('<div class="endpointInfo endpoint1"></div>');
      let endpoint2 = $('<div class="endpointInfo endpoint2"></div>');
      let endpoint3 = $('<div class="endpointInfo endpoint3"></div>');
      data.options.endPointLabel.forEach(item => {
        if (item.endpoint === 'greenDom_0') {
          endpoint1.append(`<span class="label_span">${item.label}</span>`);
          endpoint1.append(this.greenDom_1);
        } else if (item.endpoint === 'grayDom_1') {
          endpoint2.append(`<span class="label_span">${item.label}</span>`);
          endpoint2.append(this.grayDom_2);
        } else if (item.endpoint === 'grayDom_2') {
          endpoint3.append(`<span class="label_span">${item.label}</span>`);
          endpoint3.append(this.grayDom_3);
        }
      });
      container.append(endpoint1);
      container.append(endpoint2);
      container.append(endpoint3);
    }

    if (this.logEventDom) {
      container.append(this.logEventDom);
    }

    if (this.widEndpointDom) {
      container.append(this.widEndpointDom);
    }

    container.append(`<span class='text'>${data.options.text}</span>`);
    return container[0];
  }
}
export default BaseNode;

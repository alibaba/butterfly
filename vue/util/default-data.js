const defaultOptions = {
  disLinkable: true, // 可删除连线
  linkable: true, // 可连线
  draggable: true, // 可拖动
  zoomable: true, // 可放大
  moveable: true, // 可平移
  theme: {
    edge: {
      arrow: true,
      type: 'Straight',
    }
  }
};


const defaultGroup = 
  (
    `
      <div class="vue-bf-group">
      <div class="vue-bf-group-header">
          {{ id }}
        </div>
        <div class="vue-bf-group-content"></div> 
      </div>
    `
  );

const defaultNode = 
  (
    `
      <div class="vue-bf-node">
        {{ id }}
      </div>
    `
  );



export {
  defaultOptions,
  defaultGroup,
  defaultNode,
};
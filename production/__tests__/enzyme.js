import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';
import sinon from 'sinon';

import FullViz from '../client/fullVizView.jsx'
import GraphViz from '../client/Viz.jsx';
import ExpandPerfData from '../client/expandPerfData.jsx';
import TestWindow from '../client/testWindow.jsx';

configure({ adapter: new Adapter() });

describe('React unit tests', () => {
  describe('historyView', () => {
    let wrapper;

    beforeAll(() => {
      wrapper = shallow(<FullViz />);
    });

    it('Renders a <div> tag', () => {
      expect(wrapper.type()).toEqual('div');
      expect(wrapper.hasClass('fullpageViz')).toEqual(true);
	  });
      
    it('Renders children HTML elements correctly', () => {
      expect(wrapper.find('.fullpageViz').find('div')).toHaveLength(4);
      expect(wrapper.find('#title')).toHaveLength(1);
      expect(wrapper.find('img')).toHaveLength(1);
      expect(wrapper.find('#fullVizParent')).toHaveLength(1);
      expect(wrapper.find('#fullVizContainer')).toHaveLength(1);
    });
  });


  describe('GraphViz', () => {
    let wrapper;
    
    const props = {
      height: "1000px",
      width: "100%",
      fullGraph: true
    };
    
    beforeAll(() => {
      wrapper = shallow(<FullViz />);
    });

    it('Passes props to GraphViz correctly', () => {
      expect(wrapper.containsMatchingElement(<GraphViz height={props.height} width={props.width} fullGraph={props.fullGraph} />)).toEqual(true);
    });
  });


  // describe('Viz.js', () => {
  //   let wrapper;
    
  //   const props = {
  //     height: "1000px",
  //     width: "100%",
  //     fullGraph: true
  //   };
    
  //   beforeAll(() => {
  //     wrapper = mount(<GraphViz {...props}/>);
  //   });

  //   it('Passes props to GraphViz correctly', () => {
  //     // expect(wrapper.containsMatchingElement(<GraphViz height={props.height} width={props.width} fullGraph={props.fullGraph} />)).toEqual(true);
  //     expect(wrapper.type()).toEqual('div');

  //   });
  // });

  describe('ExpandPerfData', () => {
    let wrapper;
    
    const props = {
      showWindow: true,
    };
    
    beforeAll(() => {
      wrapper = shallow(<ExpandPerfData showWindow={true} />);
    });

    it('Passes props to GraphViz correctly', () => {
      expect(wrapper.containsMatchingElement(<TestWindow />)).toEqual(true);
      // wrapper cannot find TestWindow



      // props.showWindow = true;
      // expect(wrapper.containsMatchingElement(<TestWindow />)).toEqual(true);
    });
  });



});


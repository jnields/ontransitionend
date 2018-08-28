/* eslint-env mocha, browser */
import sinon from 'sinon';
import chai from 'chai';
import ontransitionend from '..';

const { assert } = chai;

function reflow(el) {
  // eslint-disable-next-line no-void
  void el.offsetParent;
}

describe('ontransitionend', () => {
  it('should subscribe and unsubscribe event handlers', (done) => {
    const content = document.createElement('div');
    const style = document.createElement('style');
    content.className = 'animated';
    style.innerHTML = `
.animated {
  width: 1px;
  -o-transition: width .1s;
  -moz-transition: width .1s;
  -webkit-transition: width .1s;
  transition: width .1s;
}
.changed {
  width: 2px;
}
`;
    document.head.appendChild(style);
    document.body.appendChild(content);

    reflow(content);

    const spy = sinon.spy();

    const unsubscribe = ontransitionend(content, spy);
    requestAnimationFrame(() => {
      content.className += ' changed';
      setTimeout(() => {
        assert.equal(spy.callCount, 1, 'calls handler');
        const { propertyName, elapsedTime } = spy.args[0][0];
        assert.equal(propertyName, 'width');
        assert.equal(+elapsedTime.toFixed(4), 0.1);
        unsubscribe();
        content.className = 'animated';
        reflow(content);
        setTimeout(() => {
          assert.equal(spy.callCount, 1, 'does not call handler once unsubscribe');
          done();
        }, 150);
      }, 150);
    });
  });
});

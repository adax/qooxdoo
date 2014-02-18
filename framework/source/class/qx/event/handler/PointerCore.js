/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2014 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christopher Zuendorf (czuendorf)
     * Daniel Wagner (danielwagner)

************************************************************************ */

/**
 * Low-level pointer event handler.
 *
 * @require(qx.bom.client.Event)
 */
qx.Bootstrap.define("qx.event.handler.PointerCore", {

  extend : Object,

  statics : {
    MOUSE_TO_POINTER_MAPPING: {
      mousedown: "pointerdown",
      mouseup: "pointerup",
      mousemove: "pointermove",
      contextmenu: "pointerup",
      mouseout: "pointerout",
      mouseover: "pointerover"
    },

    MOUSE_PROPERTIES : {
      bubbles : false,
      cancelable : false,
      view : null,
      detail : null,
      screenX : 0,
      screenY : 0,
      clientX : 0,
      clientY : 0,
      ctrlKey : false,
      altKey : false,
      shiftKey : false,
      metaKey : false,
      button : 0,
      relatedTarget : null
    }
  },

  /**
   * Create a new instance
   *
   * @param target {Element} element on which to listen for native touch events
   * @param emitter {qx.event.Emitter} Event emitter object
   */
  construct : function(target, emitter)
  {
    this.__target = target;
    this.__emitter = emitter;
    this.__eventNames = [];
    this.__mousedown = false;
    if (qx.core.Environment.get("event.mspointer")) {
      this._initPointerObserver();
    }
    // else if (qx.core.Environment.get("device.touch")) {
    //   this._initTouchObserver();
    // }
    else {
      this._initMouseObserver();
    }
  },

  members : {

    __emitter : null,
    __eventNames : null,
    __wrappedListener : null,
    __mousedown : null,

    /**
     * Adds listeners to native pointer events if supported
     */
    _initPointerObserver : function() {
      this.__wrappedListener = qx.lang.Function.listener(this._onPointerEvent, this);

      var engineVersion = parseInt(qx.core.Environment.get("engine.version"), 10);
      if (engineVersion == 10) {
        // IE 10
        this.__eventNames = ["MSPointerDown", "MSPointerMove", "MSPointerUp", "MSPointerCancel"];
      } else {
        // IE 11+
        this.__eventNames = ["pointerdown", "pointermove", "pointerup", "pointercancel"];
      }
      for (var i = 0; i < this.__eventNames.length; i++) {
        qx.bom.Event.addNativeListener(this.__target, this.__eventNames[i], this.__wrappedListener);
      }
    },

    _initTouchObserver : function() {
      this.__wrappedListener = qx.lang.Function.listener(this._onTouchEvent, this);
    },

    _initMouseObserver : function() {
      this.__eventNames = ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "contextmenu"];
      this.__wrappedListener = qx.lang.Function.listener(this._onMouseEvent, this);
      this.__eventNames.forEach(function(type) {
        qx.bom.Event.addNativeListener(this.__target, type, this.__wrappedListener);
      }.bind(this));
    },

    /**
     * Handler for native pointer events
     * @param domEvent {Event} Native pointer event
     */
    _onPointerEvent : function(domEvent) {

    },

    _onTouchEvent : function(domEvent) {

    },

    _onMouseEvent : function(domEvent) {
      if (domEvent.type == "mousedown" && this.__mousedown) {
        return;
      }
      if (domEvent.type == "contextmenu") {
        this.__mousedown = false;
      }
      var type = qx.event.handler.PointerCore.MOUSE_TO_POINTER_MAPPING[domEvent.type];
      var props = qx.lang.Object.clone(qx.event.handler.PointerCore.MOUSE_PROPERTIES);

      var propNames = Object.keys(props);
      for (var i=0; i<propNames.length; i++) {
        if (typeof domEvent[propNames[i]] !== "undefined") {
          props[propNames[i]] = domEvent[propNames[i]];
        }
      }

      var evt = new MouseEvent(type);
      evt.initMouseEvent(type, props.bubbles, props.cancelable, props.view, props.detail,
        props.screenX, props.screenY, props.clientX, props.clientY, props.ctrlKey,
        props.altKey, props.shiftKey, props.metaKey, props.button, props.relatedTarget);

      var buttons;
      switch (domEvent.which) {
        case 1:
          buttons = 1;
          break;
        case 2:
          buttons = 4;
          break;
        case 3:
          buttons = 2;
          break;
        default:
          buttons = 0;
      }
      evt.buttons = buttons;

      this._fireEvent(evt, type, domEvent.target);

      if (type == "pointerdown") {
        this.__mousedown = true;
      }
      else if (type == "pointerup") {
        this.__mousedown = false;
      }
    },

    /**
     * Removes native pointer event listeners.
     */
    _stopObserver : function() {
      for (var i = 0; i < this.__eventNames.length; i++) {
        qx.bom.Event.removeNativeListener(this.__target, this.__eventNames[i], this.__wrappedListener);
      }
    },

    /**
     * Fire a touch event with the given parameters
     *
     * @param domEvent {Event} DOM event
     * @param type {String ? null} type of the event
     * @param target {Element ? null} event target
     */
    _fireEvent : function(domEvent, type, target)
    {
      target = target || domEvent.target;
      type = type || domEvent.type;

      if (target && target.nodeType && this.__emitter)
      {
        this.__emitter.emit(type, domEvent);
      }
    },

    /**
     * Dispose this object
     */
    dispose : function() {
      this._stopObserver();
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)
     
************************************************************************ */
/**
 * Test-Class for testing the single value binding
 */
qx.Class.define("qx.test.data.singlevalue.Array",
{
  extend : qx.dev.unit.TestCase,

  construct : function() {
    this.base(arguments); 
    
    // define a test class
    qx.Class.define("test.MultiBinding", 
    {
      extend : qx.core.Object,

      properties :
      {
        child : {
          check : "test.MultiBinding",
          event : "changeChild",
          nullable : true
        },
        
        children : {
          check : "qx.data.Array",
          event : "changeChildren",
          init : new qx.data.Array()
        },
        
        name : {
          check : "String",
          init : "Juhu",
          event : "changeName"
        },
        
        array : {
          init : new qx.data.Array(["one", "two", "three"]),
          event: "changeArray"
        }
      }
    });       
  },
  

  members :
  {       
    
    setUp : function()
    {
      this.__a = new test.MultiBinding().set({
        name: "a"
      });
      this.__b1 = new test.MultiBinding().set({
        name: "b1"
      });
      this.__b2 = new test.MultiBinding().set({
        name: "b2"
      });
      this.__label = new qx.ui.basic.Label();    
      
      // remove all bindings
      qx.data.SingleValueBinding.removeAllBindings();        
    },


    tearDown : function()
    {
      this.__b1.dispose();
      this.__b2.dispose();
      this.__a.dispose();
      this.__label.dispose();
    },
    
    
    testChangeItem : function() {
      // bind the first element of the array
      qx.data.SingleValueBinding.bind(this.__a, "array[0]", this.__label, "content");
            
      // check the binding
      this.assertEquals("one", this.__label.getContent(), "Array[0] binding does not work!");
      // change the value
      this.__a.getArray().setItem(0, "ONE");
      this.assertEquals("ONE", this.__label.getContent(), "Array[0] binding does not work!");      
    },
    
    
    testChangeArray: function() {
      // bind the first element of the array
      qx.data.SingleValueBinding.bind(this.__a, "array[0]", this.__label, "content");
            
      // change the array itself
      this.__a.setArray(new qx.data.Array(1, 2, 3));
      qx.log.Logger.debug(this.__a.getArray().getItem(0));
      // check the binding
      this.assertEquals("1", this.__label.getContent(), "Changing the array does not work!");
    },
    
    
    testLast: function() {
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "array[last]", this.__label, "content"); 
      // check the binding
      this.assertEquals("three", this.__label.getContent(), "Array[last] binding does not work!");
      
      // change the value
      this.__a.getArray().setItem(2,"THREE");
      this.assertEquals("THREE", this.__label.getContent(), "Array[last] binding does not work!");      
    },
    
    
    testPushPop: function() {
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "array[last]", this.__label, "content"); 
      // check the binding
      this.assertEquals("three", this.__label.getContent(), "Array[last] binding does not work!");
      
      // pop the last element
      this.__a.getArray().pop();
      // check the binding
      this.assertEquals("two", this.__label.getContent(), "Array[last] binding does not work!");
      
      // push a new element to the end
      this.__a.getArray().push("new");
      // check the binding
      this.assertEquals("new", this.__label.getContent(), "Array[last] binding does not work!");      
    },
    
    
    testShiftUnshift: function() {
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "array[0]", this.__label, "content"); 
      // check the binding
      this.assertEquals("one", this.__label.getContent(), "Array[last] binding does not work!");
      
      // pop the last element
      this.__a.getArray().shift();
      // check the binding
      this.assertEquals("two", this.__label.getContent(), "Array[last] binding does not work!");
      
      // push a new element to the end
      this.__a.getArray().unshift("new");
      // check the binding
      this.assertEquals("new", this.__label.getContent(), "Array[last] binding does not work!");      
    },
    
    
    testChildArray: function() {
      // create the objects
      this.__a.setChild(this.__b1);
      this.__b1.setArray(new qx.data.Array("eins", "zwei", "drei"));
      this.__b2.setArray(new qx.data.Array("1", "2", "3"));
      
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "child.array[0]", this.__label, "content"); 
      // check the binding
      this.assertEquals("eins", this.__label.getContent(), "child.array[0] binding does not work!");
      
      // change the child
      this.__a.setChild(this.__b2);
      // check the binding
      this.assertEquals("1", this.__label.getContent(), "child.array[0] binding does not work!");
    },
    
    
    testChildren: function() {
      // create the objects
      this.__a.getChildren().push(this.__b1);
      this.__a.getChildren().push(this.__b2);
      
      // bind the last element
      qx.data.SingleValueBinding.bind(this.__a, "children[0].name", this.__label, "content"); 
      // check the binding
      this.assertEquals("b1", this.__label.getContent(), "children[0].name binding does not work!");
      
      // remove the first element
      this.__a.getChildren().shift();
      // check the binding
      this.assertEquals("b2", this.__label.getContent(), "children[0].name binding does not work!");
      
      // change the name of b2
      this.__b2.setName("AFFE");
      // check the binding
      this.assertEquals("AFFE", this.__label.getContent(), "children[0].name binding does not work!");
    }
       
  }
});

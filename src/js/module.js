function CustomType() {
  this.name = "tugenhua";
};
CustomType.prototype.getName = function(){
  return this.name;
}
const ModuleA = function(){
  // 定义私有
  var privateA = "aa";
  // 定义私有函数
  function A(){};

  // 实例化一个对象后，返回该实例，然后为该实例增加一些公有属性和方法
  var object = new CustomType();

  // 添加公有属性
  object.A = "aa";
  // 添加公有方法
  object.B = function(){
      return privateA;
  }
  // 返回该对象
  return object;
};

const moduleJS = function() {
  const data = ModuleA();
  console.log('ModuleA', data);
  console.log('ModuleA.A', data.A);// aa
  console.log('ModuleA.B()', data.B()); // aa
  console.log('ModuleA.name', data.name); // tugenhua
  console.log('ModuleA.getName()', data.getName());// tugenhua
}
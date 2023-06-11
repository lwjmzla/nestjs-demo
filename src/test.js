var SomeClass = /** @class */ (function () {
    function SomeClass() {
    }
    // eslint-disable-next-line class-methods-use-this
    SomeClass.prototype.test = function (para, str) {
        if (typeof para === 'number') {
            // !一般函数重载和类型守卫一起用。
            return para;
        }
        else {
            return para.name;
        }
    };
    return SomeClass;
}());
var some = new SomeClass();
var a = some.test({ name: 'lwj', age: 18 });
var b = some.test(1, 'true');

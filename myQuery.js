(function (w) {
    var arr = [];
    push = arr.push;
    document = w.document;
    function itcast(selector, context) {
        return new itcast.fn.init(selector, context);
    }

    itcast.fn = itcast.prototype = {
        constructor: itcast,
        selector: "",
        context: "",
        length: 0,
        init: function (selector, context) {
            if (!selector)return this;
            else if (itcast.isString(selector)) {
                if (itcast.isHTML(selector)) {
                    //HTML语义标签字符串
                    push.apply(this, itcast.parseHTML(selector));
                }
                else {
                    //选择器
                    push.apply(this, select(selector, context));
                    this.selector = selector;
                    this.context = context || document;
                }
                return this;
            }
            else if (itcast.isNode(selector)) {
                this[0] = selector;
                this.length = 1;
                return this;
            }
            else if (itcast.isArrayLike(selector)) {
                push.apply(this, selector);
                return this;
            }
            else if (itcast.isFunction(selector)) {
                var oldFn = w.onload;
                if (itcast.isFunction(oldFn)) {
                    w.onload = function () {
                        oldFn();
                        selector();
                    }
                }
                else {
                    w.onload = selector;
                }
                return this;
            }
            else if (itcast.isItcast(selector)) {
                return selector;
            }
        }
    }
    //extend方法封装
    itcast.extend = itcast.fn.extend = function (obj, target) {
        for (var key in obj) {
            target = target || this;
            target[key] = obj[key];
        }
    }
    //判断类型类
    itcast.extend({
        isString: function (selector) {
            return typeof selector === "string";
        },
        isHTML: function (selector) {
            var sel = itcast.trim(selector);
            return sel.charAt(0) == "<" && sel.charAt(sel.length - 1) == ">" && sel.length >= 3;
        },
        isNode: function (selector) {
            return !!selector.nodeType;
        },
        isWindow: function (selector) {
            return "window" in selector && selector.window == w;
        },
        isFunction: function (selector) {
            return typeof selector == "function";
        },
        isArrayLike: function (selector) {
            if (itcast.isWindow(selector) || itcast.isFunction(selector))return false;
            else return "length" in selector && selector.length == 0 || selector.length > 0 && (selector.length - 1 + "") in selector;
        },
        isItcast: function (selector) {
            return typeof selector == "object" && "selector" in selector;
        }
    });
    //工具类(itcast函数)
    itcast.extend({
        trim: function (str) {
            if (!str) {
                return "";
            }
            return str.replace(/^\s+|\s+$/g, "");
        },
        each: function (obj, callback) {
            for (var i = 0; i < obj.length; i++) {
                if (callback.call(obj[i], obj[i], i))return true;
            }
        },
        parseHTML: function (selector) {
            var div = document.createElement("div"), arr = [];
            div.innerHTML = selector;
            itcast.each(div.childNodes, function () {
                if (this.nodeType == 1)arr.push(this);
            });
            return arr;
        }
    });
    //工具类(itcast原型链)
    itcast.fn.extend({
        each: function (callback) {
            itcast.each.call(this, this, callback);
            return this;
        }
    });
    //css样式、类操作itcast函数
    itcast.extend({
        setCss: function (dom, name, value) {
            if (!value) {
                if (typeof name === "object") {
                    for (var key in name) {
                        dom.style[key] = name[key];
                    }
                }
            }
            else {
                dom.style[name] = value;
            }
        },
        getCss: function (dom, name) {
            return document.defaultView && document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(dom)[name] : dom.currentStyle[name];
        },
        hasClass: function (dom, className) {
            return (" " + dom.className + " ").indexOf(" " + itcast.trim(className) + " ") > -1;

        },
        addClass: function (dom, className) {
            if (!itcast.hasClass(dom, className)) dom.className = itcast.trim(dom.className += " " + className);
        },
        removeClass: function (dom, className) {
            if (className) {
                if (itcast.hasClass(dom, className)) {
                    dom.className = itcast.trim((" " + dom.className + " ").replace(" " + itcast.trim(className) + " ", " "));
                }
            } else {
                dom.removeAttribute("class");
            }

        },
        toggleClass: function (dom, className) {
            itcast.hasClass(dom, className) ? itcast.removeClass(dom, className) : itcast.addClass(dom, className);
        }
    });
    //css样式、类操作itcast原型链
    itcast.fn.extend({
        css: function (name, value) {
            if (!value) {
                if (typeof name === "object") {
                    return this.each(function () {
                        itcast.setCss(this, name);
                    });
                }
                else {
                    return this.length > 0 ? itcast.getCss(this[0], name) : undefined;
                }
            } else {
                return this.each(function () {
                    itcast.setCss(this, name, value);
                });
            }
        },
        hasClass: function (className) {
            return this.length > 0 ? itcast.hasClass(this[0], className) : false;
        },
        addClass: function (className) {
            return this.each(function () {
                itcast.addClass(this, className);
            });
        },
        removeClass: function (className) {
            return this.each(function () {
                itcast.removeClass(this, className);
            });
        },
        toggleClass: function (className) {
            return this.each(function () {
                itcast.toggleClass(this, className);
            });
        }
    });
    //属性操作itcast函数
    itcast.extend({
        getAttr: function (dom, name) {
            if (!name)return undefined;
            return dom.getAttribute(name);
        },
        setAttr: function (dom, name, value) {
            if (value) {
                dom.setAttribute(name, value);
            } else if (typeof name == "object") {
                for (var key in name) {
                    dom.setAttribute(key, name[key]);
                }
            }
        }
    });
    //属性操作itcast原型链
    itcast.fn.extend({
        attr: function (name, value) {
            if (value) {
                return this.each(function () {
                    itcast.setAttr(this, name, value);
                });
            } else {
                if (typeof name == "object") {
                    return this.each(function () {
                        itcast.setAttr(this, name);
                    });
                } else {
                    return this.length > 0 ? itcast.getAttr(this[0], name) : undefined;
                }
            }
        }
    });
    //html操作itcast函数
    itcast.extend({
        getHTML: function (dom) {
            return dom.innerHTML;
        },
        setHTML: function (dom, value) {
            dom.innerHTML = value;
        }
    });
    //html操作itcast原型链
    itcast.fn.extend({
        html: function (value) {
            if (!value) {
                return this.length > 0 ? itcast.getHTML(this[0]) : undefined;
            } else {
                return this.each(function () {
                    itcast.setHTML(this, value);
                });
            }
        }
    });
    //val操作itcast函数
    itcast.extend({
        getVal: function (dom) {
            return dom.value;
        },
        setVal: function (dom, v) {
            dom.value = v;//方法一
            //dom.setAttribute("value",v);//方法二
        }
    });
    //val操作itcast原型
    itcast.fn.extend({
        val: function (v) {
            if (v) {
                return this.each(function () {
                    itcast.setVal(this, v);
                });
            } else {
                return this.length > 0 ? itcast.getVal(this[0]) : undefined;
            }
        }
    });
    //text操作itcast函数
    itcast.extend({
        getText: function (dom) {
            if (dom.textContent) {
                return dom.textContent;
            } else {
                var str = "", ntype, elem;
                ntype = dom.nodeType;
                if (ntype === 1 || ntype === 9 || ntype === 11) {
                    for (elem = dom.firstChild; elem; elem = elem.nextSibling) {
                        str += itcast.getText(elem);
                    }
                } else if (ntype === 3) {
                    return dom.nodeValue;
                }
                return str;
            }
        },
        setText: function (dom, txt) {
            if (dom.textContent) {
                dom.textContent = txt;
            } else {
                dom.innerHTML = "";
                dom.appendChild(document.createTextNode(txt));
            }
        }
    });
    //text操作itcast函数
    itcast.fn.extend({
        text: function (txt) {
            if (!txt) {
                var result = "";
                this.each(function () {
                    result += itcast.getText(this);
                });
                return result;
            } else {
                return this.each(function () {
                    itcast.setText(this, txt);
                });
            }
        }
    });
    //append操作itcast原型
    itcast.fn.extend({
        appendTo: function (target) {
            var target = itcast(target);
            var self = this;
            var node, res = [];
            target.each(function (dom, i) {
                self.each(function () {
                    node = i === 0 ? this : this.cloneNode(true);
                    dom.appendChild(node);
                    res.push(node);
                });
            });
            return itcast(res);
        },
        append: function (source) {
            itcast(source).appendTo(this);
            return this;
        },
        //append: function (source) {
        //    var source=itcast(source);
        //    var node;
        //    return this.each(function (dom,i) {
        //        source.each(function () {
        //            node= i===0?this:this.cloneNode(true);
        //            dom.appendChild(node);
        //        });
        //    });
        //}
        prependTo: function (target) {
            var target = itcast(target);
            var self = this;
            var node, res = [];
            target.each(function (dom, i) {
                var firstNode = dom.firstChild;
                self.each(function () {
                    node = i === 0 ? this : this.cloneNode(true);
                    dom.insertBefore(node, firstNode);
                    res.push(node);
                });
            });
            return itcast(res);
        },
        prepend: function (source) {
            itcast(source).prependTo(this);
            return this;
        },
        remove: function () {
            return this.each(function () {
                this.parentNode.removeChild(this);
            });
        },
        empty: function () {
            return this.each(function () {
                this.innerHTML = "";
            });
        },
        next: function () {
            var res = [], dom;
            this.each(function () {
                for (dom = this.nextSibling; dom; dom = dom.nextSibling) {
                    if (dom.nodeType == 1) {
                        res.push(dom);
                        break;
                    }
                }
            });
            return itcast(res);
        },
        nextAll: function () {
            var res = [], dom;
            this.each(function () {
                for (dom = this.nextSibling; dom; dom = dom.nextSibling) {
                    if (dom.nodeType == 1) {
                        res.push(dom);
                    }
                }
            });
            return itcast(res);
        },
        //方法一
        //siblings: function () {
        //    var next, prev, ret = [];
        //    this.each(function () {
        //        for (next = this.nextSibling, prev = this.previousSibling;
        //             next && prev; next = next.nextSibling,
        //                 prev = prev.previousSibling) {
        //            if (next.nodeType === 1) ret.push(next);
        //            if (prev.nodeType === 1) ret.push(prev);
        //        }
        //    });
        //},
        //方法二
        siblings: function () {
            var result = [];
            this.each(function () {
                result.push.apply(result, itcast.siblings(this));
            });
            return itcast(result);
        },
        before: function (source) {
            var source = itcast(source);
            var node;
            return this.each(function (dom, i) {
                source.each(function () {
                    node = i === 0 ? this : this.cloneNode(true);
                    dom.parentNode.insertBefore(node, dom);
                });
            });
        },
        after: function (source) {
            var source = itcast(source);
            var node, nextNode;
            return this.each(function (dom, i) {
                nextNode = dom.nextSibling;
                source.each(function () {
                    node = i === 0 ? this : this.cloneNode(true);
                    nextNode ? dom.parentNode.insertBefore(node, nextNode) : dom.parentNode.appendChild(node);
                });
            });
        },
        get: function (index) {
            var index = index * 1;
            return w.isNaN(index) ? undefined : this[index];
        }
    });
    //siblings操作itcast函数
    itcast.extend({
        siblings: function (dom) {
            var res = [], node;
            for (node = dom.parentNode.firstChild; node; node = node.nextSibling) {
                if (node.nodeType === 1 && node != dom) {
                    res.push(node);
                }
            }
            return res;
        }
    });
    //on,off注册事件itcast原型
    itcast.fn.extend({
        on: function (types, selector, fn) {
            if (arguments.length === 1) {
                return this.each(function () {
                    if (typeof types === "object") {
                        for (var key in types) {
                            w.addEventListener ? this.addEventListener(key, types[key]) : this.attachEvent("on" + key, types[key]);
                        }
                    }
                });
            }
            else if (arguments.length === 2) {
                if (typeof types === "string" && typeof selector === "function") {
                    return this.each(function (dom) {
                        itcast.each(types.split(" "), function (type) {
                            w.addEventListener ? dom.addEventListener(type, selector) : dom.attachEvent("on" + type, selector);
                        });
                    });
                } else if (typeof types === "object" && typeof selector === "string") {
                    var selectors = itcast(selector, this);
                    selectors.each(function () {
                        for (var key in types) {
                            w.addEventListener ? this.addEventListener(key, types[key]) : this.attachEvent("on" + key, types[key]);
                        }
                    });
                    return selectors;
                }
            }
            else if (arguments.length === 3) {
                if (typeof types === "string" && typeof selector === "string" && typeof fn === "function") {
                    var selectors = itcast(selector, this);
                    selectors.each(function (dom) {
                        itcast.each(types.split(" "), function (type) {
                            w.addEventListener ? dom.addEventListener(type, fn) : dom.attachEvent("on" + type, fn);
                        });
                    });
                    return selectors;
                }
            }

        },
        off: function (type, fn) {
            return this.each(function () {
                w.removeEventListener ? this.removeEventListener(type, fn) : this.detachEvent("on" + type, fn);
            });
        }
    });
    //注册快捷事件
    itcast.each("click dblclick mouseenter mouseleave mousedown mouseup focus blur keyup keypress keydown scroll resize".split(" "), function (types) {
        itcast.fn[types] = function (fn) {
            return this.on(types, fn);
        }
    });
    //动画模块itast函数
    itcast.extend({
        easing: {
            "linear": function (x, t, b, c, d) {
                return (c - b) * t / d;
            },
            "minusspeed": function (x, t, b, c, d) {
                return (c - b) * t / d * (2 - t / d);
            }
        },
        start: {
            "left": "offsetLeft",
            "top": "offsetTop",
            "width": "offsetWidth",
            "height": "offsetHeight",
        },
        //获取初始值
        getLocations: function (dom, target) {
            var k, o = {};
            for (k in target) {
                o[k] = dom[itcast.start[k]];
                if (k == "opacity")o[k] = parseInt(itcast.getStyles(dom, "opacity")) * 100;
                if (k == "zIndex")o[k] = parseInt(itcast.getStyles(dom, "zIndex"));
            }
            return o;
        },
        getTargets: function (target) {
            var k, o = {};
            for (k in target) {
                o[k] = target[k];
                if (k == "opacity")o[k] = target[k] * 100;
            }
            return o;
        },
        //获取目标值与初始值之间的距离
        getDistances: function (locations, target) {
            var k, o = {};
            for (k in target) {
                o[k] = parseInt(target[k]) - locations[k];
                if (k == "zIndex")o[k] = target[k];
            }
            return o;
        },
        //获取time时间内的位移量
        getTweens: function (time, locations, target, dur, easingName) {
            var k, o = {};
            for (k in target) {
                if (k == "zIndex") {
                    o[k] = target[k];
                }
                else {
                    o[k] = itcast.easing[easingName](null, time, locations[k], parseInt(target[k]), dur);
                }
            }
            return o;
        },
        //设置样式
        setStyles: function (dom, locations, tweens) {
            var k;
            for (k in tweens) {
                if (k == "opacity") {
                    dom.style[k] = (locations[k] + tweens[k]) / 100;
                } else if (k == "zIndex") {
                    dom.style[k] = tweens[k];
                }
                else {
                    dom.style[k] = locations[k] + tweens[k] + "px";
                }
            }
        },
        getStyles: function (dom, styleName) {
            return dom.currentStyle ? dom.currentStyle[styleName] : document.defaultView.getComputedStyle(dom)[styleName];
        }
    });
    //itcast.easing动画方式扩充
    itcast.extend({
        easeInQuad: function (x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOutQuad: function (x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInQuart: function (x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOutQuart: function (x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOutQuart: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        },
        easeInQuint: function (x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOutQuint: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function (x, t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOutExpo: function (x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        },
        easeInCirc: function (x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOutCirc: function (x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInElastic: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOutElastic: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        },
        easeInOutElastic: function (x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4;
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        },
        easeInBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        }
    }, itcast.easing);
    //动画模块itast原型
    itcast.fn.extend({
        animate: function (targets, dur, easingName) {
            return this.each(function (dom) {
                var time, startT, currentT, tweens;
                var target = itcast.getTargets(targets);
                var locations = itcast.getLocations(dom, target);
                var distances = itcast.getDistances(locations, target);
                startT = +new Date;
                function render() {
                    currentT = +new Date;
                    time = currentT - startT;
                    if (dom.stopAni) {
                        dom.timer = undefined;
                        dom.stopAni = 0;
                        return;
                    }
                    if (time >= dur) {
                        tweens = distances;
                        itcast.setStyles(dom, locations, tweens);
                        dom.timer = undefined;
                        dom.stopAni = 0;
                        return;
                    } else {
                        tweens = itcast.getTweens(time, locations, target, dur, easingName);
                        itcast.setStyles(dom, locations, tweens);
                        w.requestAnimationFrame(render);
                    }
                }

                if (!dom.timer) {
                    dom.timer = w.requestAnimationFrame(render);
                    dom.stopAni = 0;
                }
            });
        },
        isAnimating: function () {
            return !!this[0] && !!this[0].timer;
        },
        stop: function () {
            return this.each(function () {
                this.stopAni = 1;
                this.timer = undefined;
            });
        }
    });
    //ajax模块
    itcast.extend({
        createXMLHttpRequset: function () {
            var xhr;
            if(w.XMLHttpRequest){
                xhr= new w.XMLHttpRequest();
            }else{
                xhr=new ActiveXObject("Microsoft.XMLHTTP")
            }
            return xhr;
        },
        formatParams: function (data) {
            var arr=[],k;
            if(!data)return null;
            for (k in data) {
                arr.push(encodeURIComponent(k)+"="+encodeURIComponent(data[k]));
            }
            arr.push(("_="+Math.random()).replace(".",""));
            return arr.join("&");
        },
        ajaxDefaultSeeting:{
            url:"",
            type:"GET",
            dataType:"json",
            async:true,
            data:null,
            success: function () {

            },
            fail: function () {

            },
            onreadystatechange: function (success,context,xhr,fail) {
                xhr.onreadystatechange= function () {
                    if(xhr.readyState==4){
                        if(xhr.status>=200&&xhr.status<=300){
                            var data;//返回结果
                            if(context.dataType.toLocaleLowerCase()=="json"){
                                data=JSON.parse(xhr.responseText);
                            }else{
                                data=xhr.responseText;
                            }
                            success&&success.call(context,data,xhr);
                        }else{
                            fail&&fail.call(context,{"message":"failed."},xhr)
                        }
                    }
                }
            }
        },
        ajax: function (options) {
            var xhr,data,context={};
            if(!options||!options.url){
                throw "参数异常";
            }
            itcast.extend(itcast.ajaxDefaultSeeting,context);
            itcast.extend(options,context);
            context.type=context.type.toLocaleLowerCase();
            xhr=itcast.createXMLHttpRequset();
            data=itcast.formatParams(context.data);//发送请求的数据
            if(context.type=="GET"){
                var url= !!context.data&&!!data?context.url+"?"+data:context.url;
                xhr.open("GET",url,context.async);
            }
            else{
                xhr.open("POST",context.url,context.async);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            }
            xhr.send(context.type==="GET"?null:data);
            context.onreadystatechange(context.success,context,xhr,context.fail);
        }
    });

    //jsonp模块
    itcast.extend({
        jsonp: function (options) {
            if(!options||!options.callback){
                throw "参数异常！"
            }
            var callbackName=('jsonp'+Math.random()).replace(".","");
            options.data[options.callback]=callbackName;
            var headEle=document.getElementsByTagName("head")[0];
            var params=itcast.formatParams(options.data);
            var scriptEle=document.createElement("script");
            headEle.appendChild(scriptEle);

            w[callbackName]= function (json) {
                clearTimeout(scriptEle.timer);
                headEle.removeChild(scriptEle);
                w[callbackName]=null;
                options.success&& options.success(json);
            };
            scriptEle.src=options.url+"?"+params;
            if(options.time){
                scriptEle.timer=setTimeout(function () {
                    w[callbackName]=null;
                    headEle.removeChild(scriptEle);
                    options.fail&&options.fail({"message":"请求超时"});
                },options.time);
            }
        },
        formatParams: function (data) {
            var k,ret=[];
            for (k in data) {
                ret.push(encodeURIComponent(k)+"="+encodeURIComponent(data[k]));
            }
            return ret.join('&');
        }
    });
    var select = (function () {
        var rnative = /^[^{]+\{\s*\[native \w/, rquickReg = /^(?:#([\w-]+)|\.([\w-]+)|(\w+)|(\*))$/, result = {
            getElementsByClassName: rnative.test(document.getElementsByClassName)
        }

        function getId(idName, results) {
            results = results || [];
            var node = document.getElementById(idName);
            results.push(node);
            return results;
        }

        function getTag(tagName, context, results) {
            results = results || [];
            context = context || document;
            results.push.apply(results, context.getElementsByTagName(tagName));
            return results;
        }

        function getClass(className, context, results) {
            results = results || [];
            context = context || document;
            if (result.getElementsByClassName) {
                results.push.apply(results, context.getElementsByClassName(className));
            } else {
                var nodes = getTag("*", context);
                each(nodes, function () {
                    if (" " + this.className + " ".indexOf(trim(className)) > -1) {
                        results.push(this);
                    }
                });
            }
            return results;
        }

        function get(selector, context, results) {
            context = context || document;
            results = results || [];
            var match = rquickReg.exec(selector);
            if (match) {
                if (match[1]) results = getId(match[1]);
                else {
                    var ntype = context.nodeType;
                    if (ntype == 1 || ntype == 9 || ntype == 11) context = [context];
                    if (typeof context == "string")context = get(context);
                    each(context, function () {
                        if (match[2]) results = getClass(match[2], this, results);
                        else if (match[3]) results = getTag(match[3], this, results);
                        else if (match[4])results = getTag("*", this, results)
                    });
                }
                return results;
            }
        }

        function trim(str) {
            return str.replace(/^\s+|\s+$/, "");
        }

        function each(obj, callback) {
            for (var i = 0; i < obj.length; i++) {
                if (callback.call(obj[i], obj[i], i))break;
            }
        }

        function noRepeat(arr) {
            var arr2 = [], o = {};
            each(arr, function () {
                if (!o[this.valueOf()]) {
                    arr2.push(this.valueOf());
                    o[this.valueOf()];
                }
            });
            return arr2;
        }

        function groSelect(selector, context, results) {
            var selectors = selector.split(",");
            each(selectors, function () {
                results = get(this.valueOf(), context, results);
            });
            return results;
        }

        function subSelect(selector, context, results) {
            context = context || document;
            var selectors = selector.split(" ");
            each(selectors, function () {
                results = get(this.valueOf(), context, results);
                context = results;
            });
            return results;
        }

        function select(selector, context, results) {
            results = results || [];
            each(selector.split(","), function () {
                var reg = context;
                each(this.split(" "), function () {
                    reg = subSelect(this.valueOf(), reg);
                });
                results.push.apply(results, reg);
            });
            results = noRepeat(results);
            return results;
        }

        return select;
    }());
    itcast.fn.init.prototype = itcast.prototype;
    w.I = w.itcast = itcast;
}(window));
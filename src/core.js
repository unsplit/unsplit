function $(element) {
    if(typeof element === "string") {
        $element.selected = document.querySelector(element);
    } else {
        $element.selected = element;
    }
    return $element;
}

var $browser = {
    belowIE10: function() {
      return /MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) < 10;
    }
};

var $scope = {};

var $events = {
    terms: [{
        "name": "enter",
        "code": 13
    }, {
        "name": "space",
        "code": 32
    }],
    find: function(term) {
        for (var i = this.terms.length - 1; i >= 0; i--) {
            if(this.terms[i].name === term){
                return this.terms[i];
            }
        };
    }
};

var $element = {
    selected: {},
    ready: function(onLoad) {
        window.onload = function() {
            onLoad();

            var keysPressed = document.querySelectorAll('[data-keypress]'),
                repeats = document.querySelectorAll('[data-repeat]'),
                templates = document.querySelectorAll('[data-template]');

            for (i = 0; i < templates.length; i++) {
                var template = $(templates[i]),
                    attrs = template.attributes(),
                    url   = attrs["data-template"].value;

                $ajax.get(url).success(function(contents) {
                    template.template($scope, contents);
                });
            };

            for (i = 0; i < repeats.length; i++) {
                var repeat = $(repeats[i]),
                    attrs  = repeat.attributes(),
                    val    = attrs["data-repeat"].value,
                    data   = val.split(" in "),
                    item   = data[0],
                    obj    = data[1],
                    scope  = $scope[obj],
                    temp   = repeats[i].outerHTML;

                for (s = 0; s < scope.length; s++) {
                    repeat.append(temp);
                };

                var holder;

                for (c = 0; c < repeats[i].childNodes.length; c++) {
                    if(repeats[i].childNodes[c].nodeName == repeats[i].nodeName) {
                        if(c === 1) {
                            holder = repeats[i].childNodes[c].outerHTML;
                        } else {
                            holder += repeats[i].childNodes[c].outerHTML;
                        }
                    }
                };

                repeats[i].outerHTML = holder;

            };

            for (i = 0; i < keysPressed.length; i++) {
                var kp = $(keysPressed[i]),
                    attrs = kp.attributes(),
                    expression = attrs["data-keypress"].value;

                    kp.keypress(expression);
            };

        }
    },
    attr: function (value, newValue) {
        for (i = 0; i < this.selected.attributes.length; i++) {
            var attribute = this.selected.attributes[i];

            if (attribute.name === value) {
                if(newValue) {
                    attribute.value = newValue;
                }
                return attribute.value;
            }
        }
    },
    attributes: function () {
        return this.selected.attributes;
    },
    hasClass: function (theClass) {
        for (i = 0; i < this.selected.attributes.length; i++) {
            var attribute = this.selected.attributes[i];
            if (attribute.name === "class") {
                var classes = attribute.value.split(" ");
            }
        }
        for (i = 0; i < classes.length; i++) {
            if(classes[i] === theClass){
                var status = true;
            }
        }
        if(status === true) {
            return true;
        } else {
            return false;
        }
    },
    append: function (item) {
        this.selected.innerHTML += item;
        return this;
    },
    position: function () {
        var xPosition = 0;
        var yPosition = 0;
      
        while(this.selected) {
            xPosition += (this.selected.offsetLeft - this.selected.scrollLeft + this.selected.clientLeft);
            yPosition += (this.selected.offsetTop - this.selected.scrollTop + this.selected.clientTop);
            this.selected = this.selected.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    },
    html: function (newHTML) {
        if(newHTML) {
            this.selected.innerHTML = newHTML;
            return this;
        } else {
            return this.selected.innerHTML;
        }
    },
    addClass: function (newClass) {
        if (this.selected.getAttribute("class") === null) {
            var att = document.createAttribute("class");
                att.value = newClass;
                this.selected.setAttributeNode(att);
        } else {
            var att = this.selected.getAttribute("class") + " " + newClass;
            this.selected.setAttribute("class", att);
        }
        return this;
    },
    removeClass: function (deleteClass) {
        for (i = 0; i < this.selected.attributes.length; i++) {
            var attribute = this.selected.attributes[i];
            if (attribute.name === "class" && attribute.value !== "") {
                attribute.value = "";
            }
        }
        return this;
    },
    click: function(toRun) {
        this.selected.onclick = function(e) {
            console.log(e.preventDefault());
            toRun();
        };
        return this;
    },
    fadeIn: function () {
        var el = this.selected;
        if (el.classList.contains('is-hidden')) {
            el.classList.remove('is-hidden');
        }
        el.style.opacity = 0;

        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += 0.1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    },
    fadeOut: function () {
        var el = this.selected;
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= 0.1) < 0) {
                el.style.display = 'none';
                el.classList.add('is-hidden');
            } else {
                requestAnimationFrame(fade);
            }
        })();
    },
    ga: function(category, label, value) {
        //ga('send', 'event', category, 'click', label, value);
        console.log("send", "event", category, "click", label, value);
        return this;
    },
    parent: function() {
        this.selected = this.selected.parentNode;
        return this;
    },
    repeat: function(repeatBy, toRun) {
        var elem = this.parent().position(),
        nearest = document.elementFromPoint(elem.x, elem.y);

        return this;
    },
    keypress: function(expression, toRun) {
        var spl = expression.split(":");

        if(spl.length > 1) {
            for (var i = spl.length - 1; i >= 0; i--) {
                spl[i] = spl[i].replace(/\s+/g, ''); 
                spl[i] = spl[i].split("(");
            };

            var term = spl[0][0],
                find = $events.find(term);

            if(find && typeof $scope[spl[1][0]] === "function") {  
                this.selected.onkeypress = function(e) {
                   if (e.keyCode === find.code) {
                        return $scope[spl[1][0]]();
                   }
                }
            } else {
                throw new Error("You have an error in your expression");
            }
        } else {
            var term = spl[0],
                find = $events.find(term);

            if(find && typeof toRun === "function") {  
                this.selected.onkeypress = function(e) {
                   if (e.keyCode === find.code) {
                        return toRun(e);
                   }
                }
            } else {
                throw new Error("You have an error in your expression");
            }
        }
    },
    template: function(input, template) {
        if(typeof Handlebars === "undefined") {
            if(typeof input !== "object") {
                if(template) {
                    var complied = Mustache.render(template, {data: input});
                    //var compiled = Handlebars.compile(template);
                    this.selected.innerHTML += complied;
                } else {
                    throw new Error("you have not specified a template");
                }
            } else {
                if(/<[a-z][\s\S]*>/i.test(input.template)) {
                    var compiled = Mustache.render(input.template, { data: input.data });
                    this.selected.innerHTML += compiled;
                } else {
                    var handle = Mustache.render(template, input);
                    this.selected.innerHTML += handle;
                }
            }
        } else {
            if(typeof input !== "object") {
                if(template) {
                    var compiled = Handlebars.compile(template);
                    this.selected.innerHTML += compiled({ data: input });
                } else {
                    throw new Error("you have not specified a template");
                }
            } else {
                if(/<[a-z][\s\S]*>/i.test(input.template)) {
                    var compiled = Handlebars.compile(input.template);
                    this.selected.innerHTML += compiled({ data: input.data });
                } else {
                    var handle = Handlebars.compile(template),
                        html = handle(input);

                    this.selected.innerHTML += html;
                }
            }
        }
        return this;
    }
};
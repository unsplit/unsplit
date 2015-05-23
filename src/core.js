function $(element) {
    if(typeof element === "string") {
        $element.selected = document.querySelector(element);
    } else {
        $element.selected = element;
    }
<<<<<<< HEAD
    if(typeof Handlebars !== "undefined"){}
=======

    if(typeof Handlebars !== "undefined"){}

>>>>>>> d4c5e1f0e6675fb6fc21365d4545f42d353cd2d3
    return $element;
}

var $element = {
    selected: {},
    ready: function(onLoad) {
        window.onload = onLoad;
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
    html: function (newHTML) {
        if(newHTML) {
            var currentClass = this.selected.attributes.class.nodeValue;
<<<<<<< HEAD
=======

>>>>>>> d4c5e1f0e6675fb6fc21365d4545f42d353cd2d3
            this.selected.innerHTML = newHTML;
            return this;
        } else {
            return this.selected.innerHTML;
        }
    },
    addClass: function (newClass) {
        for (i = 0; i < this.selected.attributes.length; i++) {
            var attribute = this.selected.attributes[i];
<<<<<<< HEAD
=======

>>>>>>> d4c5e1f0e6675fb6fc21365d4545f42d353cd2d3
            if (attribute.name === "class" && attribute.value !== "") {
                attribute.value += " " + newClass;
            }
        }
        return this;
    },
    removeClass: function (deleteClass) {
        for (i = 0; i < this.selected.attributes.length; i++) {
            var attribute = this.selected.attributes[i];
<<<<<<< HEAD
=======

>>>>>>> d4c5e1f0e6675fb6fc21365d4545f42d353cd2d3
            if (attribute.name === "class" && attribute.value !== "") {
                attribute.value = "";
            }
        }
        return this;
    },
    click: function(toRun) {
        this.selected.onclick = toRun;
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
<<<<<<< HEAD
=======

>>>>>>> d4c5e1f0e6675fb6fc21365d4545f42d353cd2d3
        //ga('send', 'event', category, 'click', label, value);
        console.log("send", "event", category, "click", label, value);
        return this;
    },
<<<<<<< HEAD
    handlebars: function(input, template) {
       if(typeof input !== "object") {
            if(template) {
                var compiled = Handlebars.compile(template);
                this.selected.innerHTML += compiled({ data: input });
            } else {
                console.log("you have not specified a template");
            }
        } else {
            if(/<[a-z][\s\S]*>/i.test(input.template)) {
            var compiled = Handlebars.compile(input.template);
            this.selected.innerHTML += compiled({ data: input.data });
            } else {

            }
        }
        return this;
    }
};
=======
    handleBars: function(data, html) {

       compiled = Handlebars.compile(html);

       this.selected.innerHTML += compiled({ data: data });

       return this;
    }
};
>>>>>>> d4c5e1f0e6675fb6fc21365d4545f42d353cd2d3

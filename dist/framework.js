function $(element) {
    if(typeof element === "string") {
        $element.selected = document.querySelector(element);
    } else {
        $element.selected = element;
    }
    if(typeof Handlebars !== "undefined"){}
    return $element;
}

var $element = {
    selected: {},
    ready: function(onLoad) {
        //window.onload = onLoad;
        document.addEventListener("DOMContentLoaded", function(event) {
           window.onload = onLoad();
        });
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
            this.selected.innerHTML = newHTML;
            return this;
        } else {
            return this.selected.innerHTML;
        }
    },
    addClass: function (newClass) {
        for (i = 0; i < this.selected.attributes.length; i++) {
            var attribute = this.selected.attributes[i];
            if (attribute.name === "class" && attribute.value !== "") {
                attribute.value += " " + newClass;
            }
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
        //ga('send', 'event', category, 'click', label, value);
        console.log("send", "event", category, "click", label, value);
        return this;
    },
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

var $ajax = {
    xhr: {},
    get: function(url, async) {
      var xhr = new XMLHttpRequest();
      if(typeof async === "boolean") {
         xhr.open("GET", url, async);
         xhr.send(null);
         this.xhr = xhr;
      } else {
         if(typeof async === "undefined") {
            xhr.open("GET", url, false);
            xhr.send(null);
            this.xhr = xhr;
         } else {
            throw new Error("Async needs to be a boolean");
         }
      }
      if(typeof url !== "string") {
         throw new Error("Not a valid URL");
      }
      return this;
    },
    success: function(funct) {
      function tryParseJSON (jsonString){
        try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
        // so we must check for that, too.
           if (o && typeof o === "object" && o !== null) {
               return o;
           }
        }
        catch (e) { }

        return false;
      };
      function getArgument(f) {
        return f.toString().split(')',1)[0].replace(/\s/g,'').substr(9).split(',')[0];
      };
      var isJSON = tryParseJSON(this.xhr.responseText);
      if(isJSON !== false) {
         funct(isJSON);
      } else {
         funct(this.xhr.response);
      }
    }
};

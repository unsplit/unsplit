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
         funct(this.xhr.responseText);
      }
    }
};

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports) {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    Mustache = {};
    factory(Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
    case -1:
      match = this.tail;
      this.tail = '';
      break;
    case 0:
      match = '';
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (name in cache) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1 && value != null)
              lookupHit = (typeof value === 'object') &&
                value.hasOwnProperty(names[index]);
            value = value[names[index++]];
          }
        } else if (context.view != null && typeof context.view === 'object') {
          value = context.view[name];
          lookupHit = context.view.hasOwnProperty(name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.0.0';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

# unsplit

[![Build Status](https://travis-ci.org/unsplit/unsplit.svg?branch=master)](https://travis-ci.org/unsplit/unsplit)
[![Code Climate](https://codeclimate.com/github/unsplit/unsplit/badges/gpa.svg)](https://codeclimate.com/github/unsplit/unsplit)
[![Test Coverage](https://codeclimate.com/github/unsplit/unsplit/badges/coverage.svg)](https://codeclimate.com/github/unsplit/unsplit/coverage)
[![Join the chat at https://gitter.im/unsplit/unsplit](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/unsplit/unsplit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)


A lightweight framework for rapid development with Javascript.

## Getting started

#### Standard

Download either the minified or un-minifed version from the ```dist``` folder. 

```html
<script type="text/javascript" src="dist/unsplit.min.js"></script>
```

#### Grunt

Clone our repository and install the modules to build unsplit with Grunt (NOTE: You will need to have nodeJS installed):

```bash
git clone https://github.com/unsplit/unsplit.git
cd unsplit && npm install
grunt
```

To change what is include in the build, edit the ```Gruntfile.js``` and look for the ```fileOrder``` array.

#### Generator
We provide a generator for unsplit, which allows you to specify in the url which modules/plugins get included. You can either clone the 
[Generator](http://github.com/unsplit/generator) repository and link through to it or you can link through to ours:

```html
http://generator.unspl.it/?core,ajax,handlebars
```

## API

###$(element)
Pass through an element such as ```document``` or query based on CSS selectors.

##### Example:

```javascript
$(document)
$(".main")
$("[name=woo]")
```

#### .ready()

Specify a function to execute when the DOM is fully loaded.

##### Example:

```javascript
$(document).ready(function(){
  // Document has loaded
  console.log("i'm awake");
});
```

#### .addClass()
```javascript
$(".hello").addClass("wooo");
```

#### .removeClass()
```javascript
$(".hello").removeClass("wooo");
```

#### .click()
```javascript
$(".buttonToClick").click(function(e) {
  // do whatever
});
```

#### .html()
To recieve the html:
```javascript
$(".hello").html();
```

To change the html
```javascript
$(".hello").html("New html");
```

#### .position()
```javascript
var pos = $(".middle").position();

console.log(pos.x, pos.y);
```

#### .attr()
To recieve the attribute's value: 
```javascript
$(".hello").attr("name");
```

To change the value:
```javascript
$(".hello").attr("name", "Michael");
```

#### .hasClass()
```javascript
$(".hello").hasClass("there");
```

#### .append()
Insert text or HTML
```javascript
$(".hello").append("new text");
```

```javascript
$(".hello").append("<div><i>new</i> <b>html</b></div>");
```

### $ajax

#### .get()

```javascript
$ajax.get("http://unspl.it/package.json").success(function(data){
   // successfully got the json file with automatic json parse
});
```

#### more coming soon!

### $scope

#### initialization

```javascript
$(document).ready(function(){
   $scope.games = [{
     name: "resident evil"
   }];
   $scope.test = function() {
     console.log("im running son!");
   };
});
```
#### data-template
Request a template via url, this is handy for keeping your code in small chunks.
```html
<div data-template="templates/test.html"></div>

<!-- templates/test.html -->
{{#games}}
* {{name}}
{{/games}}
```

#### data-repeat

Repeat the DOM element by an array/object

```html
<div data-repeat="game in games">
  {{name}}
</div>
```

#### data-keypress
On a particular keypress, run a function in the scope

```html
<input type="text" data-keypress="enter: test()"/>
```

#### more coming soon!

## Plugins
We want to keep the core of unsplit minimal, so you can choose exactly what you need from the framework. Here you will find a list of plugins which are 
supported within the core:

| Name | Status | Website | API |
|-------------|---------------|--------------------------|---------------------------------------|
| Mustache | development | http://mustache.github.io/ | ```$("#container").template(html)```|
| Handlebars | development | http://handlebarsjs.com/ | ```$("#container").template(html)```|
| Google Analytics | development | [http://developers.google.com](https://developers.google.com/analytics/devguides/collection/analyticsjs/) | ```ga(category, label, value)``` |


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

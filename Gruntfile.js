module.exports = function(grunt) {

 var fileOrder = [
    'src/core.js',
    'src/components/ajax.js'
 ];

 grunt.initConfig({
   concat: {
    dist: {
      src: fileOrder,
      dest: 'dist/unsplit.js',
    },
   },
   uglify: {
     options: {
       mangle: false
     },
     my_target: {
       files: {
         'dist/unsplit.min.js': fileOrder
       }
     }
   },
   watch: {
     scripts: {
       files: fileOrder,
       tasks: ['concat', 'uglify'],
       options: {
         spawn: false,
       },
     },
   }
 });

 grunt.loadNpmTasks('grunt-contrib-uglify');

 grunt.loadNpmTasks('grunt-contrib-concat');

grunt.loadNpmTasks('grunt-contrib-watch');

 grunt.registerTask('default', ['uglify', 'concat', 'watch']);

};

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        autoprefixer:{
            dist:{
                files:{
                    'css/style.css':'../production/css/style.css'
                }
            }
        },
        concat: {
            dist: {
                src: 'js/mvvm-build/*.js',
                dest: 'js/main.js',
            }
        },
        uglify: {
            development: {
                files: {
                    /* Minify in development folder */
                    'js/main.min.js': 'js/main.js'
                }
            },
            production: {
                files: {
                    /* Minify in production folder */
                    '../production/js/main.min.js': 'js/main.js'
                }
            }
        }
    });
    /* CSS Tasks */
    grunt.loadNpmTasks('grunt-autoprefixer');
    /* JS Tasks */
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    /* Default Task */
    grunt.registerTask('default', ['autoprefixer', 'concat', 'uglify']);
}
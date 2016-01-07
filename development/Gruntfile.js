module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'development/',
                    src: ['**'],
                    dest: 'production/',
                    options: {
                        process: function (content, srcpath) {
                            return content.replace(/[main.js]/,"main.min.js");
                        },
                    },
                }]
            },
        },
        autoprefixer:{
            dist:{
                files:{
                    'css/main.css':'../production/css/main.css'
                }
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
    /* All Files */
    grunt.loadNpmTasks('grunt-contrib-copy');
    /* CSS Tasks */
    grunt.loadNpmTasks('grunt-autoprefixer');
    /* JS Tasks */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    /* Default Task */
    grunt.registerTask('default', ['autoprefixer', 'uglify']);
}
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        autoprefixer:{
            dist:{
                files:{
                    'css/main.css':'../production/css/main.css'
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            production: {
                files: {
                    /* Minify in production folder */
                    '../production/js/main.min.js': 'js/main.js'
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: '../development',
                    src: ['**/*', '!Gruntfile.js', '!**node_modules/**', '!package.json',  '!**bower_components/**', 'bower_components/jquery/dist/jquery.min.js', 'bower_components/knockout/dist/knockout.js'],
                    dest: '../production/'
                }]
            },
        },
        'string-replace': {
            dist: {
                files: {
                    '../production/index.html': '../production/index.html'
                },
                options: {
                    replacements: [{
                        pattern: 'main.js',
                        replacement: 'main.min.js'
                    }]
                }
            }
        }
    });
    /* All Files */
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    /* CSS Tasks */
    grunt.loadNpmTasks('grunt-autoprefixer');
    /* JS Tasks */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    /* Default Task */
    grunt.registerTask('default', ['autoprefixer', 'uglify', 'copy', 'string-replace']);
}
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        autoprefixer:{
            dist:{
                files:{
                    'development/css/main.css':'production/css/main.css'
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
                    'production/js/main.min.js': 'development/js/main.js'
                }
            }
        },
        clean: ['production'],
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: '/',
                    src: ['**/*', '!Gruntfile.js', '!**node_modules/**', '!package.json',  '!**development/bower_components/**', 'development/bower_components/jquery/dist/jquery.min.js', 'development/bower_components/knockout/dist/knockout.js'],
                    dest: 'production/'
                }]
            },
        },
        'string-replace': {
            dist: {
                files: {
                    'production/index.html': 'production/index.html'
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
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    /* CSS Tasks */
    grunt.loadNpmTasks('grunt-autoprefixer');
    /* JS Tasks */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    /* Default Task */
    grunt.registerTask('default', ['clean', 'autoprefixer', 'uglify', 'copy', 'string-replace']);
}
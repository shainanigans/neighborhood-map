module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        autoprefixer:{
            dist:{
                files:{
                    'development/css/main.css':'development/css/main.css'
                }
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            production: {
                files: [
                    {
                        'production/js/main.min.js': 'development/js/main.js'
                    },
                    {
                        'production/js/error.min.js': 'development/js/error.js'
                    }
                ]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'development/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'production/css',
                    ext: '.min.css'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'production/index.html': 'production/index.html'
                }
            }
        },

        clean: ['production/'],

        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'development',
                    src: ['**/*', '!**/bower_components/**', '!**/main.js', '!**/error.js', '!**/main.css','!**/normalize.css', 'bower_components/jquery/dist/jquery.min.js', 'bower_components/knockout/dist/knockout.js'],
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
                    replacements: [
                        {
                            pattern: 'main.js',
                            replacement: 'main.min.js'
                        },
                        {
                            pattern: 'error.js',
                            replacement: 'error.min.js'
                        },
                        {
                            pattern: 'main.css',
                            replacement: 'main.min.css'
                        }
                    ]
                }
            }
        }
    });

    /* All Files */
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');
    /* HTML Tasks */
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    /* CSS Tasks */
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    /* JS Tasks */
    grunt.loadNpmTasks('grunt-contrib-uglify');

    /* Default Task */
    grunt.registerTask('default', ['clean', 'copy', 'autoprefixer', 'htmlmin', 'cssmin', 'uglify', 'string-replace']);
}
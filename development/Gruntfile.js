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
                    src: ['**/*', '!Gruntfile.js', '!**node_modules/**', '!package.json', '!**js/main.js', '!**bower_components/**', 'bower_components/jquery/dist/jquery.min.js', 'bower_components/knockout/dist/knockout.js'],
                    dest: '../production/',
                    options: {
                        process: function (content, srcpath) {
                            return content.replace('main.js', 'main.min.js');
                        },
                    },
                }]
            },
        }
    });
    /* All Files */
    grunt.loadNpmTasks('grunt-contrib-copy');
    /* CSS Tasks */
    grunt.loadNpmTasks('grunt-autoprefixer');
    /* JS Tasks */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    /* Default Task */
    grunt.registerTask('default', ['autoprefixer', 'uglify', 'copy']);
}
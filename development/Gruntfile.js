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
                    src: ['**/*', '!Gruntfile.js', '!**node_modules/**', '!package.json', '!**js/main.js'],
                    dest: '../production/',
                    options: {
                        process: function (content, srcpath) {
                            return content.replace(/[main\.js]/g, 'main.min.js');
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